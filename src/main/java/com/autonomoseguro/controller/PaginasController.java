package com.autonomoseguro.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginasController {

	@GetMapping("/")
	public String inicio() {
		return "index";
	}

	@GetMapping("/mensagem")
	public String mensagem() {
		return "mensagem";
	}

	@GetMapping("/link")
	public String link() {
		return "link";
	}

	@GetMapping("/guia")
	public String guia() {
		return "guia";
	}

	@GetMapping("/checklist")
	public String checklist() {
		return "checklist";
	}

	@GetMapping("/ajuda")
	public String ajuda() {
		return "ajuda";
	}

}
