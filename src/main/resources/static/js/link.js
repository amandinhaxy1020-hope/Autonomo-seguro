(function () {
	var encurtadores = ['bit.ly', 'tinyurl.com', 'cutt.ly', 'is.gd', 'rebrand.ly', 'goo.gl', 'shorturl.at', 'tiny.cc', 'ow.ly', 'encurtador.com.br'];
	var finaisSuspeitos = ['xyz', 'top', 'click', 'icu', 'cyou', 'buzz', 'rest', 'monster', 'cfd', 'sbs', 'zip', 'mov'];
	var marcas = [
		{ nome: 'Nubank', chave: 'nubank', oficiais: ['nubank.com.br'] },
		{ nome: 'Itaú', chave: 'itau', oficiais: ['itau.com.br'] },
		{ nome: 'Bradesco', chave: 'bradesco', oficiais: ['bradesco.com.br'] },
		{ nome: 'Caixa', chave: 'caixa', oficiais: ['caixa.gov.br'] },
		{ nome: 'Santander', chave: 'santander', oficiais: ['santander.com.br'] },
		{ nome: 'Banco do Brasil', chave: 'bancodobrasil', oficiais: ['bb.com.br'] },
		{ nome: 'Banco Inter', chave: 'bancointer', oficiais: ['bancointer.com.br', 'inter.co'] },
		{ nome: 'Mercado Pago', chave: 'mercadopago', oficiais: ['mercadopago.com.br', 'mercadopago.com'] },
		{ nome: 'PicPay', chave: 'picpay', oficiais: ['picpay.com'] },
		{ nome: 'Correios', chave: 'correios', oficiais: ['correios.com.br'] },
		{ nome: 'Serasa', chave: 'serasa', oficiais: ['serasa.com.br', 'serasaexperian.com.br'] },
		{ nome: 'WhatsApp', chave: 'whatsapp', oficiais: ['whatsapp.com', 'wa.me'] }
	];

	var respostas = {
		alto: {
			titulo: 'Risco alto: não abra este link',
			acoes: [
				'Não abra o link e não digite senha, CPF, código ou dados do cartão nele.',
				'Se veio de alguém conhecido, ligue para a pessoa e pergunte se mandou mesmo.',
				'Se diz ser de banco ou empresa, entre pelo aplicativo oficial ou ligue para o número que está no cartão.',
				'Apague a mensagem e bloqueie quem enviou.'
			]
		},
		medio: {
			titulo: 'Atenção: desconfie deste link',
			acoes: [
				'Não abra com pressa. Confirme com quem enviou, por outro canal.',
				'Para falar com banco ou empresa, use o aplicativo oficial ou digite o endereço oficial direto no navegador.'
			]
		},
		baixo: {
			titulo: 'Poucos sinais de risco encontrados',
			acoes: [
				'Isso não quer dizer que o link é seguro: o analisador só procura sinais conhecidos.',
				'Antes de digitar senha ou dados nele, confirme com quem enviou.'
			]
		}
	};

	function ehOficial(host, oficiais) {
		return oficiais.some(function (d) { return host === d || host.endsWith('.' + d); });
	}

	function analisar(entrada) {
		var texto = entrada.trim();
		var comEsquema = /^[a-z][a-z0-9+.-]*:\/\//i.test(texto) ? texto : 'https://' + texto;
		var url;
		try {
			url = new URL(comEsquema);
		} catch (e) {
			return null;
		}
		var host = url.hostname.toLowerCase();
		if (host.indexOf('.') === -1) {
			return null;
		}
		var pontos = 0;
		var motivos = [];
		function sinal(p, t) {
			pontos += p;
			motivos.push(t);
		}

		if (url.protocol === 'http:') {
			sinal(2, 'O endereço não usa conexão segura (começa com http, sem o "s").');
		}
		if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
			sinal(4, 'O endereço é um número (IP) e não o nome de um site. Sites sérios usam nome.');
		}
		if (url.username !== '' || url.password !== '') {
			sinal(4, 'Tem um arroba (@) no endereço. Isso é usado para disfarçar o site verdadeiro.');
		}
		if (ehOficial(host, encurtadores)) {
			sinal(2, 'É um link encurtado: ele esconde para onde realmente leva.');
		}
		if (host.indexOf('xn--') !== -1) {
			sinal(3, 'Usa letras especiais que imitam um endereço conhecido.');
		}
		var rotulos = host.split('.');
		if (rotulos.length >= 5) {
			sinal(2, 'O endereço tem muitas partes separadas por ponto, um jeito de disfarçar o site.');
		}
		if ((host.match(/-/g) || []).length >= 3) {
			sinal(2, 'O endereço tem muitos hífens, comum em sites falsos.');
		}
		var final = rotulos[rotulos.length - 1];
		if (finaisSuspeitos.indexOf(final) !== -1) {
			sinal(2, 'Termina em ".' + final + '", um final que aparece com frequência em golpes.');
		}

		var semTracos = host.replace(/-/g, '');
		marcas.forEach(function (m) {
			if (semTracos.indexOf(m.chave) !== -1 && !ehOficial(host, m.oficiais)) {
				sinal(4, 'Tem o nome "' + m.nome + '" no endereço, mas não é o endereço oficial. Golpistas fazem isso para enganar.');
			}
		});
		if (/(^|[.-])(gov|receita|detran|inss)([.-]|$)/.test(host) && !(host === 'gov.br' || host.endsWith('.gov.br'))) {
			sinal(4, 'Parece ser de um órgão do governo, mas sites do governo terminam em ".gov.br".');
		}

		var resto = host + url.pathname + url.search;
		if (/(login|entrar|verific|atualiz|regulariz|seguranca|premio|resgat|desbloque|liberar|cadastro|boleto|fatura)/i.test(resto)) {
			sinal(1, 'Tem palavras comuns em golpes (como login, verificar, atualizar, regularizar ou resgatar).');
		}
		if (texto.length > 100) {
			sinal(1, 'O link é muito longo.');
		}

		var nivel = pontos >= 4 ? 'alto' : (pontos >= 2 ? 'medio' : 'baixo');
		return { host: host, nivel: nivel, motivos: motivos };
	}

	function lista(itens) {
		var ul = document.createElement('ul');
		itens.forEach(function (i) {
			var li = document.createElement('li');
			li.textContent = i;
			ul.appendChild(li);
		});
		return ul;
	}

	function paragrafo(texto) {
		var p = document.createElement('p');
		p.textContent = texto;
		return p;
	}

	function mostrar(res) {
		var area = document.getElementById('resultado');
		var info = respostas[res.nivel];
		area.className = 'resultado nivel-' + res.nivel;
		area.textContent = '';
		var h = document.createElement('h2');
		h.textContent = info.titulo;
		area.appendChild(h);
		area.appendChild(paragrafo('Este link leva para o site: ' + res.host));
		if (res.motivos.length > 0) {
			area.appendChild(paragrafo('Sinais encontrados:'));
			area.appendChild(lista(res.motivos));
		}
		area.appendChild(paragrafo('O que fazer:'));
		area.appendChild(lista(info.acoes));
		area.hidden = false;
		area.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function aviso(texto) {
		var area = document.getElementById('resultado');
		area.className = 'resultado nivel-medio';
		area.textContent = texto;
		area.hidden = false;
	}

	document.getElementById('analisar').addEventListener('click', function () {
		var texto = document.getElementById('endereco').value.trim();
		if (texto === '') {
			aviso('Cole primeiro o link que você recebeu.');
			return;
		}
		var res = analisar(texto);
		if (res === null) {
			aviso('Isso não parece um link. Cole só o endereço completo, por exemplo: www.exemplo.com.br');
			return;
		}
		mostrar(res);
	});

	document.getElementById('limpar').addEventListener('click', function () {
		var campo = document.getElementById('endereco');
		campo.value = '';
		document.getElementById('resultado').hidden = true;
		campo.focus();
	});

	document.getElementById('endereco').addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			document.getElementById('analisar').click();
		}
	});
})();
