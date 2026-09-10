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
public class ListCursosDTO {

    public Long id;
    public String slug;
    public String nome;
    public String subtitulo;
    public String descricao;
    public String instrutor;
    public String duracao;
    public int numeroAulas;
    public String imagemUrl;
    public Date ultimaAtualizacao;
    public String idioma;
    public String nivel;
    public int alunosMatriculados;
    public float preco;
    public List<SubcategoriaDTO> subcategorias;
    
    public Float mediaAvaliacao;
    public Integer quantidadeAvaliacoes;

    public ListCursosDTO() {  
    }

    public static ListCursosDTO fromEntity(Cursos curso) {
        ListCursosDTO dto = new ListCursosDTO();

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

        dto.subcategorias = curso.getSubcategorias().stream()
            .map(sub -> new SubcategoriaDTO(sub.getId(), sub.getNome(), sub.getSlug()))
            .toList();

            return dto;
    }

    public static ListCursosDTO fromEntity(Cursos curso, AvaliacaoResumoDTO resumo) {
        ListCursosDTO dto = fromEntity(curso);
        dto.mediaAvaliacao = resumo != null ? resumo.media() : 0f;
        dto.quantidadeAvaliacoes = resumo != null ? resumo.quantidade() : 0;
        return dto;
    }
}