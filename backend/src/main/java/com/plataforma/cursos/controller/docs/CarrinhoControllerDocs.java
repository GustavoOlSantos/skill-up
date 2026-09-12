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

@Tag(
    name = "Carrinho",
    description = "Gerenciamento do carrinho de compras"
)
@SecurityRequirement(name = "bearerAuth")
public interface CarrinhoControllerDocs {

    /**
     * Lista todos os cursos adicionados ao carrinho do usuário autenticado.
     *
     * @param authentication Objeto de autenticação JWT, que contém informações
     *                       sobre o usuário autenticado.
     * @return Lista de cursos presentes no carrinho.
     */
    @Operation(
        summary = "Listar carrinho",
        description = "Obtém todos os cursos adicionados ao carrinho do usuário autenticado"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Carrinho retornado com sucesso",
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
     * Adiciona um curso ao carrinho do usuário autenticado.
     *
     * @param cursoId ID do curso que será adicionado ao carrinho.
     * @param authentication Objeto de autenticação JWT, que contém informações
     *                       sobre o usuário autenticado.
     */
    @Operation(
        summary = "Adicionar curso ao carrinho",
        description = "Adiciona um curso ao carrinho do usuário autenticado"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Curso adicionado ao carrinho com sucesso"
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
            description = "Curso já está no carrinho ou não pode ser adicionado"
        )
    })
    public ResponseEntity<Void> adicionar(@PathVariable Long cursoId, Authentication authentication);

    /**
     * Remove um curso do carrinho do usuário autenticado.
     *
     * @param cursoId ID do curso que será removido do carrinho.
     * @param authentication Objeto de autenticação JWT, que contém informações
     *                       sobre o usuário autenticado.
     */
    @Operation(
        summary = "Remover curso do carrinho",
        description = "Remove um curso do carrinho do usuário autenticado"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Curso removido do carrinho com sucesso"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Curso não encontrado ou não está no carrinho"
        )
    })
    public ResponseEntity<Void> remover(@PathVariable Long cursoId, Authentication authentication);


    /**
     * Verifica se um curso está presente no carrinho do usuário autenticado.
     *
     * @param cursoId ID do curso que será verificado.
     * @param authentication Objeto de autenticação JWT, que contém informações
     *                       sobre o usuário autenticado.
     * @return true caso o curso esteja no carrinho, ou false caso contrário.
     */
    @Operation(
        summary = "Verificar curso no carrinho",
        description = "Verifica se um curso específico está presente no carrinho do usuário autenticado"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Verificação realizada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(
                    implementation = Boolean.class
                )
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


    /**
     * Remove todos os cursos do carrinho do usuário autenticado.
     *
     * @param authentication Objeto de autenticação JWT, que contém informações
     *                       sobre o usuário autenticado.
     */
    @Operation(
        summary = "Limpar carrinho",
        description = "Remove todos os cursos do carrinho do usuário autenticado"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Carrinho limpo com sucesso"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado"
        )
    })
    public ResponseEntity<Void> limpar(Authentication authentication);
}