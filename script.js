const servers = window.servers;

// ========== OKLCH Color Normalization ==========
// HEX -> RGB -> Linear RGB -> XYZ -> OKLAB -> OKLCH 변환 후 정규화

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    };
}

function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c) {
    return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function rgbToOklab(r, g, b) {
    const lr = srgbToLinear(r);
    const lg = srgbToLinear(g);
    const lb = srgbToLinear(b);

    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    return {
        L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    };
}

function oklabToLinearRgb(L, a, b) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    return {
        lr: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        lg: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        lb: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    };
}

function oklabToRgb(L, a, b) {
    const { lr, lg, lb } = oklabToLinearRgb(L, a, b);

    return {
        r: Math.max(0, Math.min(1, linearToSrgb(lr))),
        g: Math.max(0, Math.min(1, linearToSrgb(lg))),
        b: Math.max(0, Math.min(1, linearToSrgb(lb)))
    };
}

// sRGB gamut 내에서 최대 채도를 이진 탐색으로 찾음
function findMaxChromaInGamut(L, h) {
    const hRad = h * Math.PI / 180;
    let low = 0;
    let high = 0.4;

    for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const a = mid * Math.cos(hRad);
        const b = mid * Math.sin(hRad);
        const { lr, lg, lb } = oklabToLinearRgb(L, a, b);

        if (lr < -0.0001 || lr > 1.0001 || lg < -0.0001 || lg > 1.0001 || lb < -0.0001 || lb > 1.0001) {
            high = mid;
        } else {
            low = mid;
        }
    }

    return low;
}

function oklabToOklch(L, a, b) {
    const C = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) * 180 / Math.PI;
    if (h < 0) h += 360;
    return { L, C, h };
}

function oklchToOklab(L, C, h) {
    const hRad = h * Math.PI / 180;
    return {
        L,
        a: C * Math.cos(hRad),
        b: C * Math.sin(hRad)
    };
}

function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 색상을 OKLCH로 변환 후 밝기(L)와 채도(C)를 정규화
function normalizeColorForDarkTheme(hexColor) {
    const rgb = hexToRgb(hexColor);
    const oklab = rgbToOklab(rgb.r, rgb.g, rgb.b);
    const oklch = oklabToOklch(oklab.L, oklab.a, oklab.b);

    // 다크 테마용: 밝기 0.65~0.75, 채도 0.12~0.18로 정규화 (부드러운 포인트 색상)
    const normalizedL = 0.70;  // 고정된 밝기
    const h = oklch.h;  // 색상(Hue)은 원본 유지

    // 해당 L과 h에서 sRGB gamut 내 최대 채도 계산
    const maxC = findMaxChromaInGamut(normalizedL, h);
    // 원하는 채도 범위(0.12~0.18)와 gamut 한계 중 작은 값 사용
    const targetC = Math.min(Math.max(oklch.C, 0.12), 0.18);
    const normalizedC = Math.min(targetC, maxC * 0.99);

    const normalizedOklab = oklchToOklab(normalizedL, normalizedC, h);
    const normalizedRgb = oklabToRgb(normalizedOklab.L, normalizedOklab.a, normalizedOklab.b);

    return rgbToHex(normalizedRgb.r, normalizedRgb.g, normalizedRgb.b);
}

// OKLCH 문자열로 반환 (CSS에서 직접 사용 가능)
function hexToNormalizedOklch(hexColor, hueShift = 0) {
    const rgb = hexToRgb(hexColor);
    const oklab = rgbToOklab(rgb.r, rgb.g, rgb.b);
    const oklch = oklabToOklch(oklab.L, oklab.a, oklab.b);

    // 다크 테마용 정규화
    const normalizedL = 0.70;
    let h = (oklch.h + hueShift) % 360;
    if (h < 0) h += 360;

    // 해당 L과 h에서 sRGB gamut 내 최대 채도 계산
    const maxC = findMaxChromaInGamut(normalizedL, h);
    // 원하는 채도 범위(0.12~0.18)와 gamut 한계 중 작은 값 사용
    const targetC = Math.min(Math.max(oklch.C, 0.12), 0.18);
    const normalizedC = Math.min(targetC, maxC * 0.99); // 약간의 여유

    return `oklch(${normalizedL} ${normalizedC.toFixed(3)} ${h.toFixed(1)})`;
}

