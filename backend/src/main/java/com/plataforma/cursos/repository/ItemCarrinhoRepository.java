package com.plataforma.cursos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.plataforma.cursos.domain.entities.ItemCarrinho;

import java.util.Optional;

public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {
    Optional<ItemCarrinho> findByCarrinhoIdAndCursoId( Long carrinhoId, Long cursoId);
    boolean existsByCarrinhoIdAndCursoId(Long carrinhoId, Long cursoId);
    boolean existsByCarrinho_Usuario_IdAndCurso_Id(Long usuarioId, Long cursoId);
    void deleteByCarrinhoIdAndCursoId(Long carrinhoId, Long cursoId);
}
