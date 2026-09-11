package com.plataforma.cursos.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.plataforma.cursos.domain.entities.Favorito;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    boolean existsByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);
    Optional<Favorito> findByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);
    List<Favorito> findByUsuarioId(Long usuarioId);
    void deleteByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);
}