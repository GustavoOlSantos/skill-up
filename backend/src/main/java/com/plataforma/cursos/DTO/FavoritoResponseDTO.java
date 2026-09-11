package com.plataforma.cursos.DTO;

public class FavoritoResponseDTO {

    private Long id;
    private Long cursoId;

    public FavoritoResponseDTO(Long id, Long cursoId) {
        this.id = id;
        this.cursoId = cursoId;
    }

    public Long getId() {
        return id;
    }

    public Long getCursoId() {
        return cursoId;
    }
}