// 그라데이션용 두 색상 반환 (Hue를 ±15도 조정)
function getGradientColors(hexColor) {
    const color1 = hexToNormalizedOklch(hexColor, -15);  // Hue 약간 낮춤
    const color2 = hexToNormalizedOklch(hexColor, 15);   // Hue 약간 높임
    return { color1, color2 };
}

function getHueFromHex(hex) {
    const rgb = hexToRgb(hex);
    const oklab = rgbToOklab(rgb.r, rgb.g, rgb.b);
    const oklch = oklabToOklch(oklab.L, oklab.a, oklab.b);
    return oklch.h;
}

// ========== End Color Normalization ==========

const tagDescriptions = window.tagDescriptions || {};

// 툴팁 엘리먼트 생성
const tooltipEl = document.createElement('div');
tooltipEl.className = 'tag-tooltip';
document.body.appendChild(tooltipEl);

let activeTooltipTag = null;

function showTooltip(tag) {
    const text = tag.dataset.tooltip;
    if (!text) return;

    tooltipEl.textContent = text;
    tooltipEl.classList.add('visible');
    activeTooltipTag = tag;

    // 위치 계산
    const rect = tag.getBoundingClientRect();
    tooltipEl.style.left = '0';
    tooltipEl.style.top = '0';

    const tooltipRect = tooltipEl.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 8;

    // 화면 경계 체크
    const padding = 10;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top + tooltipRect.height > window.innerHeight - padding) {
        top = rect.top - tooltipRect.height - 8;
    }

    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
}

function hideTooltip() {
    tooltipEl.classList.remove('visible');
    activeTooltipTag = null;
}

function createTag(tagText) {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tagText;
    if (tagDescriptions[tagText]) {
        span.dataset.tooltip = tagDescriptions[tagText];

        // 데스크탑: 호버 (모든 태그에서 동작)
        span.addEventListener('mouseenter', () => showTooltip(span));
        span.addEventListener('mouseleave', hideTooltip);
    }

    // 클릭/탭
    span.addEventListener('click', (e) => {
        // 서버 카드 내부는 클릭 통과 → 디테일 모달 열림
        if (span.closest('.card') && !span.closest('.detail-card')) return;

        e.stopPropagation();
        e.preventDefault();
        if (!span.dataset.tooltip) return;

        if (activeTooltipTag === span) {
            hideTooltip();
        } else {
            showTooltip(span);
        }
    });

    return span;
}

// 다른 곳 클릭 시 툴팁 해제
document.addEventListener('click', hideTooltip);

const grid = document.getElementById('grid');
const detailView = document.getElementById('detailView');
const detailCard = document.getElementById('detailCard');
const themeToggle = document.getElementById('themeToggle');

// Time Machine Elements
const timeMachineBtn = document.getElementById('timeMachineBtn');
const timeMachinePopup = document.getElementById('timeMachinePopup');
const timeMachineSlider = document.getElementById('timeMachineSlider');
const timeMachineDisplay = document.getElementById('timeMachineDisplay');
const timeMachinePopupDisplay = document.getElementById('timeMachinePopupDisplay');

// Detail Elements
const detailTitle = document.getElementById('detailTitle');
const detailApps = document.getElementById('detailTags');
const detailDesc = document.getElementById('detailDesc');
const detailRelatedLinks = document.getElementById('detailRelatedLinks');
const connectBtn = document.getElementById('connectBtn');
const backBtn = document.getElementById('backBtn');

let activeCardId = null;

// Initialize Theme (기본값: 다크 모드)
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeButton(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
    const icon = theme === 'dark' ? '☀️' : '🌙';
    const text = theme === 'dark' ? '라이트 모드' : '다크 모드';
    themeToggle.innerHTML = `<span class="theme-icon">${icon}</span><span class="theme-text">${text}</span>`;
}

// ========== Time Machine Logic ==========
let currentMaxYear = 2026;

function updateTimeMachineDisplay() {
    const val = timeMachineSlider.value;
    const num = parseFloat(val);
    
    let formatted = '타임머신';
    if (num < currentMaxYear) {
        const year = Math.floor(num);
        const shortYear = year.toString().slice(-2);
        const half = num % 1 === 0 ? '전반' : '후반';
        formatted = `${shortYear}년 ${half}`;
    }
    
    timeMachineDisplay.textContent = formatted;
    timeMachinePopupDisplay.textContent = formatted;

    if (num < currentMaxYear) {
        timeMachineBtn.classList.add('time-active');
        document.body.classList.add('old-time-filter');
    } else {
        timeMachineBtn.classList.remove('time-active');
        document.body.classList.remove('old-time-filter');
    }
}

