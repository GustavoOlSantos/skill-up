package com.plataforma.cursos.DTO;

import com.plataforma.cursos.domain.entities.User;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UserDTO {

    private Long  id;
    private String nome;
    private String email;
    private String telefone;
    private String userImagePath;

    public UserDTO() {  
    }

    public UserDTO(Long id, String nome, String email, String telefone, String userImagePath) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.userImagePath = userImagePath;
    }

    public static UserDTO fromEntity(User user) {
        UserDTO dto = new UserDTO();

        dto.id = user.getId();
        dto.nome = user.getNome();
        dto.email = user.getEmail();
        dto.telefone = user.getTelefone();
        dto.userImagePath = user.getUserImagePath();

        return dto;
    }
}