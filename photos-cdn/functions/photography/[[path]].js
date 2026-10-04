// Serves /photography/* from the R2 bucket through Cloudflare's edge cache.
// r2.dev is rate-limited and uncached; a Pages Function on pages.dev gets a
// working Cache API without the domain's DNS living on Cloudflare.
export async function onRequestGet({ request, env, params, waitUntil }) {
	const cache = caches.default;
	const cached = await cache.match(request);
	if (cached) return withCacheStatus(cached, 'HIT');

	const object = await env.PHOTOS.get(`photography/${params.path.join('/')}`);
	if (!object) return new Response('Not found', { status: 404 });

	const headers = new Headers();
	object.writeHttpMetadata(headers); // Content-Type and Cache-Control set at upload
	headers.set('etag', object.httpEtag);
	const response = new Response(object.body, { headers });
	waitUntil(cache.put(request, response.clone()));
	return withCacheStatus(response, 'MISS');
}

function withCacheStatus(response, status) {
	const copy = new Response(response.body, response);
	copy.headers.set('x-cache', status);
	return copy;
}