function updateTimeMachineCards(isInit = false) {
    const val = timeMachineSlider.value;
    const timeValue = parseFloat(val);
    const allItems = document.querySelectorAll('.card, .utility-card');
    allItems.forEach(item => {
        const startStr = item.dataset.start;
        const endStr = item.dataset.end;
        const start = startStr && startStr !== 'null' ? parseFloat(startStr) : -Infinity;
        const end = endStr && endStr !== 'null' ? parseFloat(endStr) : Infinity;

        const shouldShow = (timeValue >= start && timeValue < end);
        const isShown = item.style.display !== 'none' && !item.classList.contains('animating-out');

        if (shouldShow && !isShown) {
            item.style.display = '';
            if (!isInit) {
                item.classList.remove('animating-out');
                item.classList.add('animating-in');
                item.onanimationend = (event) => {
                    if (event.animationName === 'cardShow') {
                        item.classList.remove('animating-in');
                    }
                };
            }
        } else if (!shouldShow && isShown) {
            if (isInit) {
                item.style.display = 'none';
            } else {
                item.classList.remove('animating-in');
                item.classList.add('animating-out');
                item.onanimationend = (event) => {
                    if (event.animationName === 'cardHide') {
                        item.style.display = 'none';
                        item.classList.remove('animating-out');
                    }
                };
            }
        }
    });
}

function initTimeMachine() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1 to 12
    currentMaxYear = currentYear;
    if (currentMonth >= 7) {
        currentMaxYear += 0.5;
    }

    timeMachineSlider.max = currentMaxYear;
    timeMachineSlider.value = currentMaxYear;

    // Initial UI update
    updateTimeMachineDisplay();
    updateTimeMachineCards(true);

    timeMachineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        timeMachinePopup.classList.toggle('active');
    });

    timeMachinePopup.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing when interacting with slider
    });

    document.addEventListener('click', () => {
        timeMachinePopup.classList.remove('active');
    });

    timeMachineSlider.addEventListener('input', updateTimeMachineDisplay);
    timeMachineSlider.addEventListener('change', () => updateTimeMachineCards(false));
}
// ========== End Time Machine Logic ==========

// State for valid servers for random join
window.activeServers = [];

// Store player counts globally to persist across re-renders
const serverPlayerCounts = {};

