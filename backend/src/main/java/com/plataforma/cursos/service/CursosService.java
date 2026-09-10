package com.plataforma.cursos.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;
import org.springframework.http.*;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.stream.Stream;
import com.plataforma.cursos.domain.entities.Cursos;
import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.DTO.ListCursosDTO;
import com.plataforma.cursos.DTO.ViewCursosDTO;
import com.plataforma.cursos.domain.entities.ModuloCurso;
import com.plataforma.cursos.domain.entities.Subcategoria;
import com.plataforma.cursos.domain.entities.AulaCurso;
import com.plataforma.cursos.DTO.AvaliacaoResumoDTO;
import com.plataforma.cursos.DTO.CriarCursoDTO;
import com.plataforma.cursos.repository.SubcategoriaRepository;
import com.plataforma.cursos.utils.NullPropertyUtils;
import com.plataforma.cursos.exception.BusinessException;
import com.plataforma.cursos.repository.CursosRepository;
import java.util.Optional;

@Service
public class CursosService {

    private final CursosRepository repository;
    private final SubcategoriaRepository subcategoriaRepository;
    private final AvaliacoesCursoService avaliacoesCursoService;

    public CursosService(CursosRepository repository, SubcategoriaRepository subcategoriaRepository, AvaliacoesCursoService avaliacoesCursoService) {
        this.repository = repository;
        this.subcategoriaRepository = subcategoriaRepository;
        this.avaliacoesCursoService = avaliacoesCursoService;
    }

    @Cacheable("TodosOsCursos")
    public List<ListCursosDTO> findAll() {
        List<Cursos> cursos = repository.findAll();

        List<Integer> cursoIds = cursos.stream().map(curso -> curso.getId().intValue()).toList();
        Map<Integer, AvaliacaoResumoDTO> resumosPorCurso = avaliacoesCursoService.findResumoByCursoIds(cursoIds);

        return cursos.stream()
            .map(curso -> ListCursosDTO.fromEntity(curso, resumosPorCurso.get(curso.getId().intValue())))
            .toList();
    }

    @Cacheable("cursosMaisVendidos")
    public List<CursosDTO> findBestSellers(){
        List<Cursos> cursos = repository.findDistinctTop10ByOrderByAlunosMatriculadosDesc();
        
        if (cursos.isEmpty()) {
            throw new BusinessException("Nenhum curso encontrado", true,  HttpStatus.NOT_FOUND, "find-best-cursos");
        }

        List<Integer> cursoIds = cursos.stream().map(curso -> curso.getId().intValue()).toList();
        Map<Integer, AvaliacaoResumoDTO> resumosPorCurso = avaliacoesCursoService.findResumoByCursoIds(cursoIds);

        return cursos.stream()
            .map(curso -> CursosDTO.fromEntity(curso, resumosPorCurso.get(curso.getId().intValue())))
            .toList();
    }

    public CursosDTO findById(Long id) {
        Cursos curso = repository.findById(id)
            .orElseThrow(() -> new BusinessException("Curso não encontrado", true, HttpStatus.NOT_FOUND, "find-curso"));

        AvaliacaoResumoDTO resumo = avaliacoesCursoService.findResumoByCursoId(id.intValue());
        return CursosDTO.fromEntity(curso, resumo);
    }

    public List<CursosDTO> findByName(String name) {

        List<Cursos> cursos = repository.findByNomeContainingIgnoreCase(name);

        if (cursos.isEmpty()) {
            throw new BusinessException("Nenhum curso encontrado", true,  HttpStatus.NOT_FOUND, "find-name-curso");
        }

        return cursos.stream()
        .map(CursosDTO::fromEntity)
        .toList();
    }

    public List<CursosDTO> findBySlug(String name) {

        List<Cursos> cursos = repository.findBySlugContainingIgnoreCase(name);

        if (cursos.isEmpty()) {
            throw new BusinessException("Nenhum curso encontrado", true,  HttpStatus.NOT_FOUND, "find-slug-curso");
        }

        List<Integer> cursoIds = cursos.stream().map(curso -> curso.getId().intValue()).toList();
        Map<Integer, AvaliacaoResumoDTO> resumosPorCurso = avaliacoesCursoService.findResumoByCursoIds(cursoIds);

        return cursos.stream()
            .map(curso -> CursosDTO.fromEntity(curso, resumosPorCurso.get(curso.getId().intValue())))
            .toList();
    }

