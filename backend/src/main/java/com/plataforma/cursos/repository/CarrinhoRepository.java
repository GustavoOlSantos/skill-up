package com.plataforma.cursos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.plataforma.cursos.domain.entities.Carrinho;

import java.util.Optional;

public interface CarrinhoRepository
        extends JpaRepository<Carrinho, Long> {

    Optional<Carrinho> findByUsuarioId(Long usuarioId);
}