function renderServers(sortType = 'default') {
    // Clear existing grid
    grid.innerHTML = '';
    
    // Copy the servers array to avoid mutating the original source
    let sortedServers = [...servers];
    
    // Apply sorting
    if (sortType === 'players') {
        sortedServers.sort((a, b) => {
            const countA = (serverPlayerCounts[a.id] !== undefined) ? serverPlayerCounts[a.id] : -1;
            const countB = (serverPlayerCounts[b.id] !== undefined) ? serverPlayerCounts[b.id] : -1;
            return countB - countA; // Descending
        });
    } else if (sortType === 'hue') {
        sortedServers.sort((a, b) => {
            return getHueFromHex(a.color) - getHueFromHex(b.color);
        });
    } else if (sortType === 'name') {
        sortedServers.sort((a, b) => a.name > b.name ? 1 : -1);
    } else if (sortType === 'random') {
        sortedServers.sort(() => Math.random() - 0.5);
    }
    // 'default' uses the original order in data.js

    sortedServers.forEach(server => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = server.id;
        card.dataset.start = server.startYear;
        card.dataset.end = server.endYear;

        // OKLCH로 정규화된 그라데이션 색상 적용
        const { color1, color2 } = getGradientColors(server.color);
        card.style.setProperty('--card-accent-1', color1);
        card.style.setProperty('--card-accent-2', color2);

        const header = document.createElement('div');
        header.className = 'card-header';

        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = server.name;

        const playerCount = document.createElement('div');
        playerCount.className = 'player-count';
        
        // Initial text based on current knowledge
        const storedCount = serverPlayerCounts[server.id];
        if (server.url === '#') {
            playerCount.textContent = '이용 불가';
        } else if (storedCount !== undefined) {
            if (storedCount === -1) playerCount.textContent = '알 수 없음';
            else playerCount.textContent = `${storedCount}명`;
        } else {
            playerCount.textContent = '확인 중...';
        }

        header.appendChild(title);
        header.appendChild(playerCount);

        const tags = document.createElement('div');
        tags.className = 'card-tags';
        server.tags.forEach(tag => {
            tags.appendChild(createTag(tag));
        });

        card.appendChild(header);
        card.appendChild(tags);

        card.addEventListener('click', () => openDetail(server, card));

        grid.appendChild(card);

        // Fetch player count if not already fetched
        if (server.url !== '#' && serverPlayerCounts[server.id] === undefined) {
            if (server.name === '끄투 온라인' || server.id === 'kkutuonline' || server.id === 'kkutu') {
                serverPlayerCounts[server.id] = -1;
                playerCount.textContent = '알 수 없음';
                // 끄투 온라인은 인원이 알 수 없음이어도 접속 가능하므로 후보에 추가
                if (!window.activeServers.includes(server)) {
                    window.activeServers.push(server);
                }
            } else {
                const targetUrl = (server.name === '끄투코리아' || server.id === 'kkutukorea')
                    ? new URL('/o/servers', server.url).href
                    : new URL('/servers', server.url).href;

                const fetchUrl = '/api/proxy?url=' + encodeURIComponent(targetUrl);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                fetch(fetchUrl, { signal: controller.signal })
                    .then(res => {
                        if (!res.ok) throw new Error('Network error');
                        return res.json();
                    })
                    .then(data => {
                        clearTimeout(timeoutId);
                        if (data && data.list) {
                            const total = data.list.reduce((acc, val) => acc + (val || 0), 0);
                            serverPlayerCounts[server.id] = total;
                            playerCount.textContent = `${total}명`;
                            if (!window.activeServers.includes(server)) {
                                window.activeServers.push(server);
                            }
                            
                            // If currently sorting by players, we might want to re-sort
                            // But doing it for every single fetch might be too much.
                            // We'll let the user manually refresh or trigger sort again.
                        } else {
                            serverPlayerCounts[server.id] = -1;
                            playerCount.textContent = '알 수 없음';
                        }
                    })
                    .catch(err => {
                        clearTimeout(timeoutId);
                        serverPlayerCounts[server.id] = -1;
                        playerCount.textContent = '알 수 없음';
                    });
            }
        }
    });

    // Re-initialize Time Machine visibility for new cards
    if (typeof updateTimeMachineCards === 'function') {
        updateTimeMachineCards(true);
    }
}

// Sorting UI element
const serverSort = document.getElementById('serverSort');

// Initial render with saved sort preference
const savedSort = localStorage.getItem('server-sort') || 'default';
if (serverSort) serverSort.value = savedSort;
renderServers(savedSort);

// Sorting Event Listener
if (serverSort) {
    serverSort.addEventListener('change', (e) => {
        const sortType = e.target.value;
        localStorage.setItem('server-sort', sortType);
        renderServers(sortType);
    });
}

// Random Server Join
const randomServerBtn = document.getElementById('randomServerBtn');
if (randomServerBtn) {
    randomServerBtn.addEventListener('click', () => {
        // 현재 타임머신 설정 값 확인
        const timeValue = parseFloat(timeMachineSlider.value);
        
        // 접속 가능한 서버 중 현재 시간대에 활성화된 서버만 필터링
        const candidates = window.activeServers.filter(server => {
            const start = server.startYear && server.startYear !== 'null' ? parseFloat(server.startYear) : -Infinity;
            const end = server.endYear && server.endYear !== 'null' ? parseFloat(server.endYear) : Infinity;
            return timeValue >= start && timeValue < end;
        });

        if (candidates.length > 0) {
            const randomServer = candidates[Math.floor(Math.random() * candidates.length)];
            window.open(randomServer.url, '_blank');
        } else {
            alert('현재 접속 가능한 서버가 없습니다.');
        }
    });
}

// Utility Rendering
const utilityGrid = document.getElementById('utilityGrid');
const utilities = window.utilities || [];

utilities.forEach(util => {
    const a = document.createElement('a');
    a.className = 'utility-card';
    a.href = util.url;
    a.target = "_blank"; // Open in new tab
    a.dataset.start = util.startYear;
    a.dataset.end = util.endYear;

    // OKLCH로 정규화된 그라데이션 색상 적용
    if (util.color) {
        const { color1, color2 } = getGradientColors(util.color);
        a.style.setProperty('--card-accent-1', color1);
        a.style.setProperty('--card-accent-2', color2);
    }

    // Create Header Container
    const header = document.createElement('div');
    header.className = 'utility-header';

    const name = document.createElement('div');
    name.className = 'utility-name';
    name.textContent = util.name;
    header.appendChild(name);

    // Add Tags to Header
    if (util.tags && util.tags.length > 0) {
        const tags = document.createElement('div');
        tags.className = 'card-tags';

        util.tags.forEach(tag => {
            tags.appendChild(createTag(tag));
        });
        header.appendChild(tags);
    }

    a.appendChild(header);

    const desc = document.createElement('div');
    desc.className = 'utility-desc';
    desc.textContent = util.description;

    a.appendChild(desc);

    utilityGrid.appendChild(a);
});

