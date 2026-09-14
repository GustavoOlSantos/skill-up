package com.plataforma.cursos.DTO;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CriarModuloDTO {
    private String titulo;
    private String descricao;
    private Integer ordem;
    private List<CriarAulaDTO> aulas;

    public List<CriarAulaDTO> getAulas() { return aulas; }
}