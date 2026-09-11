package com.plataforma.cursos.service;

import com.plataforma.cursos.DTO.AvaliacaoResumoDTO;
import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.domain.entities.Cursos;
import com.plataforma.cursos.domain.entities.Favorito;
import com.plataforma.cursos.domain.entities.User;
import com.plataforma.cursos.exception.BusinessException;
import com.plataforma.cursos.repository.CursosRepository;
import com.plataforma.cursos.repository.FavoritoRepository;
import com.plataforma.cursos.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UserRepository userRepository;
    private final CursosRepository cursosRepository;
    private final AvaliacoesCursoService avaliacoesCursoService;

    public FavoritoService( FavoritoRepository favoritoRepository, UserRepository userRepository, CursosRepository cursosRepository, AvaliacoesCursoService avaliacoesCursoService) {
        this.favoritoRepository = favoritoRepository;
        this.userRepository = userRepository;
        this.cursosRepository = cursosRepository;
        this.avaliacoesCursoService = avaliacoesCursoService;
    }


    @Transactional(readOnly = true)
    public List<CursosDTO> listar(Long userId) {

        List<Cursos> cursos = favoritoRepository.findByUsuarioId(userId).stream()
            .map(Favorito::getCurso)
            .toList();

        List<Integer> cursoIds = cursos.stream()
            .map(curso -> curso.getId().intValue())
            .toList();

        Map<Integer, AvaliacaoResumoDTO> resumosPorCurso =
            avaliacoesCursoService.findResumoByCursoIds(cursoIds);

        return cursos.stream()
            .map(curso ->
                CursosDTO.fromEntity(
                    curso,
                    resumosPorCurso.get(curso.getId().intValue())
                )
            )
            .toList();
    }


    @Transactional
    public void adicionar(Long userId, Long cursoId) {

        if (favoritoRepository.existsByUsuarioIdAndCursoId(userId, cursoId)) {
            return;
        }

        User user = userRepository.findById(userId).orElseThrow(() ->
            new BusinessException("Usuário não encontrado", true,  HttpStatus.BAD_REQUEST, "adicionar-favoritos")
        );

        Cursos curso = cursosRepository.findById(cursoId).orElseThrow(() ->
            new BusinessException("Curso não encontrado", true,  HttpStatus.BAD_REQUEST, "adicionar-favoritos")
        );

        Favorito favorito = new Favorito(user, curso);
        favoritoRepository.save(favorito);
    }


    @Transactional
    public void remover(Long userId, Long cursoId) {
        favoritoRepository.deleteByUsuarioIdAndCursoId(userId, cursoId);
    }


    @Transactional(readOnly = true)
    public boolean existe(Long userId, Long cursoId) {
        return favoritoRepository.existsByUsuarioIdAndCursoId(userId, cursoId);
    }
}