// Recommended Games Rendering
const gameGrid = document.getElementById('gameGrid');
const games = window.recommendedGames || [];

games.forEach(game => {
    const a = document.createElement('a');
    a.className = 'utility-card';
    a.href = game.url;
    a.target = "_blank"; // Open in new tab
    a.dataset.start = game.startYear;
    a.dataset.end = game.endYear;

    // OKLCH로 정규화된 그라데이션 색상 적용
    if (game.color) {
        const { color1, color2 } = getGradientColors(game.color);
        a.style.setProperty('--card-accent-1', color1);
        a.style.setProperty('--card-accent-2', color2);
    }

    // Create Header Container
    const header = document.createElement('div');
    header.className = 'utility-header';

    const name = document.createElement('div');
    name.className = 'utility-name';
    name.textContent = game.name;
    header.appendChild(name);

    // Add Tags to Header
    if (game.tags && game.tags.length > 0) {
        const tags = document.createElement('div');
        tags.className = 'card-tags';

        game.tags.forEach(tag => {
            tags.appendChild(createTag(tag));
        });
        header.appendChild(tags);
    }

    a.appendChild(header);

    const desc = document.createElement('div');
    desc.className = 'utility-desc';
    desc.textContent = game.description;

    a.appendChild(desc);

    gameGrid.appendChild(a);
});

