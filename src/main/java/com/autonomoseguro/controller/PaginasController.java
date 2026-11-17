package com.autonomoseguro.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginasController {

	@GetMapping("/")
	public String inicio() {
		return "index";
	}

}
