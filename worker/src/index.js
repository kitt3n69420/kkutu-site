// 끄투 서버 인원수 조회용 프록시 (Cloudflare Worker)
// 사용법: GET https://<워커 주소>/?url=<서버의 인원수 API 주소>
// 기존 Vercel의 /api/proxy 를 대체함

// 인원수 API 경로만 허용 (아무 URL이나 대신 요청해주는 열린 프록시가 되지 않도록)
const ALLOWED_PATHS = new Set(['/servers', '/o/servers', '/api/online']);

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
};

// cacheSeconds > 0 이면 Workers Caching(wrangler.toml의 [cache])과 브라우저가 그 시간만큼 캐시함
function json(body, status, cacheSeconds) {
    return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
        status,
        headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': cacheSeconds > 0
                ? `public, max-age=${cacheSeconds}, stale-while-revalidate=${cacheSeconds}`
                : 'no-store',
        },
    });
}

export default {
    async fetch(request) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            return json({ error: 'Method not allowed' }, 405, 0);
        }

        const raw = new URL(request.url).searchParams.get('url');
        if (!raw) return json({ error: 'Missing url parameter' }, 400, 0);

        let target;
        try {
            target = new URL(raw);
        } catch {
            return json({ error: 'Invalid url' }, 400, 0);
        }
        if (!['http:', 'https:'].includes(target.protocol) || !ALLOWED_PATHS.has(target.pathname)) {
            return json({ error: 'URL not allowed' }, 403, 0);
        }

        try {
            const res = await fetch(target.href, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                },
                // 브라우저 쪽 타임아웃(5초)보다 먼저 끊어서 에러 응답이라도 돌려줌
                signal: AbortSignal.timeout(4000),
            });
            if (!res.ok) return json({ error: `Failed to fetch: ${res.status}` }, 502, 60);

            const text = await res.text();
            JSON.parse(text); // JSON이 아니면(HTML 페이지 등) catch로 넘어감
            return json(text, 200, 60);
        } catch {
            // 죽은 서버 때문에 방문자마다 4초씩 기다리지 않도록 실패도 캐시
            // (stale-while-revalidate 덕분에 만료 후에도 다음 방문자는 기다리지 않고 바로 받음)
            return json({ error: 'Error fetching the URL' }, 502, 60);
        }
    },
};