// Animation Logic
function openDetail(server, sourceCard) {
    activeCardId = server.id;

    // Populate Content
    detailTitle.textContent = server.name;
    detailDesc.textContent = server.description;
    if (server.url === '#') {
        connectBtn.href = 'javascript:void(0)';
        connectBtn.removeAttribute('target');
        connectBtn.classList.add('disabled');
    } else {
        connectBtn.href = server.url;
        connectBtn.target = "_blank"; // Open in new tab
        connectBtn.classList.remove('disabled');
    }

    // Clear and populate tags
    detailApps.innerHTML = '';
    server.tags.forEach(tag => {
        detailApps.appendChild(createTag(tag));
    });

    // Populate Related Links (Sub-utilities)
    detailRelatedLinks.innerHTML = '';
    if (server.relatedLinks && server.relatedLinks.length > 0) {
        server.relatedLinks.forEach(link => {
            const a = document.createElement('a');
            a.className = 'related-btn';
            a.href = link.url;
            a.textContent = link.name;
            a.target = "_blank";
            detailRelatedLinks.appendChild(a);
        });
    }

    // Style Detail Card - OKLCH 정규화된 그라데이션 색상 적용
    const { color1, color2 } = getGradientColors(server.color);
    detailCard.style.setProperty('--card-accent-1', color1);
    detailCard.style.setProperty('--card-accent-2', color2);

    // FLIP Animation
    // 1. First (Source)
    const startRect = sourceCard.getBoundingClientRect();

    // 2. Last (Target) - momentarily show detailView to measure
    detailView.style.visibility = 'hidden';
    detailView.classList.add('active');

    // We need to remove transition for measurement
    detailCard.style.transition = 'none';
    detailCard.style.transform = 'none';

    const endRect = detailCard.getBoundingClientRect();

    detailView.classList.remove('active');
    detailView.style.visibility = '';

    // Calculate Invert
    // Centering correction for absolute -> fixed/relative transform usually needs care
    // consistently use getBoundingClientRect for delta

    const deltaX = startRect.left - endRect.left;
    const deltaY = startRect.top - endRect.top;
    const scaleX = startRect.width / endRect.width;
    const scaleY = startRect.height / endRect.height;

    // Validating scale to avoid zeros if hidden
    const sX = isFinite(scaleX) ? scaleX : 0.1;
    const sY = isFinite(scaleY) ? scaleY : 0.1;

    // Apply Initial State
    detailCard.style.transformOrigin = 'top left';
    detailCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${sX}, ${sY})`;

    // Play
    requestAnimationFrame(() => {
        detailView.classList.add('active');

        // Force Reflow
        detailCard.offsetHeight;

        // Transition to Final State
        detailCard.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        detailCard.style.transform = 'translate(0, 0) scale(1)';
    });
}

function closeDetail() {
    if (!activeCardId) return;

    const sourceCard = document.querySelector(`.card[data-id="${activeCardId}"]`);
    if (!sourceCard) {
        detailView.classList.remove('active');
        return;
    }

    // FLIP Backwards
    const startRect = detailCard.getBoundingClientRect();
    const endRect = sourceCard.getBoundingClientRect();

    const deltaX = endRect.left - startRect.left;
    const deltaY = endRect.top - startRect.top;
    const scaleX = endRect.width / startRect.width;
    const scaleY = endRect.height / startRect.height;

    detailCard.style.transformOrigin = 'top left';
    detailCard.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    detailCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;

    // On Transition End
    const onEnd = () => {
        detailView.classList.remove('active');
        detailCard.removeEventListener('transitionend', onEnd);
        activeCardId = null;
    };
    detailCard.addEventListener('transitionend', onEnd, { once: true });
}

backBtn.addEventListener('click', closeDetail);
detailView.addEventListener('click', (e) => {
    if (e.target === detailView || e.target.classList.contains('detail-overlay')) {
        closeDetail();
    }
});

// Category Filter - 단순화된 버전 (트랜지션 버그 방지)
const categoryTabs = document.querySelectorAll('.category-tab');
const serversView = document.getElementById('servers-view');
const extrasView = document.getElementById('extras-view');
const utilitySection = document.querySelector('.utility-section[data-section="utility"]');
const gamesSection = document.querySelector('.utility-section[data-section="games"]');

let currentView = 'servers';

function switchView(category) {
    // Remove active from all tabs
    categoryTabs.forEach(t => t.classList.remove('active'));

    // Find and activate the correct tab
    const activeTab = Array.from(categoryTabs).find(t => t.dataset.category === category);
    if (activeTab) activeTab.classList.add('active');

    // 모든 뷰 초기화
    serversView.classList.remove('active');
    extrasView.classList.remove('active');
    utilitySection.classList.remove('active');
    gamesSection.classList.remove('active');

    // Handle view switching based on category
    if (category === '끄투 서버') {
        serversView.classList.add('active');
        currentView = 'servers';
    } else if (category === '유틸리티 및 게임') {
        // Desktop: Show both utility and games
        utilitySection.classList.add('active');
        gamesSection.classList.add('active');
        extrasView.classList.add('active');
        currentView = 'extras';
    } else if (category === '유틸리티') {
        // Mobile: Show only utility
        utilitySection.classList.add('active');
        extrasView.classList.add('active');
        currentView = 'utility';
    } else if (category === '추천 게임') {
        // Mobile: Show only games
        gamesSection.classList.add('active');
        extrasView.classList.add('active');
        currentView = 'games';
    }

    // Save preference
    localStorage.setItem('selected-category', category);
}

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchView(tab.dataset.category);
    });
});

// Restore saved category or default
const savedCategory = localStorage.getItem('selected-category') || '끄투 서버';
switchView(savedCategory);

// Initialize Time Machine after cards have been rendered
initTimeMachine();

// Initialize Site Announcement
if (window.announcement && window.announcement.visible) {
    const annId = 'announcement_closed';
    const isClosed = sessionStorage.getItem(annId);

    if (!isClosed) {
        const annDiv = document.createElement('div');
        annDiv.className = 'site-announcement';

        let contentHtml = `<span>${window.announcement.message}</span>`;
        if (window.announcement.link) {
            contentHtml = `<span>${window.announcement.message} <a href="${window.announcement.link}" target="_blank">바로가기</a></span>`;
        }

        annDiv.innerHTML = contentHtml + `<button class="close-announcement" aria-label="닫기" title="닫기">&times;</button>`;

        // Insert after site header
        const header = document.querySelector('.site-header');
        header.parentNode.insertBefore(annDiv, header.nextSibling);

        // Close event
        annDiv.querySelector('.close-announcement').addEventListener('click', () => {
            annDiv.style.transition = 'opacity 0.3s ease';
            annDiv.style.opacity = '0';
            setTimeout(() => {
                annDiv.remove();
            }, 300);
            sessionStorage.setItem(annId, 'true');
        });
    }
}
