// ========== Universe View ==========
window.UniverseView = (function () {

    const state = {
        planets: [],
        planets2: [],
        stars: [],
        cam: { x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1 },
        focusedPlanet: null,
        activeUniverse: 1,
        separation: 0,
        rafId: null,
        lastTime: 0,
        totalTime: 0,
        W: 0, H: 0,
        baseSize: 0,
        open: false,
        savedTheme: null,
    };

    let overlay, canvas, ctx;
    let serverInfoPanel, serverInfoName, serverInfoTags, serverInfoDesc, serverInfoBtn;

    // ---- Simple string hash → [0, 1) ----

    function serverHash(id) {
        let h = 0;
        const s = String(id);
        for (let i = 0; i < s.length; i++) {
            h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
        }
        return (h >>> 0) / 4294967296;
    }

    // ---- Color utilities (reuse script.js globals) ----

    function lightenHexForCanvas(hex, amount) {
        const rgb = hexToRgb(hex);
        const lab = rgbToOklab(rgb.r, rgb.g, rgb.b);
        const lch = oklabToOklch(lab.L, lab.a, lab.b);
        const newL = Math.min(0.92, lch.L + amount);
        const newC = lch.C * 0.65;
        const newLab = oklchToOklab(newL, newC, lch.h);
        const newRgb = oklabToRgb(newLab.L, newLab.a, newLab.b);
        return rgbToHex(
            Math.max(0, Math.min(1, newRgb.r)),
            Math.max(0, Math.min(1, newRgb.g)),
            Math.max(0, Math.min(1, newRgb.b))
        );
    }

    // ---- Coordinate conversion ----

    function worldToScreen(wx, wy) {
        return {
            sx: (wx - state.cam.x) * state.cam.zoom + state.W / 2,
            sy: (wy - state.cam.y) * state.cam.zoom + state.H / 2,
        };
    }

    function screenToWorld(sx, sy) {
        return {
            wx: (sx - state.W / 2) / state.cam.zoom + state.cam.x,
            wy: (sy - state.H / 2) / state.cam.zoom + state.cam.y,
        };
    }

    // ---- Build data ----

    function buildStars(count) {
        count = count || 220;
        state.stars = [];
        for (let i = 0; i < count; i++) {
            state.stars.push({
                x: Math.random() * state.W,
                y: Math.random() * state.H,
                r: Math.random() * 2.6 + 0.4,
                alpha: Math.random() * 0.55 + 0.2,
                twinkleSpeed: Math.random() * 0.0018 + 0.0004,
                twinkleOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    function buildSatellites(inst, hexColor, planetIdx, speedMult) {
        if (!inst.relatedLinks || inst.relatedLinks.length === 0) return [];
        return inst.relatedLinks.map(function (link, j) {
            const satDir = j % 2 === 0 ? 1 : -1;
            return {
                link: link,
                orbitRadius: state.baseSize * 0.056 * (j + 2.2),
                angle: (j * 2.094 + planetIdx * 1.047) % (Math.PI * 2),
                speed: 0.00045 / (j * 0.5 + 1) * speedMult * satDir,
                color: lightenHexForCanvas(hexColor, 0.28),
            };
        });
    }

    function makePlanet1(item, index, orbitRadius, existingAngles, existingAlphas) {
        const hexColor = item.inst.color || item.group.color || '#888888';
        const instId = item.inst.id;
        const playerCount = (typeof serverPlayerCounts !== 'undefined' && serverPlayerCounts[instId] != null)
            ? Math.max(0, serverPlayerCounts[instId])
            : 0;

        const rawSize = Math.log10(playerCount + 1) + 2;
        const radiusPx = rawSize * state.baseSize * 0.016;
        const radius = Math.max(10, Math.min(radiusPx, state.baseSize * 0.084));

        const minR = state.baseSize * 0.14;
        const defaultAngle = (index * 2.399963) % (Math.PI * 2);
        const orbitAngle = existingAngles[instId] != null ? existingAngles[instId] : defaultAngle;

        const h = serverHash(instId);
        const speedMult = 0.8 + h * 1.2;
        const orbitDir = index % 2 === 0 ? 1 : -1;
        const orbitSpeed = 0.000085 / Math.sqrt(orbitRadius / minR) * speedMult * orbitDir;

        const serverFlat = window.servers
            ? window.servers.find(function (s) { return s.id === instId; })
            : null;
        const server = serverFlat || Object.assign({}, item.inst, {
            name: item.inst.name || item.group.name,
            color: hexColor,
        });

        return {
            _id: instId,
            _universe: 1,
            server: server,
            inst: item.inst,
            originX: 0,
            orbitRadius: orbitRadius,
            targetOrbitRadius: orbitRadius,
            orbitAngle: orbitAngle,
            orbitSpeed: orbitSpeed,
            hexColor: hexColor,
            color: hexToNormalizedOklch(hexColor),
            radius: radius,
            cx: Math.cos(orbitAngle) * orbitRadius,
            cy: Math.sin(orbitAngle) * orbitRadius,
            satellites: buildSatellites(item.inst, hexColor, index, speedMult),
            alpha: existingAlphas[instId] != null ? existingAlphas[instId] : 0,
            targetAlpha: 1,
            removing: false,
        };
    }

    function makePlanet2(item, index, orbitRadius, existingAngles, existingAlphas) {
        const hexColor = item.color || '#4488ff';
        const minR = state.baseSize * 0.14;
        const radius = Math.max(10, Math.min(state.baseSize * 0.044, state.baseSize * 0.12));

        const defaultAngle = (index * 2.399963) % (Math.PI * 2);
        const orbitAngle = existingAngles[item.name] != null ? existingAngles[item.name] : defaultAngle;

        const h = serverHash(item.name);
        const speedMult = 0.8 + h * 1.2;
        const orbitDir = index % 2 === 0 ? 1 : -1;
        const orbitSpeed = 0.000085 / Math.sqrt(orbitRadius / minR) * speedMult * orbitDir;

        return {
            _id: item.name,
            _universe: 2,
            server: item,
            inst: item,
            originX: state.separation,
            orbitRadius: orbitRadius,
            targetOrbitRadius: orbitRadius,
            orbitAngle: orbitAngle,
            orbitSpeed: orbitSpeed,
            hexColor: hexColor,
            color: hexToNormalizedOklch(hexColor),
            radius: radius,
            cx: state.separation + Math.cos(orbitAngle) * orbitRadius,
            cy: Math.sin(orbitAngle) * orbitRadius,
            satellites: buildSatellites(item, hexColor, index, speedMult),
            alpha: existingAlphas[item.name] != null ? existingAlphas[item.name] : 0,
            targetAlpha: 1,
            removing: false,
        };
    }

    function getEffectiveTime() {
        const slider = document.getElementById('timeMachineSlider');
        const timeValue = parseFloat(slider ? slider.value : currentMaxYear);
        const isSomeday = timeValue >= somedayValue;
        return isSomeday ? 9999 : timeValue;
    }

    function buildPlanets(forceFull) {
        const effectiveTime = getEffectiveTime();

        const visible = [];
        serversData.forEach(function (group, groupIdx) {
            group.instances.forEach(function (inst, instIdx) {
                const start = inst.startYear != null ? inst.startYear : -Infinity;
                const end = inst.endYear != null ? inst.endYear : Infinity;
                if (effectiveTime >= start && effectiveTime < end) {
                    visible.push({
                        group: group,
                        inst: inst,
                        sortKey: [inst.startYear != null ? inst.startYear : 0, groupIdx, instIdx],
                    });
                }
            });
        });

        visible.sort(function (a, b) {
            return a.sortKey[0] - b.sortKey[0]
                || a.sortKey[1] - b.sortKey[1]
                || a.sortKey[2] - b.sortKey[2];
        });

        const n = visible.length;
        const minR = state.baseSize * 0.14;
        const maxR = state.baseSize * 0.88;
        const step = n > 1 ? (maxR - minR) / (n - 1) : 0;

        if (forceFull) {
            const existingAngles = {};
            const existingAlphas = {};
            state.planets.forEach(function (p) {
                existingAngles[p._id] = p.orbitAngle;
                existingAlphas[p._id] = p.alpha != null ? p.alpha : 1;
            });
            state.planets = visible.map(function (item, i) {
                return makePlanet1(item, i, minR + step * i, existingAngles, existingAlphas);
            });
        } else {
            // Build new orbit map
            const newOrbitMap = new Map();
            visible.forEach(function (item, i) {
                newOrbitMap.set(item.inst.id, { index: i, orbitRadius: minR + step * i, item: item });
            });

            // Track active (non-removing) ids
            const currentIds = new Set();
            state.planets.forEach(function (p) { if (!p.removing) currentIds.add(p._id); });

            // Mark removed planets
            state.planets.forEach(function (p) {
                if (!newOrbitMap.has(p._id) && !p.removing) {
                    p.removing = true;
                    p.targetAlpha = 0;
                }
            });

            // Update survivors
            state.planets.forEach(function (p) {
                if (p.removing) return;
                const entry = newOrbitMap.get(p._id);
                if (entry) {
                    p.targetOrbitRadius = entry.orbitRadius;
                    const h = serverHash(p._id);
                    const speedMult = 0.8 + h * 1.2;
                    const orbitDir = entry.index % 2 === 0 ? 1 : -1;
                    p.orbitSpeed = 0.000085 / Math.sqrt(entry.orbitRadius / minR) * speedMult * orbitDir;
                }
            });

            // Add new planets
            newOrbitMap.forEach(function (entry, id) {
                if (!currentIds.has(id)) {
                    const p = makePlanet1(entry.item, entry.index, entry.orbitRadius, {}, {});
                    state.planets.push(p);
                }
            });
        }
    }

    function buildPlanets2(forceFull) {
        if (!window.universe2Data) return;
        const effectiveTime = getEffectiveTime();

        const visible = [];
        window.universe2Data.forEach(function (item) {
            const start = item.startYear != null ? item.startYear : -Infinity;
            const end = item.endYear != null ? item.endYear : Infinity;
            if (effectiveTime >= start && effectiveTime < end) {
                visible.push(item);
            }
        });

        const n = visible.length;
        const minR = state.baseSize * 0.14;
        const maxR = state.baseSize * 0.88;
        const step = n > 1 ? (maxR - minR) / (n - 1) : 0;

        if (forceFull) {
            const existingAngles = {};
            const existingAlphas = {};
            state.planets2.forEach(function (p) {
                existingAngles[p._id] = p.orbitAngle;
                existingAlphas[p._id] = p.alpha != null ? p.alpha : 1;
            });
            state.planets2 = visible.map(function (item, i) {
                return makePlanet2(item, i, minR + step * i, existingAngles, existingAlphas);
            });
        } else {
            const newOrbitMap = new Map();
            visible.forEach(function (item, i) {
                newOrbitMap.set(item.name, { index: i, orbitRadius: minR + step * i, item: item });
            });

            const currentIds = new Set();
            state.planets2.forEach(function (p) { if (!p.removing) currentIds.add(p._id); });

            state.planets2.forEach(function (p) {
                if (!newOrbitMap.has(p._id) && !p.removing) {
                    p.removing = true;
                    p.targetAlpha = 0;
                }
            });

            state.planets2.forEach(function (p) {
                if (p.removing) return;
                const entry = newOrbitMap.get(p._id);
                if (entry) {
                    p.targetOrbitRadius = entry.orbitRadius;
                }
            });

            newOrbitMap.forEach(function (entry, name) {
                if (!currentIds.has(name)) {
                    const p = makePlanet2(entry.item, entry.index, entry.orbitRadius, {}, {});
                    state.planets2.push(p);
                }
            });
        }
    }

    // ---- Camera ----

    function updateCamera(dt) {
        if (state.focusedPlanet) {
            state.cam.targetX = state.focusedPlanet.cx;
            state.cam.targetY = state.focusedPlanet.cy;
        }
        const factor = 1 - Math.pow(0.90, dt / 16.67);
        state.cam.x += (state.cam.targetX - state.cam.x) * factor;
        state.cam.y += (state.cam.targetY - state.cam.y) * factor;
        state.cam.zoom += (state.cam.targetZoom - state.cam.zoom) * factor;
        clampCamera();
        updateActiveUniverse();
    }

    function focusPlanet(planet) {
        state.focusedPlanet = planet;
        state.cam.targetX = planet.cx;
        state.cam.targetY = planet.cy;
        const maxSatR = planet.satellites.reduce(function (m, s) {
            return Math.max(m, s.orbitRadius);
        }, planet.radius * 4);
        const desiredWorld = maxSatR * 2.6;
        const rawZoom = (state.baseSize * 0.38) / Math.max(desiredWorld, 1);
        state.cam.targetZoom = Math.min(Math.max(rawZoom, 1.5), 8);
        showServerInfo(planet);
    }

    function unfocus() {
        state.focusedPlanet = null;
        state.cam.targetX = state.activeUniverse === 2 ? state.separation : 0;
        state.cam.targetY = 0;
        state.cam.targetZoom = 1;
        hideServerInfo();
    }

    // ---- Active universe tracking ----

    function updateActiveUniverse() {
        if (state.separation === 0) return;
        const prev = state.activeUniverse;
        state.activeUniverse = state.cam.targetX > state.separation / 2 ? 2 : 1;
        if (prev !== state.activeUniverse) onActiveUniverseChanged();
    }

    function onActiveUniverseChanged() {
        updateNavArrows();
        updateInfoPanelSide();
        updateUniverseDots();
    }

    function updateNavArrows() {
        if (state.W <= 600) return;
        const rightArrow = document.getElementById('universeNavRight');
        const leftArrow = document.getElementById('universeNavLeft');
        if (!rightArrow || !leftArrow) return;
        rightArrow.classList.toggle('visible', state.activeUniverse === 1);
        leftArrow.classList.toggle('visible', state.activeUniverse === 2);
    }

    function updateInfoPanelSide() {
        if (!serverInfoPanel) return;
        serverInfoPanel.classList.toggle('panel-right', state.activeUniverse === 2 && state.W > 600);
    }

    function updateUniverseDots() {
        const dots = document.querySelectorAll('.universe-dot');
        dots.forEach(function (dot) {
            const num = parseInt(dot.getAttribute('data-universe'), 10);
            dot.classList.toggle('active', num === state.activeUniverse);
        });
    }

    // ---- Server info panel ----

    function setLogoHidden(hidden) {
        var logo = document.getElementById('universeLogo');
        if (!logo) return;
        logo.classList.toggle('hidden', hidden);
    }

    function showServerInfo(planet) {
        setLogoHidden(true);
        if (!serverInfoPanel) return;
        const srv = planet.server;
        const inst = planet.inst || {};

        serverInfoName.textContent = srv.name || '';
        serverInfoName.style.color = planet.hexColor;

        serverInfoTags.innerHTML = '';
        const tags = inst.tags || srv.tags || [];
        tags.forEach(function (tag) {
            const span = document.createElement('span');
            span.className = 'usi-tag';
            span.textContent = tag;
            serverInfoTags.appendChild(span);
        });

        serverInfoDesc.textContent = inst.description || srv.description || srv.desc || '';

        const url = (srv.url && srv.url !== '#') ? srv.url : (srv.url2 || '');
        if (url && url !== '#') {
            serverInfoBtn.href = url;
            serverInfoBtn.style.display = '';
            serverInfoBtn.style.background = planet.hexColor;
            serverInfoBtn.textContent = planet._universe === 2 ? '방문하기' : '접속하기';
        } else {
            serverInfoBtn.style.display = 'none';
        }

        serverInfoPanel.classList.add('visible');
    }

    function hideServerInfo() {
        setLogoHidden(false);
        if (!serverInfoPanel) return;
        serverInfoPanel.classList.remove('visible');
    }

    // ---- Hit testing ----

    function hitTestPlanets(wx, wy) {
        const allPlanets = state.planets.concat(state.planets2);
        for (let i = 0; i < allPlanets.length; i++) {
            const p = allPlanets[i];
            if (p.removing) continue;
            const dist = Math.hypot(wx - p.cx, wy - p.cy);
            if (dist < p.radius * 2.0) return p;
        }
        return null;
    }

    function hitTestSatellites(planet, wx, wy) {
        const sats = planet.satellites;
        for (let i = 0; i < sats.length; i++) {
            const s = sats[i];
            const sx = planet.cx + Math.cos(s.angle) * s.orbitRadius;
            const sy = planet.cy + Math.sin(s.angle) * s.orbitRadius;
            const dist = Math.hypot(wx - sx, wy - sy);
            if (dist < (planet.radius * 0.55 + 5)) return s;
        }
        return null;
    }

    // ---- Rendering ----

    function drawStars() {
        state.stars.forEach(function (s) {
            const a = s.alpha * (0.65 + 0.35 * Math.sin(state.totalTime * s.twinkleSpeed + s.twinkleOffset));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
            ctx.fill();
        });
    }

    function drawSun() {
        const r = state.baseSize * 0.092;

        const glow = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 3.5);
        glow.addColorStop(0, 'rgba(255,235,160,0.35)');
        glow.addColorStop(0.5, 'rgba(255,180,60,0.12)');
        glow.addColorStop(1, 'rgba(255,140,0,0)');
        ctx.beginPath();
        ctx.arc(0, 0, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        const core = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
        core.addColorStop(0, '#fffde0');
        core.addColorStop(0.45, '#ffe566');
        core.addColorStop(0.8, '#ffaa00');
        core.addColorStop(1, '#ff7700');
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
    }

    function drawSun2() {
        const r = state.baseSize * 0.092;
        ctx.save();
        ctx.translate(state.separation, 0);

        const glow = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 3.5);
        glow.addColorStop(0, 'rgba(160,200,255,0.35)');
        glow.addColorStop(0.5, 'rgba(60,130,255,0.12)');
        glow.addColorStop(1, 'rgba(0,80,255,0)');
        ctx.beginPath();
        ctx.arc(0, 0, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        const core = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
        core.addColorStop(0, '#e0f0ff');
        core.addColorStop(0.45, '#66aaff');
        core.addColorStop(0.8, '#0055ff');
        core.addColorStop(1, '#0022cc');
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();

        ctx.restore();
    }

    function drawOrbitRings() {
        state.planets.forEach(function (p) {
            const palpha = p.alpha != null ? p.alpha : 1;
            const isFocused = state.focusedPlanet === p;
            const alpha = (state.focusedPlanet
                ? (isFocused ? 0.25 : 0.06)
                : 0.18) * palpha;
            ctx.beginPath();
            ctx.arc(0, 0, p.orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    function drawOrbitRings2() {
        state.planets2.forEach(function (p) {
            const palpha = p.alpha != null ? p.alpha : 1;
            const isFocused = state.focusedPlanet === p;
            const alpha = (state.focusedPlanet
                ? (isFocused ? 0.25 : 0.06)
                : 0.18) * palpha;
            ctx.beginPath();
            ctx.arc(state.separation, 0, p.orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(180,210,255,' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    function drawPlanet(p) {
        const { cx, cy, radius, hexColor } = p;
        const palpha = p.alpha != null ? p.alpha : 1;
        const isFocused = state.focusedPlanet === p;
        const dimmed = state.focusedPlanet && !isFocused;

        if (!dimmed) {
            const glowR = radius * 2.8;
            const glow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, glowR);
            glow.addColorStop(0, hexColor + '88');
            glow.addColorStop(1, hexColor + '00');
            ctx.globalAlpha = palpha;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
        }

        const light = lightenHexForCanvas(hexColor, 0.14);
        const grad = ctx.createRadialGradient(
            cx - radius * 0.3, cy - radius * 0.3, 0,
            cx, cy, radius
        );
        grad.addColorStop(0, light);
        grad.addColorStop(1, hexColor);
        ctx.globalAlpha = (dimmed ? 0.28 : 1) * palpha;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (isFocused) {
            ctx.globalAlpha = palpha;
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 3.5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.65)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    function drawSatelliteOrbits(planet) {
        const palpha = planet.alpha != null ? planet.alpha : 1;
        planet.satellites.forEach(function (s) {
            ctx.beginPath();
            ctx.arc(planet.cx, planet.cy, s.orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.12 * palpha).toFixed(3) + ')';
            ctx.lineWidth = 0.6;
            ctx.setLineDash([3, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    function drawSatellites(planet) {
        const palpha = planet.alpha != null ? planet.alpha : 1;
        planet.satellites.forEach(function (s) {
            const sx = planet.cx + Math.cos(s.angle) * s.orbitRadius;
            const sy = planet.cy + Math.sin(s.angle) * s.orbitRadius;
            const sr = Math.max(3, planet.radius * 0.38);

            const glowR = sr * 2.2;
            const glow = ctx.createRadialGradient(sx, sy, sr * 0.2, sx, sy, glowR);
            glow.addColorStop(0, s.color + 'aa');
            glow.addColorStop(1, s.color + '00');
            ctx.globalAlpha = palpha;
            ctx.beginPath();
            ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    function drawLabels() {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const allPlanets = state.planets.concat(state.planets2);
        allPlanets.forEach(function (p) {
            const { sx, sy } = worldToScreen(p.cx, p.cy);

            if (sx < -100 || sx > state.W + 100 || sy < -80 || sy > state.H + 80) return;

            const screenR = p.radius * state.cam.zoom;
            const labelY = sy + screenR + 5;

            const isFocused = state.focusedPlanet === p;
            const dimmed = state.focusedPlanet && !isFocused;
            const palpha = p.alpha != null ? p.alpha : 1;
            const alpha = (dimmed ? 0.22 : 0.9) * palpha;
            const fontSize = isFocused ? 14 : 12;

            ctx.font = fontSize + 'px "Noto Sans KR", sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 5;
            ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
            ctx.fillText(p.server.name, sx, labelY);
        });

        if (state.focusedPlanet) {
            ctx.font = '11px "Noto Sans KR", sans-serif';
            state.focusedPlanet.satellites.forEach(function (s) {
                const satWx = state.focusedPlanet.cx + Math.cos(s.angle) * s.orbitRadius;
                const satWy = state.focusedPlanet.cy + Math.sin(s.angle) * s.orbitRadius;
                const { sx, sy } = worldToScreen(satWx, satWy);

                if (sx < -80 || sx > state.W + 80 || sy < -60 || sy > state.H + 60) return;

                const sr = Math.max(3, state.focusedPlanet.radius * 0.38) * state.cam.zoom;
                ctx.shadowColor = 'rgba(0,0,0,0.85)';
                ctx.shadowBlur = 4;
                ctx.fillStyle = 'rgba(210,210,255,0.92)';
                ctx.fillText(s.link.name, sx, sy + sr + 4);
            });
        }

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    function render() {
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(dpr, dpr);

        ctx.fillStyle = '#000008';
        ctx.fillRect(0, 0, state.W, state.H);

        drawStars();

        ctx.save();
        ctx.translate(state.W / 2, state.H / 2);
        ctx.scale(state.cam.zoom, state.cam.zoom);
        ctx.translate(-state.cam.x, -state.cam.y);

        drawOrbitRings();
        drawOrbitRings2();
        drawSun();
        drawSun2();

        if (state.focusedPlanet) {
            drawSatelliteOrbits(state.focusedPlanet);
        }

        state.planets.forEach(drawPlanet);
        state.planets2.forEach(drawPlanet);

        if (state.focusedPlanet) {
            drawSatellites(state.focusedPlanet);
        }

        ctx.restore();

        drawLabels();

        ctx.restore();
    }

    // ---- Animation loop ----

    function updatePositions(dt) {
        const alphaDelta = Math.min(1, dt * 0.004);
        const orbitDelta = Math.min(1, dt * 0.003);

        function updateList(list) {
            const toRemove = [];
            list.forEach(function (p, i) {
                p.orbitAngle += p.orbitSpeed * dt;
                p.orbitRadius += (p.targetOrbitRadius - p.orbitRadius) * orbitDelta;
                p.cx = p.originX + Math.cos(p.orbitAngle) * p.orbitRadius;
                p.cy = Math.sin(p.orbitAngle) * p.orbitRadius;
                if (p.alpha == null) p.alpha = 0;
                p.alpha += (p.targetAlpha - p.alpha) * alphaDelta;
                if (p.removing && p.alpha < 0.01) toRemove.push(i);
                p.satellites.forEach(function (s) {
                    s.angle += s.speed * dt;
                });
            });
            for (let k = toRemove.length - 1; k >= 0; k--) list.splice(toRemove[k], 1);
        }

        updateList(state.planets);
        updateList(state.planets2);
    }

    function loop(ts) {
        const dt = Math.min(ts - state.lastTime, 100);
        state.lastTime = ts;
        state.totalTime += dt;

        updateCamera(dt);
        updatePositions(dt);
        render();

        state.rafId = requestAnimationFrame(loop);
    }

    // ---- Resize ----

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        state.W = window.innerWidth;
        state.H = window.innerHeight;
        canvas.width = Math.round(state.W * dpr);
        canvas.height = Math.round(state.H * dpr);
        canvas.style.width = state.W + 'px';
        canvas.style.height = state.H + 'px';
        const isMobile = state.W <= 600;
        if (isMobile) {
            const S = Math.min(state.W, state.H);
            // 각 유니버스 지름 = 1.6×S (maxOrbit=0.88×baseSize → baseSize=0.8S/0.88)
            state.baseSize = S * 10 / 11;
            // separation = 1.6×S - 0.3×S = 1.3×S (겹침 0.3×S)
            state.separation = S * 1.3;
        } else {
            state.baseSize = Math.min(state.W, state.H) / 2;
            state.separation = state.baseSize * 2.8;
        }
    }

    window.addEventListener('resize', function () {
        if (!state.open) return;
        resize();
        buildStars();
        buildPlanets(true);
        buildPlanets2(true);
    });

    // ---- Touch handling ----

    const touchState = {
        active: false,
        startX: 0, startY: 0,
        lastX: 0, lastY: 0,
        moved: false,
        pinching: false,
        pinchDist0: 0,
        zoomStart: 0,
    };

    function getPinchDist(e) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.hypot(dx, dy);
    }

    function handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            touchState.active = true;
            touchState.pinching = false;
            touchState.startX = touchState.lastX = e.touches[0].clientX;
            touchState.startY = touchState.lastY = e.touches[0].clientY;
            touchState.moved = false;
        } else if (e.touches.length === 2) {
            touchState.pinching = true;
            touchState.active = false;
            touchState.pinchDist0 = getPinchDist(e);
            touchState.zoomStart = state.cam.zoom;
        }
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (touchState.pinching && e.touches.length === 2) {
            const dist = getPinchDist(e);
            const newZoom = Math.max(0.3, Math.min(8, touchState.zoomStart * (dist / touchState.pinchDist0)));
            state.cam.zoom = newZoom;
            state.cam.targetZoom = newZoom;
            return;
        }
        if (!touchState.active || e.touches.length !== 1) return;
        const cx = e.touches[0].clientX;
        const cy = e.touches[0].clientY;
        const dx = cx - touchState.lastX;
        const dy = cy - touchState.lastY;
        touchState.lastX = cx;
        touchState.lastY = cy;
        if (Math.hypot(cx - touchState.startX, cy - touchState.startY) > 10) touchState.moved = true;
        if (touchState.moved) {
            state.cam.x -= dx / state.cam.zoom;
            state.cam.y -= dy / state.cam.zoom;
            state.cam.targetX = state.cam.x;
            state.cam.targetY = state.cam.y;
            clampCamera();
            if (state.focusedPlanet) {
                state.focusedPlanet = null;
                hideServerInfo();
            }
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        if (touchState.pinching) {
            if (e.touches.length <= 1) {
                touchState.pinching = false;
                if (e.touches.length === 1) {
                    touchState.active = true;
                    touchState.startX = touchState.lastX = e.touches[0].clientX;
                    touchState.startY = touchState.lastY = e.touches[0].clientY;
                    touchState.moved = true;
                }
            }
            return;
        }
        if (touchState.active && !touchState.moved) {
            handleClick({ clientX: touchState.startX, clientY: touchState.startY });
        }
        touchState.active = false;
    }

    // ---- Click handling ----

    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const { wx, wy } = screenToWorld(px, py);

        if (state.focusedPlanet) {
            const sat = hitTestSatellites(state.focusedPlanet, wx, wy);
            if (sat) {
                if (sat.link.url && sat.link.url !== '#') {
                    window.open(sat.link.url, '_blank');
                }
                return;
            }
            const dp = Math.hypot(wx - state.focusedPlanet.cx, wy - state.focusedPlanet.cy);
            if (dp < state.focusedPlanet.radius * 2.2) {
                const url = (state.focusedPlanet.server.url && state.focusedPlanet.server.url !== '#')
                    ? state.focusedPlanet.server.url
                    : state.focusedPlanet.server.url2;
                if (url && url !== '#') window.open(url, '_blank');
                return;
            }
            unfocus();
        } else {
            const hit = hitTestPlanets(wx, wy);
            if (hit) focusPlanet(hit);
        }
    }

    // ---- ESC key ----

    document.addEventListener('keydown', function (e) {
        if (!state.open) return;
        if (e.key === 'Escape') {
            if (state.focusedPlanet) unfocus();
            else close();
        }
    });

    // ---- Theme ----

    function saveAndForceDark() {
        const html = document.documentElement;
        state.savedTheme = html.getAttribute('data-theme');
        if (state.savedTheme === 'light') {
            html.removeAttribute('data-theme');
        }
    }

    function restoreTheme() {
        if (state.savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        state.savedTheme = null;
    }

    // ---- Universe button ----

    function updateUniverseBtn(isOpen) {
        const btn = document.getElementById('universeBtn');
        if (!btn) return;
        const icon = btn.querySelector('.universe-icon');
        const text = btn.querySelector('.universe-text');
        if (isOpen) {
            if (icon) icon.textContent = '📋';
            if (text) text.textContent = '목록';
            btn.classList.add('universe-btn-back');
        } else {
            if (icon) icon.textContent = '🚀';
            if (text) text.textContent = '유니버스';
            btn.classList.remove('universe-btn-back');
        }
    }

    // ---- Camera pan bounds ----

    function clampCamera() {
        if (state.W > 600) {
            // Desktop: loose bounds to prevent panning infinitely past both universes
            if (state.separation > 0) {
                const limRight = state.separation + state.baseSize * 1.0;
                const limLeft = -state.baseSize * 1.0;
                state.cam.targetX = Math.max(limLeft, Math.min(limRight, state.cam.targetX));
            }
            return;
        }
        // Mobile: clamp to cover both universes
        let maxOrbit1 = 0;
        state.planets.forEach(function (p) { maxOrbit1 = Math.max(maxOrbit1, p.orbitRadius + p.radius); });
        let maxOrbit2 = 0;
        state.planets2.forEach(function (p) { maxOrbit2 = Math.max(maxOrbit2, p.orbitRadius + p.radius); });
        if (maxOrbit1 === 0 && maxOrbit2 === 0) return;

        const halfW = (state.W / 2) / state.cam.zoom;
        const halfH = (state.H / 2) / state.cam.zoom;

        const limXLeft = Math.max(0, maxOrbit1 - halfW);
        const limXRight = state.separation + Math.max(0, maxOrbit2 - halfW);
        const limY = Math.max(0, Math.max(maxOrbit1, maxOrbit2) - halfH);

        state.cam.x = Math.max(-limXLeft, Math.min(limXRight, state.cam.x));
        state.cam.y = Math.max(-limY, Math.min(limY, state.cam.y));
        state.cam.targetX = Math.max(-limXLeft, Math.min(limXRight, state.cam.targetX));
        state.cam.targetY = Math.max(-limY, Math.min(limY, state.cam.targetY));
    }

    // ---- Mobile pan hint ----

    let panHintShown = false;

    function showPanHint() {
        if (state.W > 600) return;
        if (panHintShown) return;
        const hint = document.getElementById('universePanHint');
        if (!hint) return;
        panHintShown = true;
        hint.classList.add('visible');
        setTimeout(function () {
            hint.classList.remove('visible');
        }, 3000);
    }

    // ---- Public API ----

    function open() {
        if (!overlay) init();
        state.open = true;
        saveAndForceDark();
        resize();
        buildStars();
        buildPlanets(true);
        buildPlanets2(true);
        unfocus();
        overlay.classList.add('active');
        document.body.classList.add('universe-active');
        updateUniverseBtn(true);
        state.lastTime = performance.now();
        state.totalTime = 0;
        state.rafId = requestAnimationFrame(loop);
        showPanHint();
        updateNavArrows();
        updateInfoPanelSide();
        updateUniverseDots();
    }

    function close() {
        state.open = false;
        overlay.classList.remove('active');
        document.body.classList.remove('universe-active');
        restoreTheme();
        updateUniverseBtn(false);
        state.focusedPlanet = null;
        hideServerInfo();
        setTimeout(function () {
            if (!state.open && state.rafId) {
                cancelAnimationFrame(state.rafId);
                state.rafId = null;
            }
        }, 700);
    }

    function refresh() {
        buildPlanets(false);
        buildPlanets2(false);
        if (state.focusedPlanet && state.focusedPlanet.removing) {
            unfocus();
        }
    }

    function isOpen() {
        return state.open;
    }

    function init() {
        overlay = document.getElementById('universeOverlay');
        canvas = document.getElementById('universeCanvas');
        ctx = canvas.getContext('2d');
        serverInfoPanel = document.getElementById('universeServerInfo');
        serverInfoName = document.getElementById('usiName');
        serverInfoTags = document.getElementById('usiTags');
        serverInfoDesc = document.getElementById('usiDesc');
        serverInfoBtn = document.getElementById('usiBtn');

        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

        var navRight = document.getElementById('universeNavRight');
        var navLeft = document.getElementById('universeNavLeft');
        if (navRight) {
            navRight.addEventListener('click', function () {
                state.focusedPlanet = null;
                hideServerInfo();
                state.cam.targetX = state.separation;
                state.cam.targetY = 0;
                state.cam.targetZoom = 1;
            });
        }
        if (navLeft) {
            navLeft.addEventListener('click', function () {
                state.focusedPlanet = null;
                hideServerInfo();
                state.cam.targetX = 0;
                state.cam.targetY = 0;
                state.cam.targetZoom = 1;
            });
        }
    }

    return { open: open, close: close, refresh: refresh, isOpen: isOpen };

})();
