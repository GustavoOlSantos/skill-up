package com.plataforma.cursos.service;

import com.plataforma.cursos.DTO.AvaliacaoResumoDTO;
import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.domain.entities.Carrinho;
import com.plataforma.cursos.domain.entities.Cursos;
import com.plataforma.cursos.domain.entities.ItemCarrinho;
import com.plataforma.cursos.domain.entities.User;
import com.plataforma.cursos.exception.BusinessException;
import com.plataforma.cursos.repository.CarrinhoRepository;
import com.plataforma.cursos.repository.CursosRepository;
import com.plataforma.cursos.repository.ItemCarrinhoRepository;
import com.plataforma.cursos.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CarrinhoService {

    private final CarrinhoRepository carrinhoRepository;
    private final ItemCarrinhoRepository itemCarrinhoRepository;
    private final UserRepository userRepository;
    private final CursosRepository cursosRepository;
    private final AvaliacoesCursoService avaliacoesCursoService;

    public CarrinhoService(CarrinhoRepository carrinhoRepository, ItemCarrinhoRepository itemCarrinhoRepository, UserRepository userRepository, CursosRepository cursosRepository, AvaliacoesCursoService avaliacoesCursoService) {
        this.carrinhoRepository = carrinhoRepository;
        this.itemCarrinhoRepository = itemCarrinhoRepository;
        this.userRepository = userRepository;
        this.cursosRepository = cursosRepository;
        this.avaliacoesCursoService = avaliacoesCursoService;
    }

    private Carrinho obterOuCriarCarrinho(Long usuarioId) {

        return carrinhoRepository.findByUsuarioId(usuarioId).orElseGet(() -> {

            User usuario = userRepository.findById(usuarioId).orElseThrow(() ->
                new BusinessException("Usuário não encontrado", true,  HttpStatus.BAD_REQUEST, "obter/criar-carrinho")
            );

            return carrinhoRepository.save(new Carrinho(usuario));
        });
    }

    @Transactional(readOnly = true)
    public List<CursosDTO> listar(Long usuarioId) {

        Optional<Carrinho> carrinhoOptional = carrinhoRepository.findByUsuarioId(usuarioId);

        List<Cursos> cursos = carrinhoOptional
            .map(carrinho -> carrinho.getItens().stream()
            .map(ItemCarrinho::getCurso)
            .toList()
            )
            .orElse(List.of());

        List<Integer> cursoIds = cursos.stream().map(curso -> curso.getId().intValue()).toList();
        Map<Integer, AvaliacaoResumoDTO> resumosPorCurso = avaliacoesCursoService.findResumoByCursoIds(cursoIds);

        return cursos.stream()
            .map(curso -> CursosDTO.fromEntity(curso, resumosPorCurso.get(curso.getId().intValue())))
            .toList();
    }


    @Transactional
    public void adicionar(Long usuarioId, Long cursoId) {

        Carrinho carrinho = obterOuCriarCarrinho(usuarioId);

        Cursos curso = cursosRepository.findById(cursoId).orElseThrow(() ->
            new BusinessException("Curso não encontrado", true,  HttpStatus.BAD_REQUEST, "adicionar-carrinho")
        );

        boolean existe = itemCarrinhoRepository.existsByCarrinhoIdAndCursoId(carrinho.getId(), cursoId);

        if (existe) return;

        ItemCarrinho item = new ItemCarrinho(carrinho, curso);
        carrinho.getItens().add(item);
        itemCarrinhoRepository.save(item);
    }


    @Transactional
    public void remover( Long usuarioId, Long cursoId) {

        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId).orElseThrow(() ->
            new BusinessException("Carrinho não encontrado", true,  HttpStatus.BAD_REQUEST, "remover-carrinho")
        );

        itemCarrinhoRepository.deleteByCarrinhoIdAndCursoId(carrinho.getId(),cursoId);
    }

    @Transactional(readOnly = true)
    public boolean existe(Long usuarioId, Long cursoId) {
        return itemCarrinhoRepository.existsByCarrinho_Usuario_IdAndCurso_Id(usuarioId, cursoId);
    }


    @Transactional
    public void limpar(Long usuarioId) {

        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId).orElse(null);

        if (carrinho == null) return;

        carrinho.getItens().clear();
        carrinhoRepository.save(carrinho);
    }
}