package com.plataforma.cursos.DTO;

import java.util.List;

import com.plataforma.cursos.domain.entities.ModuloCurso;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class ModuloCursoDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private Integer ordem;

    private List<AulaCursoDTO> aulas;

    public ModuloCursoDTO(){}

    public static ModuloCursoDTO fromEntity(ModuloCurso modulo){

        ModuloCursoDTO dto = new ModuloCursoDTO();

        dto.id = modulo.getId();
        dto.titulo = modulo.getTitulo();
        dto.descricao = modulo.getDescricao();
        dto.ordem = modulo.getOrdem();

        dto.aulas = modulo.getAulas()
            .stream()
            .map(AulaCursoDTO::fromEntity)
            .toList();

        return dto;
    }
}