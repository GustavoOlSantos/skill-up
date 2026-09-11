package com.plataforma.cursos.controller;

import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.exception.BusinessException;
import com.plataforma.cursos.service.CarrinhoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carrinho")
@CrossOrigin
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    public CarrinhoController(
            CarrinhoService carrinhoService) {

        this.carrinhoService = carrinhoService;
    }


    @GetMapping
    public ResponseEntity<List<CursosDTO>> listar(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("Usuário não autenticado", true, HttpStatus.UNAUTHORIZED, "ver-carrinho");
        }

        Long usuarioId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
            carrinhoService.listar(usuarioId)
        );
    }


    @PostMapping("/{cursoId}")
    public ResponseEntity<Void> adicionar(@PathVariable Long cursoId, Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("Usuário não autenticado", true, HttpStatus.UNAUTHORIZED, "add-curso-carrinho");
        }

        Long usuarioId = Long.parseLong(authentication.getName());

        carrinhoService.adicionar(
            usuarioId,
            cursoId
        );

        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{cursoId}")
    public ResponseEntity<Void> remover(
            @PathVariable Long cursoId,
            Authentication authentication) {

        Long usuarioId =
                Long.valueOf(authentication.getName());

        carrinhoService.remover(
            usuarioId,
            cursoId
        );

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{cursoId}/existe")
    public ResponseEntity<Boolean> existe(
            @PathVariable Long cursoId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("Usuário não autenticado", true, HttpStatus.UNAUTHORIZED, "ver-curso-carrinho");
        }

        Long usuarioId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
            carrinhoService.existe(
                usuarioId,
                cursoId
            )
        );
    }


    @DeleteMapping
    public ResponseEntity<Void> limpar(
            Authentication authentication) {

        Long usuarioId =
                Long.valueOf(authentication.getName());

        carrinhoService.limpar(usuarioId);

        return ResponseEntity.noContent().build();
    }
}
