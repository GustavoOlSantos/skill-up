package com.plataforma.cursos.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import com.plataforma.cursos.domain.entities.Cursos;
import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.DTO.ListCursosDTO;
import com.plataforma.cursos.DTO.ViewCursosDTO;
import com.plataforma.cursos.DTO.CriarCursoDTO;
import com.plataforma.cursos.service.CursosService;
import org.springframework.http.HttpStatus;
import com.plataforma.cursos.controller.docs.CursosControllerDocs;


/**
 * Esse {@link RestController} é responsável por gerenciar as operações relacionadas aos cursos, incluindo cadastro, atualização e remoção.
 * A implementação de documentação da API é feita através da interface {@link CursosControllerDocs}, que define os contratos de cada endpoint.
 * 
 * @author Gustavo Santos
 */
@RestController
@RequestMapping("/cursos")
public class CursosController implements CursosControllerDocs {

    private final CursosService service;

    public CursosController(CursosService service) {
        this.service = service;
    }
    
    @GetMapping
    public List<ListCursosDTO> list() {
        return service.findAll();
    }

    @GetMapping("/maisVendidos")
    public List<CursosDTO> getMaisVendidos() {
        return service.findBestSellers();
    }

    @GetMapping("/nome/{name}")
    public List<CursosDTO> getByName(@PathVariable String name) {
        return service.findByName(name);
    }

    @GetMapping("/slug/{slug}")
    public List<CursosDTO> getBySlug(@PathVariable String slug) {
        return service.findBySlug(slug);
    }

    @GetMapping("/id/{id}")
    public CursosDTO getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("aulas/slug/{slug}")
    public List<ViewCursosDTO> getAulasBySlug(@PathVariable String slug) {
        return service.findAulasBySlug(slug);
    }

    @PostMapping("/registrar")
    public ResponseEntity<CursosDTO> create(@RequestBody CriarCursoDTO dto) {
        CursosDTO criado = service.registerCompleto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PatchMapping("/id/{id}")
    public ResponseEntity<CursosDTO> update(@RequestBody Cursos curso, @PathVariable Long id) {
        CursosDTO cursoAtualizado = service.update(id, curso);
        return ResponseEntity.ok(cursoAtualizado);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}