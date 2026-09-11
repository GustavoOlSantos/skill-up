package com.plataforma.cursos.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import java.util.List;
import java.time.LocalDateTime;
import com.plataforma.cursos.domain.entities.Compra;
import com.plataforma.cursos.domain.entities.User;
import com.plataforma.cursos.domain.entities.Cursos;
import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.repository.CompraRepository;
import com.plataforma.cursos.repository.UserRepository;
import com.plataforma.cursos.repository.CursosRepository;

import com.plataforma.cursos.exception.BusinessException;

@Service
public class CompraService {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CursosRepository cursoRepository;

    public List<CursosDTO> getCursoByUserId(Long userId) {
        List<Compra> compras = compraRepository.findByUsuarioId(userId);
        return compras.stream()
        .map(compra -> CursosDTO.fromEntity(compra.getCurso()))
        .toList();
}

    public void comprarCurso(Long userId, Long cursoId) {
        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado", true, HttpStatus.NOT_FOUND, "buy-curso"));


        Cursos curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new BusinessException("Curso não encontrado", true, HttpStatus.NOT_FOUND, "buy-curso"));

        boolean jaComprou = compraRepository
                .existsByUsuarioIdAndCursoId(usuario.getId(), cursoId);

        if (jaComprou) {
            throw new BusinessException("Esse usuário já comprou este curso", true,  HttpStatus.BAD_REQUEST, "buy-curso");
        }

        Compra compra = new Compra();

        compra.setUsuario(usuario);
        compra.setCurso(curso);
        compra.setDataCompra(LocalDateTime.now());

        curso.setAlunosMatriculados(curso.getAlunosMatriculados() + 1);

        compraRepository.save(compra);
        cursoRepository.save(curso);
    }

    public boolean jaComprouCurso(Long userId, Long cursoId){
        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado", true, HttpStatus.NOT_FOUND, "verify-curso-comprado"));
                

        cursoRepository.findById(cursoId)
                .orElseThrow(() -> new BusinessException("Curso não encontrado", true, HttpStatus.NOT_FOUND, "verify-curso-comprado"));

        boolean jaComprou = compraRepository
                .existsByUsuarioIdAndCursoId(usuario.getId(), cursoId);

        return jaComprou;
    }
}