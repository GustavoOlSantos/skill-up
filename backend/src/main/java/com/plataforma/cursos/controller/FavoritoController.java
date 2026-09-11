package com.plataforma.cursos.controller;

import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.exception.BusinessException;
import com.plataforma.cursos.service.FavoritoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
@CrossOrigin
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(
            FavoritoService favoritoService) {

        this.favoritoService = favoritoService;
    }


    @GetMapping
    public ResponseEntity<List<CursosDTO>> listar(
            Authentication authentication) {

        Long usuarioId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
            favoritoService.listar(usuarioId)
        );
    }


    @PostMapping("/{cursoId}")
    public ResponseEntity<Void> adicionar(
            @PathVariable Long cursoId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("Usuário não autenticado", true, HttpStatus.UNAUTHORIZED, "add-curso-favorito");
        }

        Long usuarioId =
                Long.parseLong(authentication.getName());

        favoritoService.adicionar(
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
                Long.parseLong(authentication.getName());

        favoritoService.remover(
            usuarioId,
            cursoId
        );

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{cursoId}/existe")
    public ResponseEntity<Boolean> existe(
            @PathVariable Long cursoId,
            Authentication authentication) {

        Long usuarioId =
                Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
            favoritoService.existe(
                usuarioId,
                cursoId
            )
        );
    }
}