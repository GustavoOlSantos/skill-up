package com.plataforma.cursos.DTO;

import com.plataforma.cursos.domain.entities.AulaCurso;

import lombok.Getter;

@Getter
public class AulaCursoDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private String videoUrl;
    private String thumbnail;
    private Integer duracaoSegundos;
    private Integer ordem;
    private Boolean gratuita;
    private Boolean publicada;

    public AulaCursoDTO() {}

    public static AulaCursoDTO fromEntity(AulaCurso aula){
        AulaCursoDTO dto = new AulaCursoDTO();

        dto.id = aula.getId();
        dto.titulo = aula.getTitulo();
        dto.descricao = aula.getDescricao();
        dto.videoUrl = aula.getVideo_url();
        dto.thumbnail = aula.getThumbnail();
        dto.duracaoSegundos = aula.getDuracao_segundos();
        dto.ordem = aula.getOrdem();
        dto.gratuita = aula.getGratuita();
        dto.publicada = aula.getPublicada();

        return dto;
    }
}