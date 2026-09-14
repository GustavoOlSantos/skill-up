package com.plataforma.cursos.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class CategoriaRequestDTO {
    private Long id;
    private String nome;
    private String slug;
}
