package com.plataforma.cursos.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class SubcategoriaDTO {

    private Long id;
    private String nome;
    private String slug;

    public SubcategoriaDTO(Long id, String nome, String slug) {
        this.id = id;
        this.nome = nome;
        this.slug = slug;
    }
}