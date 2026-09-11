package com.plataforma.cursos.domain.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter 
@Setter
@Entity
@Table(
    name = "carrinhos",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_carrinho_usuario",
            columnNames = "usuario_id"
        )
    }
)
public class Carrinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @OneToMany(
        mappedBy = "carrinho",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ItemCarrinho> itens = new ArrayList<>();

    public Carrinho() {
    }

    public Carrinho(User usuario) {
        this.usuario = usuario;
    }


    public List<ItemCarrinho> getItens() {
        return itens;
    }

    public void setItens(List<ItemCarrinho> itens) {
        this.itens = itens;
    }
}