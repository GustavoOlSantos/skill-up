package com.plataforma.cursos.DTO;
import java.util.List;
import java.util.Date;
import com.plataforma.cursos.domain.entities.Cursos;

import lombok.Getter;
import lombok.Setter;

import com.plataforma.cursos.DTO.ModuloCursoDTO;

@Getter 
@Setter 
@SuppressWarnings("unused")
public class ViewCursosDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String instrutor;
    private String duracao;
    private int numeroAulas;
    private Date ultimaAtualizacao;
    private int alunosMatriculados;
    private String nivel;
    private List<ModuloCursoDTO> modulos;

    public ViewCursosDTO() {  
    }

    public static ViewCursosDTO fromEntity(Cursos curso) {
        ViewCursosDTO dto = new ViewCursosDTO();
        dto.id = curso.getId();
        dto.nome = curso.getNome();
        dto.descricao = curso.getDescricao();           
        dto.instrutor = curso.getInstrutor();
        dto.duracao = curso.getDuracao();
        dto.numeroAulas = curso.getNumeroAulas();
        dto.ultimaAtualizacao = curso.getUltimaAtualizacao(); 
        dto.alunosMatriculados = curso.getAlunosMatriculados(); 
        dto.nivel = curso.getNivel();
        dto.modulos = curso.getModulos()
            .stream()
            .map(ModuloCursoDTO::fromEntity)
            .toList();
        return dto;
    }

    public List<ModuloCursoDTO> getModulos() { return modulos; }
}