# Plataforma de Cursos - Skill Up

<div align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Java](https://img.shields.io/badge/Java-21-red)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-6DB33F)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB)
![Personal Project](https://img.shields.io/badge/type-personal_project-purple)

</div>

<p align="center">
  <img src="./screenshots/home-page.png" width="45%"/>
  <img src="./screenshots/assistir-curso.png" width="45%"/>
  <img src="./screenshots/detalhamento-curso.png" width="45%"/>
  <img src="./screenshots/fluxo.gif" width="45%"/>
</p>



## Sobre o projeto

A Plataforma de Cursos - Skill Up é uma aplicação full stack desenvolvida individualmente com foco em arquitetura escalável, autenticação segura e integração entre frontend e backend.

O sistema simula uma plataforma EAD, permitindo gerenciamento e consumo de cursos através de uma aplicação React integrada a uma API REST desenvolvida com Spring Boot.

Este projeto está em desenvolvimento contínuo e vem sendo utilizado como ambiente de estudo, experimentação e evolução técnica em desenvolvimento full stack.

<div align="center">
  <img src="https://skillicons.dev/icons?i=java,spring,maven,react,mysql,mongodb,cypress,githubactions" />
</div>

---

##  Deploy da aplicação

A plataforma está totalmente deployada e integrada com serviços cloud reais.

### Acessar aplicação
- [🌐 Frontend (Vercel)](https://project-pritz.vercel.app/)
- [⚙️ Backend API (Render)](https://plataforma-de-cursos-eeow.onrender.com)  (Render possui cold start, o primeiro request pode ter um delay)
- [📚 Documentação da API (Swagger)](https://plataforma-de-cursos-eeow.onrender.com/swagger-ui/index.html)


---

## Infraestrutura utilizada

| Serviço | Plataforma |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Banco Relacional | Aiven MySQL |
| Banco NoSQL | MongoDB Atlas |
| Armazenamento de imagens | Cloudinary |
| Testes Automatizados | Cypress |
| CI/CD | Workflows no Github Actions |
| Docker | Docker compose para dev |

---

## Funcionalidades

- Cadastro e autenticação JWT
- Compra de cursos
- Estrutura para avaliações de cursos
- Player de vídeo integrado ao YouTube
- Salvamento automático de progresso
- Continuação de aulas por timestamp
- Persistência de progresso do usuário
- Gerenciamento de imagens via Cloudinary
- Integração MySQL + MongoDB
- Interface responsiva com suporte a dispositivos mobile
- Cache de aplicação para requisições frequentes, como cursos mais vendidos, todos os cursos...
- Health check via `/health` utilizado pelo Render para monitoramento e restart automático por `cron-job.org` para evitar cold start por inatividade no plano gratuito

---

# Stack utilizada

## Frontend

| Tecnologia | Versão |
|---|---|
| React | 18.3.1 |
| React Router DOM | 6.30.3 |
| Axios | 1.14.0 |
| JWT Decode | 4.0.0 |
| React Scripts | 5.0.1 |
| Cypress | 15.17.0 |

---

## Backend

| Tecnologia | Versão |
|---|---|
| Java | 21 |
| Lombok | 1.18.46 |
| Spring Boot | 4.0.5 |
| Spring Security | 4.0.5 |
| Spring Data JPA | 4.0.5 |
| Spring Data MongoDB | 4.0.5 |
| JWT | 0.11.5 |
| Logstash Logback Encoder | 7.4 |
| Maven | Wrapper |

---

## Banco de dados

| Banco | Utilização |
|---|---|
| MySQL | Dados relacionados a usuários, cursos e compras |
| MongoDB | Dados relacionados a avaliações e comentários |

---

## Testes

A aplicação possui testes end-to-end implementados com Cypress, cobrindo os principais fluxos do usuário:

- Cadastro e login
- Home page
- Ciclo de vida dos cursos

Os testes são executados localmente durante o desenvolvimento e automaticamente a cada push/PR através da pipeline de CI (veja a seção CI/CD), rodando contra uma instância real da aplicação com banco de dados populado via seed.

## CI/CD

A pipeline de CI foi implantada via Github Actions, disparando automaticamente em pushes nas branches `develop` e `main`, além de pull requests abertas contra `main`. Isso garante que toda alteração passe por build e testes automatizados antes de ser integrada, prevenindo regressões e dando mais segurança às entregas — inclusive bloqueando o merge de PRs até a pipeline passar.

A pipeline é dividida em três jobs, onde as builds de frontend e backend rodam em paralelo e seus artefatos são reaproveitados pelo job de testes, evitando rebuild desnecessário:

| Job | Função |
|---|---|
| Segurança (Backend)| Realiza a análise de vulnerabibilidades conhecidas presentes no projeto, de acordo com o relatório Owasp |
| Análise Estática (Backend) | Realiza a análise estática de código utilizando o SpotBugs, detectando code smells e má práticas |
| Segurança (frontend) | Realiza a análise de vulnerabilidades conhecidas utilizando o npm audit |
| Análise Estática (Frontend) | Realiza a análise estática de código utilizando o SpotBugs, detectando code smells e não conformidades com os padrões do React|
| build-frontend | Instala dependências, gera a build de produção do React e salva o resultado como artefato |
| build-backend | Compila a aplicação Spring Boot via Maven Wrapper e salva o `.jar` gerado como artefato |
| testes-cypress | Baixa os artefatos das builds anteriores, sobe instâncias temporárias de MySQL e MongoDB como *services*, popula o banco com dados de seed, levanta o backend e o frontend localmente e executa os testes E2E com Cypress contra a aplicação completa |

Caso algum job falhe, a notificação é imediata, facilitando a identificação e correção de problemas antes da integração com a branch principal.

## Arquitetura do projeto

<p align="center">
  <img src="./screenshots/arquitetura.png" width="80%"/>
</p>

```bash
plataforma-de-cursos/
│
├── frontend/     # Aplicação React
├── backend/      # API REST Spring Boot
│
└── package.json  # Execução simultânea dos serviços
````

---

## Backend

O backend foi estruturado utilizando arquitetura em camadas:

```bash
config/
controller/
domain/
DTO/
exception/
repository/
scheduler/
security/
service/
utils/
```

### Principais responsabilidades
* Config → configuração Web e disponibilização de imagens
* Controllers → exposição da API REST
* Domain → centraliza as entidades e documentos do projeto
* DTOs → transferência de dados
* Exception Handler → tratamento global de erros
* Repositories → acesso aos dados
* scheduler → centraliza a exclusão do cache da aplicação
* Security → autenticação e autorização JWT
* Services → regras de negócio
* Utils  → utilitários de suporte

---

## Frontend

O frontend foi orientado à features e organizado buscando componentização e escalabilidade:

```bash
app/
assets/
components/
features/
services/
styles/
```

---

## Segurança

A autenticação da aplicação é baseada em **JWT (JSON Web Token)** utilizando Spring Security.

### Recursos implementados

* autenticação stateless
* validação de token
* proteção de rotas privadas
* autorização de requisições
* integração segura entre frontend e backend


---
## Observabilidade

O backend conta com logging estruturado implementado via SLF4J + Logback, com comportamento diferenciado por ambiente através de `logback-spring.xml` e Spring Profiles.

### Comportamento por ambiente

| Ambiente | Formato | Ativação |
|---|---|---|
| Local (`default`) | Texto legível com timestamp e nível colorido | Padrão ao rodar sem profile ativo |
| Produção (`prod`) | JSON estruturado via `LogstashEncoder` | `SPRING_PROFILES_ACTIVE=prod` no Render |

O formato JSON em produção permite que os logs sejam consumidos por ferramentas externas de observabilidade (Grafana Loki, Better Stack, Datadog) sem necessidade de parsing manual.

### Rastreamento de requisições

Um `RequestLoggingFilter` intercepta automaticamente todas as requisições HTTP, registrando método, URI, status e tempo de resposta:

```
INFO  método=POST uri=/auth/login status=200 duração_ms=102
INFO  método=GET  uri=/cursos/maisVendidos status=200 duração_ms=35
```

### Como os logs revelaram um problema de N+1

Durante o desenvolvimento, ao observar os logs de requisição na home page, foi identificado um padrão de múltiplas chamadas ao endpoint `/avaliacoes/curso/id-curso/{id}` — uma requisição separada por curso exibido no carrossel, totalizando 16+ chamadas HTTP para carregar uma única página.

#### Antes da correção
```
INFO  método=GET uri=/cursos/maisVendidos status=200 duração_ms=454
INFO  método=GET uri=/avaliacoes/curso/id-curso/1  status=200 duração_ms=83
INFO  método=GET uri=/avaliacoes/curso/id-curso/2  status=200 duração_ms=85
INFO  método=GET uri=/avaliacoes/curso/id-curso/3  status=200 duração_ms=84
... (13 requisições adicionais)
```

#### Após a correção
```
INFO  método=GET uri=/cursos/maisVendidos status=200 duração_ms=35
```

A causa era o componente `CardCursos` disparando um `useEffect` individual por curso para buscar avaliações do MongoDB. A correção consolidou a busca no backend: o endpoint `/cursos/maisVendidos` passou a retornar média e quantidade de avaliações embutidas no payload, usando uma query `$in` no MongoDB para buscar todas as avaliações em uma única chamada e agregação em memória com `Collectors.teeing` para calcular média e contagem por curso simultaneamente.

---

## Como executar o projeto localmente

### Clone o repositório

```bash
git clone https://github.com/GustavoOlSantos/skill-up.git
```

---

### Executando com Docker Compose (recomendado)

O projeto pode ser executado por completo — frontend, backend, MySQL e MongoDB — com um único comando, sem necessidade de instalar Java, Node, MySQL ou MongoDB localmente. Basta ter Docker e Docker Compose instalados.

Na raiz do projeto:

```bash
docker compose up --build
```

Esse comando constrói as imagens do frontend e do backend e sobe os seguintes serviços:

| Serviço | Container | Porta local | Descrição |
|---|---|---|---|
| Frontend | skillUp-frontend | `3000` | Aplicação React |
| Backend | skillUp-backend | `8080` | API Spring Boot |
| MySQL | skillUp-mysql | `3307` (interno `3306`) | Dados de usuários, cursos e compras |
| MongoDB | skillUp-mongo | `27018` (interno `27017`) | Avaliações e comentários |

O backend aguarda o MySQL reportar-se saudável (via `healthcheck`) antes de subir, evitando falhas de conexão durante a inicialização.

#### Acessando a aplicação

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend (API): [http://localhost:8080](http://localhost:8080)
- Documentação da API (Swagger): [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

#### Populando o banco com dados de teste (seed)

Com os containers no ar e o profile `dev` ativo (`SPRING_PROFILES_ACTIVE=dev` já configurado no `docker-compose.yml`), o MySQL pode ser populado com dados de teste através do endpoint:

```
GET http://localhost:8080/dev/seed
```

Esse endpoint só existe quando o profile `dev` está ativo e não fica disponível em produção.

#### Encerrando os containers

```bash
docker compose down
```

Para remover também os volumes, apagando os dados persistidos do MySQL e MongoDB:

```bash
docker compose down -v
```

---

### Executando manualmente (sem Docker)

Alternativamente, é possível rodar cada serviço manualmente, desde que os pré-requisitos listados abaixo estejam instalados:

* Node.js
* Java 21+
* MySQL
* MongoDB
* Maven (opcional, o projeto utiliza Maven Wrapper)

#### Executando o backend

```bash
  npm run dev:backend 
```

---

### Executando o frontend

```bash
cd frontend
npm install
npm start
```

ou, após instalar os pacotes npm:
```bash
  cd ../
  npm run dev:frontend 
```

---

### Executando frontend e backend juntos

Na raiz do projeto:

```bash
npm install
npm run dev
```

---

## Objetivos do projeto

- Aplicar conceitos modernos de desenvolvimento full stack
- Estruturar uma aplicação escalável utilizando React e Spring Boot
- Implementar autenticação e autorização com JWT
- Desenvolver uma API REST segura e organizada em camadas
- Explorar persistência híbrida com MySQL e MongoDB
- Evoluir arquitetura, componentização, integração frontend/backend
- Explorar e aplicar conceitos de infraestrutura e qualidade
  
---

## Roadmap

* As próximas melhorias podem ser vistas no [Quadro de Tarefas](https://github.com/users/GustavoOlSantos/projects/2).

---

## Status do projeto

🚧 Projeto em desenvolvimento ativo.

Novas funcionalidades, melhorias estruturais e otimizações estão sendo adicionadas continuamente.

---

## Autor

Desenvolvido individualmente por mim como projeto pessoal para estudo, prática e evolução contínua em desenvolvimento full stack.