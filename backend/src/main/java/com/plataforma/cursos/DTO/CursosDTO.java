package com.plataforma.cursos.DTO;

import java.util.List;
import java.util.Set;
import java.util.ArrayList;
import java.util.Date;

import com.plataforma.cursos.domain.entities.Cursos;

import lombok.Getter;
import lombok.Setter;

import com.plataforma.cursos.DTO.SubcategoriaDTO;

@Getter
@Setter
@SuppressWarnings("unused")
public class CursosDTO {

    private Long id;
    private String slug;
    private String nome;
    private String subtitulo;
    private String descricao;
    private String instrutor;
    private String duracao;
    private int numeroAulas;
    private String imagemUrl;
    private Date ultimaAtualizacao;
    private String idioma;
    private String nivel;
    private int alunosMatriculados;
    private float preco;
    private List<SubcategoriaDTO> subcategorias;
    private Set<String> requisitos;
    
    private Float mediaAvaliacao;
    private Integer quantidadeAvaliacoes;

    public CursosDTO() {  
    }

    public static CursosDTO fromEntity(Cursos curso) {
        CursosDTO dto = new CursosDTO();

        dto.id = curso.getId();
        dto.slug = curso.getSlug();
        dto.nome = curso.getNome();
        dto.subtitulo = curso.getSubtitulo();
        dto.descricao = curso.getDescricao();
        dto.instrutor = curso.getInstrutor();
        dto.duracao = curso.getDuracao();
        dto.numeroAulas = curso.getNumeroAulas();
        dto.imagemUrl = curso.getImagemUrl();
        dto.ultimaAtualizacao = curso.getUltimaAtualizacao();
        dto.idioma = curso.getIdioma();
        dto.nivel = curso.getNivel();
        dto.alunosMatriculados = curso.getAlunosMatriculados();
        dto.preco = curso.getPreco();
        dto.requisitos = curso.getRequisitos();

        dto.subcategorias = curso.getSubcategorias().stream()
            .map(sub -> new SubcategoriaDTO(sub.getId(), sub.getNome(), sub.getSlug()))
            .toList();

            return dto;
    }

    public static CursosDTO fromEntity(Cursos curso, AvaliacaoResumoDTO resumo) {
        CursosDTO dto = fromEntity(curso);
        dto.mediaAvaliacao = resumo != null ? resumo.media() : 0f;
        dto.quantidadeAvaliacoes = resumo != null ? resumo.quantidade() : 0;
        return dto;
    }
}