    public List<ViewCursosDTO> findAulasBySlug(String name) {

        List<Cursos> cursos = repository.findBySlugContainingIgnoreCase(name);

        if (cursos.isEmpty()) {
            throw new BusinessException("Nenhum curso encontrado", true,  HttpStatus.NOT_FOUND, "find-aulas-curso");
        }

        return cursos.stream()
        .map(ViewCursosDTO::fromEntity)
        .toList();
    }

    public CursosDTO registerCompleto(CriarCursoDTO dto) {

        Cursos curso = new Cursos();
        curso.setSlug(dto.slug);
        curso.setNome(dto.nome);
        curso.setSubtitulo(dto.subtitulo);
        curso.setDescricao(dto.descricao);
        curso.setInstrutor(dto.instrutor);
        curso.setDuracao(dto.duracao);
        curso.setNumeroAulas(dto.numeroAulas);
        curso.setImagemUrl(dto.imagemUrl);
        curso.setUltimaAtualizacao(dto.ultimaAtualizacao);
        curso.setIdioma(dto.idioma);
        curso.setNivel(dto.nivel);
        curso.setAlunosMatriculados(dto.alunosMatriculados);
        curso.setPreco(dto.preco);
        curso.setRequisitos(dto.requisitos);

        if (dto.subcategorias != null) {
            List<Subcategoria> subcategorias = dto.subcategorias.stream()
                .map(ref -> subcategoriaRepository.findById(ref.id)
                    .orElseThrow(() -> new BusinessException(
                        "Subcategoria informada não encontrada: " + ref.id, true, HttpStatus.BAD_REQUEST, "create-full-curso")))
                .toList();
            curso.setSubcategorias(subcategorias);
        }

        if (dto.modulos != null) {
            List<ModuloCurso> modulos = dto.modulos.stream().map(moduloDTO -> {
                ModuloCurso modulo = new ModuloCurso();
                modulo.setTitulo(moduloDTO.titulo);
                modulo.setDescricao(moduloDTO.descricao);
                modulo.setOrdem(moduloDTO.ordem);
                modulo.setCurso(curso); // FK

                if (moduloDTO.aulas != null) {
                    List<AulaCurso> aulas = moduloDTO.aulas.stream().map(aulaDTO -> {
                        AulaCurso aula = new AulaCurso();
                        aula.setTitulo(aulaDTO.titulo);
                        aula.setDescricao(aulaDTO.descricao);
                        aula.setVideo_url(aulaDTO.videoUrl);
                        aula.setThumbnail(aulaDTO.thumbnail);
                        aula.setDuracao_segundos(aulaDTO.duracaoSegundos);
                        aula.setOrdem(aulaDTO.ordem);
                        aula.setGratuita(aulaDTO.gratuita);
                        aula.setPublicada(aulaDTO.publicada);
                        aula.setModulo(modulo); // FK
                        return aula;
                    }).toList();
                    modulo.setAulas(aulas);
                }
                return modulo;
            }).toList();
            curso.setModulos(modulos);
        }

        Cursos salvo = repository.save(curso);
        return CursosDTO.fromEntity(salvo);
    }

    public Cursos register(Cursos curso) {
        if(curso.isValido()){
            throw new BusinessException("Dados incompletos para cadastro", true,  HttpStatus.BAD_REQUEST, "create-curso");
        }

        if(!repository.findByNomeContainingIgnoreCase(curso.getNome()).isEmpty()){
            throw new BusinessException("Curso com esse nome já cadastrado no sistema", true, HttpStatus.BAD_REQUEST, "create-curso");
        }

        return repository.save(curso);
    }

    public CursosDTO update(Long id, Cursos dadosAtualizados){
        Optional<Cursos> curso = repository.findById(id);

        if (curso.isEmpty()) {
            throw new BusinessException("Curso não encontrado", true, HttpStatus.NOT_FOUND, "update-curso");
        }

        String[] ignoredProperties = Stream.concat(
            Stream.of("id"),
            Arrays.stream(
                    NullPropertyUtils.getNullPropertyNames(dadosAtualizados)
            )
        ).toArray(String[]::new);

        BeanUtils.copyProperties(dadosAtualizados, curso.get(), ignoredProperties);

        Cursos salvo = repository.save(curso.get());
        return CursosDTO.fromEntity(salvo);
    }

    public void deleteById(Long id){
        Optional<Cursos> curso = repository.findById(id);
        if (curso.isEmpty()) {
            throw new BusinessException("Curso não encontrado", true, HttpStatus.NOT_FOUND, "delete-curso");
        }

        repository.deleteById(id);
    }
}