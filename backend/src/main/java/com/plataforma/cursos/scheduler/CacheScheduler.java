package com.plataforma.cursos.scheduler;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheScheduler {
    @Scheduled(fixedRate = 1800000)
    @CacheEvict(value = "cursosMaisVendidos", allEntries = true)
    public void limparCacheCursos() {
       System.out.println("Cache de mais vendidos limpo!");
    }

    @Scheduled(fixedRate = 1800000)
    @CacheEvict(value = "categoriasFooter", allEntries = true)
    public void limparCacheCategorias() {
       System.out.println("Cache de categorias limpo!");
    }
    
    @Scheduled(fixedRate = 1800000)
    @CacheEvict(value = "TodosOsCursos", allEntries = true)
    public void limparCacheTodosOsCursos() {
       System.out.println("Cache de todos os cursos limpo!");
    }
}
