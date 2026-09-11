package com.plataforma.cursos.repository;

import org.springframework.data.mongodb.repository.MongoRepository; 
import com.plataforma.cursos.domain.documents.AvaliacoesCurso;
import java.util.List;

public interface AvaliacoesCursoRepository extends MongoRepository<AvaliacoesCurso, String> {
    List<AvaliacoesCurso> findByCursoId(Integer cursoId);
    List<AvaliacoesCurso> findByCursoIdIn(List<Integer> cursoIds);
}