export const config = {
    runtime: 'edge', // Edge 런타임 사용 (Cloudflare 환경과 호환성 극대화 및 지연 시간 단축)
};

export default async function handler(req) {
    const searchParams = new URL(req.url).searchParams;
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: `Failed to fetch: ${response.status}` }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const data = await response.text();
        
        return new Response(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 's-maxage=60, stale-while-revalidate'
            }
        });
    } catch (error) {
        console.error('Fetch error:', error);
        return new Response(JSON.stringify({ error: 'Error fetching the URL' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
