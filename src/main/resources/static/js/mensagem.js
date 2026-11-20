(function () {
	var regras = [
		{ pontos: 4, padrao: /codigo (de )?(verificacao|seguranca|sms|whatsapp)|\btoken\b|\bsenha\b|\bcvv\b|numero do cartao|dados do cartao|dados bancarios/, texto: 'Pede senha, código ou dados do cartão. Banco e empresa séria não pedem isso por mensagem.' },
		{ pontos: 4, padrao: /instale|baixe o aplicativo|baixe o app|anydesk|teamviewer|acesso remoto|\.apk/, texto: 'Pede para instalar um aplicativo. Isso pode dar a outra pessoa acesso ao seu celular.' },
		{ pontos: 4, padrao: /mudei de numero|novo numero|numero novo|esse e meu novo|preciso de um favor|me ajuda com um pix|pagar uma conta pra mim|pode pagar para mim/, texto: 'Parece alguém conhecido pedindo ajuda ou dinheiro de um número novo. Ligue para a pessoa no número antigo antes de responder.' },
		{ pontos: 4, padrao: /comprovante|ja fiz o pix|pix agendado|estorno|paguei a mais|valor a mais|devolver a diferenca|taxa de liberacao|pagamento adiantado/, texto: 'Golpe comum com autônomos: falso comprovante, "paguei a mais" ou taxa para liberar pagamento. Só confirme o pagamento no aplicativo do seu banco, nunca por print ou comprovante.' },
		{ pontos: 2, padrao: /urgente|imediatamente|agora mesmo|ultimas horas|ultima chance|nao perca|expira|prazo final|hoje ainda|em ate \d+ (horas|hora|minutos|minuto)/, texto: 'Cria pressa para você agir sem pensar.' },
		{ pontos: 2, padrao: /conta (sera )?(bloqueada|suspensa|cancelada)|bloqueio|suspensao|cancelamento|negativado|\bdivida\b|processo|policia|\bmulta\b|\bcnh\b/, texto: 'Ameaça bloquear, cobrar ou punir para assustar você.' },
		{ pontos: 2, padrao: /voce ganhou|ganhador|premio|sorteio|dinheiro facil|renda extra|lucro garantido|investimento garantido|bonus/, texto: 'Promete prêmio ou ganho fácil.' },
		{ pontos: 2, padrao: /bit\.ly|tinyurl|cutt\.ly|is\.gd|rebrand\.ly|goo\.gl/, texto: 'Tem link encurtado, que esconde o endereço verdadeiro.' },
		{ pontos: 1, padrao: /https?:\/\/|www\./, texto: 'Tem link. Não clique antes de conferir no analisador de links.' },
		{ pontos: 1, padrao: /\bpix\b|transferencia|deposito|boleto|pagamento|\btaxa\b|pagar/, texto: 'Fala de pagamento ou PIX.' },
		{ pontos: 1, padrao: /\bbanco\b|caixa economica|\binss\b|receita federal|correios|detran|serasa|nubank|mercado pago|central de seguranca|suporte tecnico|encomenda|entregador|\bpacote\b/, texto: 'Diz ser de banco, órgão ou empresa. Confirme ligando para o número oficial.' }
	];

	var respostas = {
		alto: {
			titulo: 'Risco alto: não responda e não clique',
			acoes: [
				'Não clique em links, não instale nada e não envie dinheiro, senha ou códigos.',
				'Se parece ser de alguém que você conhece, ligue para a pessoa no número antigo antes de responder.',
				'Se parece ser de banco ou empresa, ligue para o número oficial (o que está no cartão ou no site oficial).',
				'Bloqueie e denuncie o contato no próprio aplicativo.'
			]
		},
		medio: {
			titulo: 'Atenção: desconfie',
			acoes: [
				'Não faça nada com pressa. Confirme por outro caminho antes de responder.',
				'Fale direto com a pessoa ou a empresa, usando um número que você já tinha.',
				'Se tiver link, confira no analisador de links antes de abrir.'
			]
		},
		baixo: {
			titulo: 'Poucos sinais de golpe encontrados',
			acoes: [
				'Isso não garante que a mensagem seja segura.',
				'Se algo no pedido parecer estranho (dinheiro, dados, pressa), confirme com a pessoa por outro canal.'
			]
		}
	};

	function normalizar(t) {
		return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	function analisar(texto) {
		var limpo = normalizar(texto);
		var total = 0;
		var motivos = [];
		regras.forEach(function (r) {
			if (r.padrao.test(limpo)) {
				total += r.pontos;
				motivos.push(r.texto);
			}
		});
		var nivel = total >= 5 ? 'alto' : (total >= 2 ? 'medio' : 'baixo');
		return { nivel: nivel, motivos: motivos };
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

	function titulo(texto) {
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
		if (res.motivos.length > 0) {
			area.appendChild(titulo('Sinais encontrados:'));
			area.appendChild(lista(res.motivos));
		}
		area.appendChild(titulo('O que fazer:'));
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
		var texto = document.getElementById('texto').value.trim();
		if (texto === '') {
			aviso('Cole primeiro a mensagem que você recebeu.');
			return;
		}
		mostrar(analisar(texto));
	});

	document.getElementById('limpar').addEventListener('click', function () {
		var campo = document.getElementById('texto');
		campo.value = '';
		document.getElementById('resultado').hidden = true;
		campo.focus();
	});
})();
