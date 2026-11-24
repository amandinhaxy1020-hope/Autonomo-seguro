const CACHE = 'autonomo-seguro-v1';
const ARQUIVOS = [
	'/', '/mensagem', '/link', '/guia', '/checklist', '/ajuda',
	'/css/estilo.css', '/js/mensagem.js', '/js/link.js', '/js/checklist.js',
	'/manifest.json', '/icone-192.png', '/icone-512.png'
];

self.addEventListener('install', function (evento) {
	evento.waitUntil(
		caches.open(CACHE)
			.then(function (cache) { return cache.addAll(ARQUIVOS); })
			.then(function () { return self.skipWaiting(); })
	);
});

self.addEventListener('activate', function (evento) {
	evento.waitUntil(
		caches.keys()
			.then(function (chaves) {
				return Promise.all(chaves.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
			})
			.then(function () { return self.clients.claim(); })
	);
});

self.addEventListener('fetch', function (evento) {
	if (evento.request.method !== 'GET') {
		return;
	}
	var url = new URL(evento.request.url);
	if (url.origin !== self.location.origin) {
		return;
	}
	evento.respondWith(
		fetch(evento.request)
			.then(function (resposta) {
				if (resposta.ok) {
					var copia = resposta.clone();
					caches.open(CACHE).then(function (cache) { cache.put(evento.request, copia); });
				}
				return resposta;
			})
			.catch(function () {
				return caches.match(evento.request).then(function (guardada) {
					return guardada || caches.match('/');
				});
			})
	);
});
