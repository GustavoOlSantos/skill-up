package com.plataforma.cursos.controller.docs;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import com.plataforma.cursos.domain.entities.Cursos;
import com.plataforma.cursos.DTO.CursosDTO;
import com.plataforma.cursos.DTO.ListCursosDTO;
import com.plataforma.cursos.DTO.ViewCursosDTO;
import com.plataforma.cursos.DTO.CriarCursoDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.media.*;

@Tag(name = "Cursos", description = "Gerenciamento de cursos")
public interface CursosControllerDocs {

    /**
     * Encontra todos os cursos cadastrados. 
     * @return Lista de {@link ListCursosDTO} cadastrados.
     */
    @Operation(summary = "Encontrar todos cursos", description = "Encontra todos os cursos cadastrados")
    @ApiResponses({
        @ApiResponse(responseCode = "200", 
            description = "Lista de cursos retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = CursosDTO.class))
            )
        ),
        @ApiResponse(responseCode = "403", description = "não autorizado"),
    })
    public List<ListCursosDTO> list();

    /**
     * Obtém a lista de cursos mais vendidos.
     * @return Lista de {@link CursosDTO} com os cursos mais vendidos.
     */
    @Operation(summary = "Encontrar mais vendidos", description = "Encontra os cursos mais vendidos")
    @ApiResponses({
        @ApiResponse(responseCode = "200", 
            description = "Lista de cursos retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = CursosDTO.class))
            )
        ),
        @ApiResponse(responseCode = "404", description = "nenhum curso encontrado"),
    })
    public List<CursosDTO> getMaisVendidos();

    /**
     * Encontrar cursos pelo nome.
     * @param name Nome do curso a ser buscado.
     * @return Lista de {@link CursosDTO} que correspondem ao nome fornecido.
     */
    @Operation(summary = "Encontrar cursos por nome", description = "Encontra cursos pelo nome")
    @ApiResponses({
        @ApiResponse(responseCode = "200", 
            description = "Lista de cursos retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = CursosDTO.class))
            )
        ),
        @ApiResponse(responseCode = "404", description = "nenhum curso encontrado"),
    })
    public List<CursosDTO> getByName(@PathVariable String name);

    /**
     * Encontra cursos pelo slug.
     * @param slug Slug do curso a ser buscado.
     * @return Lista de {@link CursosDTO} que correspondem ao slug fornecido.
     */
    @Operation(summary = "Encontrar cursos por slug", description = "Encontra cursos pelo slug")
    @ApiResponses({
        @ApiResponse(responseCode = "200", 
            description = "Lista de cursos retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = CursosDTO.class))
            )
        ),
        @ApiResponse(responseCode = "404", description = "nenhum curso encontrado"),
    })
    public List<CursosDTO> getBySlug(@PathVariable String slug);

    /**
     * Encontra um curso pelo ID.
     * @param id Id do curso a ser encontrado.
     * @return {@link CursosDTO}, contendo as informações do curso encontrado.
     */
    @Operation(summary = "Encontrar curso por ID", description = "Encontra um curso pelo ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", 
            description = "Curso encontrado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CursosDTO.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "curso não encontrado"),
    })
    public CursosDTO getById(@PathVariable Long id);

    /**
     * Encontra as aulas de um curso pelo slug.
     * @param slug Slug do curso cujas aulas devem ser encontradas.
     * @return Lista de {@link ViewCursosDTO} contendo as informações das aulas do curso.
     */
    @Operation(summary = "Encontrar aulas por slug", description = "Encontra as aulas de um curso pelo slug")
    @ApiResponses({
        @ApiResponse(responseCode = "200", 
            description = "Lista de aulas retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = ViewCursosDTO.class))
            )
        ),
        @ApiResponse(responseCode = "404", description = "Nenhum curso encontrado"),
    })
    public List<ViewCursosDTO> getAulasBySlug(@PathVariable String slug);

    /**
     * Registra um novo curso.
     * @param dto {@link CriarCursoDTO}, que contém os detalhes do curso a ser registrado.
     * @return {@link CursosDTO}, contendo as informações do curso registrado.
     */
    @Operation(summary = "Registrar novo curso", description = "Registra um novo curso")
    @ApiResponses({
        @ApiResponse(responseCode = "201", 
            description = "Curso registrado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CursosDTO.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "Subcategoria informada não encontrada: {idSubcategoria}"),
    })
    public ResponseEntity<CursosDTO> create(@RequestBody CriarCursoDTO dto);

    /**
     * Atualiza um curso existente.
     * @param curso {@link Cursos}, contendo as informações atualizadas do curso.
     * @param id Id do curso a ser atualizado.
     * @return {@link ResponseEntity<CursosDTO>}, contendo o curso atualizado.
     */
    @Operation(summary = "Atualizar curso", description = "Atualiza um curso existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", 
            description = "Curso atualizado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CursosDTO.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "Curso não encontrado"),
    })
    public ResponseEntity<CursosDTO> update(@RequestBody Cursos curso, @PathVariable Long id);

    /**
     * Deleta um curso existente.
     * @param id Id do curso a ser deletado.
     * @return {@link ResponseEntity<Void>}, indicando o sucesso ou falha da operação.
     */
    @Operation(summary = "Deletar curso", description = "Deleta um curso existente")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Curso deletado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Curso não encontrado"),
    })
    public ResponseEntity<Void> delete(@PathVariable Long id);
}