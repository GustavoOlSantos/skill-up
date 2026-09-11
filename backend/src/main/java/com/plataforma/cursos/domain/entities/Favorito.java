package com.plataforma.cursos.domain.entities;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Setter 
@Getter 
@Entity
@Table(
    name = "favoritos",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "curso_id"})
    }
)

public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "curso_id", nullable = false)
    private Cursos curso;

    public Favorito() {
    }

    public Favorito(User usuario, Cursos curso) {
        this.usuario = usuario;
        this.curso = curso;
    }

}