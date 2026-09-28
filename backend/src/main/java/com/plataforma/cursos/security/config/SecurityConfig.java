package com.plataforma.cursos.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import com.plataforma.cursos.security.service.TokenService;
import com.plataforma.cursos.security.filter.JwtFilter;
import com.plataforma.cursos.config.RequestLoggingFilter; // ajuste pro pacote real
import java.util.List;

@Configuration
public class SecurityConfig {
    private final TokenService tokenService;
    private final RequestLoggingFilter requestLoggingFilter;

    public SecurityConfig(TokenService tokenService, RequestLoggingFilter requestLoggingFilter) {
        this.tokenService = tokenService;
        this.requestLoggingFilter = requestLoggingFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health").permitAll()
                .requestMatchers("/dev/**", "/dev/seed").permitAll()
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/api-docs/**").permitAll()
                .requestMatchers("/cursos/aulas/**").authenticated()
                .requestMatchers("/compras/**", "/compras").authenticated()
                .requestMatchers(HttpMethod.POST, "/avaliacoes/curso").permitAll()
                .requestMatchers(HttpMethod.GET, "/avaliacoes/curso/**").permitAll()
                .requestMatchers("/auth/id/**", "/auth/login", "/auth/cadastro", "/cursos", "/cursos/**", "/categorias", "/categorias/**", "/subcategorias/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable())
            .addFilterBefore(new JwtFilter(tokenService), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(requestLoggingFilter, JwtFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "https://project-pritz.vercel.app", "https://skillup-courses.vercel.app", "https://skillup.gustavoolsantos.dev.br"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}