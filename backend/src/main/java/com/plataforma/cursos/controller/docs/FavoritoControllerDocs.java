package com.plataforma.cursos.controller.docs;

import com.plataforma.cursos.DTO.CursosDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.*;

@Tag(name = "Favoritos", description = "Gerenciamento dos cursos favoritos do usuário")
@SecurityRequirement(name = "bearerAuth")
public interface FavoritoControllerDocs {

    /**
     * Lista todos os cursos favoritos do usuário autenticado.
     *
     * @param authentication Objeto de autenticação JWT, que contém informações sobre o usuário autenticado.
     * @return Lista de cursos favoritos.
     */
    @Operation(summary = "Listar favoritos", description = "Obtém todos os cursos favoritos do usuário autenticado")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Favoritos retornados com sucesso",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(
                    schema = @Schema(implementation = CursosDTO.class)
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado"
        )
    })
    public ResponseEntity<List<CursosDTO>> listar(Authentication authentication);


    /**
     * Adiciona um curso aos favoritos do usuário autenticado.
     *
     * @param cursoId ID do curso que será adicionado aos favoritos.
     * @param authentication Objeto de autenticação JWT, que contém informações sobre o usuário autenticado.
     */
    @Operation(summary = "Adicionar curso aos favoritos", description = "Adiciona um curso à lista de favoritos do usuário autenticado")
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Curso adicionado aos favoritos com sucesso"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Curso não encontrado"
        ),
        @ApiResponse(
            responseCode = "422",
            description = "Curso já está nos favoritos"
        )
    })
    public ResponseEntity<Void> adicionar(@PathVariable Long cursoId, Authentication authentication);


    /**
     * Remove um curso dos favoritos do usuário autenticado.
     *
     * @param cursoId ID do curso que será removido dos favoritos.
     * @param authentication Objeto de autenticação JWT, que contém informações sobre o usuário autenticado.
     */
    @Operation(summary = "Remover curso dos favoritos", description = "Remove um curso da lista de favoritos do usuário autenticado")
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Curso removido dos favoritos com sucesso"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Curso não encontrado ou não está nos favoritos"
        )
    })
    public ResponseEntity<Void> remover(@PathVariable Long cursoId, Authentication authentication);


    /**
     * Verifica se um curso está nos favoritos do usuário autenticado.
     *
     * @param cursoId ID do curso que será verificado.
     * @param authentication Objeto de autenticação JWT, que contém informações sobre o usuário autenticado.
     * @return true caso o curso esteja nos favoritos, ou false caso contrário.
     */
    @Operation(summary = "Verificar curso nos favoritos", description = "Verifica se um curso está presente na lista de favoritos do usuário autenticado")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Verificação realizada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Boolean.class)
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Curso não encontrado"
        )
    })
    public ResponseEntity<Boolean> existe(@PathVariable Long cursoId, Authentication authentication);
}