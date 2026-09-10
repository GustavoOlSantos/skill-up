package com.plataforma.cursos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.plataforma.cursos.domain.entities.Cursos;
import java.util.List;

public interface CursosRepository extends JpaRepository<Cursos, Long> {
    List<Cursos> findByNomeContainingIgnoreCase(String nome);
    List<Cursos> findBySlugContainingIgnoreCase(String nome);
    List<Cursos> findDistinctTop10ByOrderByAlunosMatriculadosDesc();
}