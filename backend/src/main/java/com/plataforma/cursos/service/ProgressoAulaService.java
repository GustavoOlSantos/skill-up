package com.plataforma.cursos.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.plataforma.cursos.exception.BusinessException;

import com.plataforma.cursos.domain.entities.AulaCurso;
import com.plataforma.cursos.domain.entities.ProgressoAula;
import com.plataforma.cursos.DTO.ProgressoRequestDTO;
import com.plataforma.cursos.domain.entities.User;

import com.plataforma.cursos.repository.AulaCursoRepository;
import com.plataforma.cursos.repository.ProgressoAulaRepository;
import com.plataforma.cursos.repository.UserRepository;

@Service
public class ProgressoAulaService {

        @Autowired
        private ProgressoAulaRepository progressoAulaRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AulaCursoRepository aulaCursoRepository;


        public ProgressoAula getProgresso(Long aulaId, Long userId) {
                return progressoAulaRepository.findByUsuarioIdAndAulaId(userId, aulaId)
                .orElse(null);
        }

        public boolean salvar(ProgressoRequestDTO progresso, Long userId){

                User usuario = userRepository.findById(userId)
                        .orElseThrow(() -> new BusinessException("Usuário não encontrado", true, HttpStatus.NOT_FOUND, "save-progresso"));

                AulaCurso aula = aulaCursoRepository.findById(progresso.getAulaId())
                        .orElseThrow(() -> new BusinessException("Aula não encontrada", true, HttpStatus.NOT_FOUND, "save-progresso"));

                ProgressoAula progressoAula = progressoAulaRepository
                        .findByUsuarioIdAndAulaId(userId, progresso.getAulaId())
                        .orElse(new ProgressoAula());

                progressoAula.setUsuario(usuario);
                progressoAula.setAula(aula);

                Integer atual = progressoAula.getUltimoSegundo();
                Integer novo = progresso.getUltimoSegundo();

                if (atual == null || novo == null) {
                        progressoAula.setUltimoSegundo(novo);
                } else if (novo > atual) {
                        progressoAula.setUltimoSegundo(novo);
                }

                progressoAula.setUltimaVisualizacao(LocalDateTime.now());

                Boolean concluida = progresso.getConcluida();

                if (concluida != null && concluida) {
                        progressoAula.setConcluida(true);
                        progressoAula.setDataConclusao(LocalDateTime.now());
                }

                progressoAulaRepository.save(progressoAula);

                return true;
        }

        public ProgressoAula getUltimaAulaAssistida(Long userId, Integer cursoId) {
                return progressoAulaRepository.findTopByUsuarioIdAndAulaModuloCursoIdOrderByUltimaVisualizacaoDesc(userId, cursoId)
                .orElse(null);
        }

        public List<Integer> getAulasConcluidas(Long userId, Integer cursoId) {
                return progressoAulaRepository.findAulasConcluidas(userId, cursoId);
        }
}