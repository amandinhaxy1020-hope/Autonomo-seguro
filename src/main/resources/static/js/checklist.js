(function () {
	var caixas = document.querySelectorAll('.check-item input');
	var contagem = document.getElementById('contagem');
	function atualizar() {
		var marcadas = 0;
		caixas.forEach(function (c) {
			if (c.checked) {
				marcadas++;
			}
		});
		contagem.textContent = marcadas + ' de ' + caixas.length + ' itens conferidos';
	}
	caixas.forEach(function (c) {
		c.addEventListener('change', atualizar);
	});
	atualizar();
})();
