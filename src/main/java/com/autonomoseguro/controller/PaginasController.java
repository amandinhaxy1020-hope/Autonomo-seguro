package com.autonomoseguro.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
	public String link(Model model) {
		model.addAttribute("titulo", "Analisar link");
		return "em-breve";
	}

	@GetMapping("/guia")
	public String guia(Model model) {
		model.addAttribute("titulo", "Guia de prevenção");
		return "em-breve";
	}

	@GetMapping("/checklist")
	public String checklist(Model model) {
		model.addAttribute("titulo", "Checklist de proteção no Android");
		return "em-breve";
	}

	@GetMapping("/ajuda")
	public String ajuda(Model model) {
		model.addAttribute("titulo", "Ajuda");
		return "em-breve";
	}

}
