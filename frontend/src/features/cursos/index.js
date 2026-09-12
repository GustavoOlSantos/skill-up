import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";
import CardCursos from "../../components/card-cursos";

import Loading from "../../components/loading/";

import "../../styles/explorar-cursos.css";

function ExplorarCursos() {

    const { slug } = useParams();

    const [cursos, setCursos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState(null);

    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

    useEffect(() => {

        const carregarCursos = async () => {
            try {
                const response = await api.get("/cursos");
                setCursos(response.data);
            } catch (error) {
                console.error("Erro ao carregar cursos:", error);
                setErro(true);
            }
        };

        const carregarCategorias = async () => {
            try {
                const response = await api.get("/categorias");
                setCategorias(response.data);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
                setErro(true);
            }
        };

        const carregarDados = async () => {
            setLoading(true);

            await Promise.all([
                carregarCursos(),
                carregarCategorias()
            ]);

            setLoading(false);
        };

        carregarDados();

    }, []);

    useEffect(() => {
        if (categorias.length > 0 && slug) {
            let catEncontrada = null;
            let subEncontrada = null;

            for (const categoria of categorias) {
                const subcategoria = categoria.subcategorias?.find(
                    (sub) => sub.slug === slug
                );
                
                if (subcategoria) {
                    catEncontrada = categoria;
                    subEncontrada = subcategoria;
                    break;
                }
            }

            if (catEncontrada && subEncontrada) {
                setCategoriaSelecionada(catEncontrada);
                setSubcategoriaSelecionada(subEncontrada);
            }
        } else if (!slug) {
            limparFiltros(); 
        }
    }, [categorias, slug]);

    const getSubcategoriasCurso = (curso) => {
        return curso.subcategorias || curso.subCategorias || [];
    };

    const cursoPertenceCategoria = (curso, categoria) => {

        const subcategoriasCurso = getSubcategoriasCurso(curso);

        if (!subcategoriasCurso.length) {
            return false;
        }

        const idsSubcategoriasCategoria =
            categoria.subcategorias?.map(subcategoria => subcategoria.id) || [];

        return subcategoriasCurso.some(subcategoria => {

            const idSubcategoria =
                typeof subcategoria === "object"
                    ? subcategoria.id
                    : subcategoria;

            return idsSubcategoriasCategoria.includes(idSubcategoria);
        });
    };

    const cursoPertenceSubcategoria = (curso, subcategoria) => {

        const subcategoriasCurso = getSubcategoriasCurso(curso);

        return subcategoriasCurso.some(item => {

            const id =
                typeof item === "object"
                    ? item.id
                    : item;

            return id === subcategoria.id;
        });
    };

    const cursosFiltrados = useMemo(() => {

        if (!categoriaSelecionada && !subcategoriaSelecionada) {
            return cursos;
        }

        if (subcategoriaSelecionada) {
            return cursos.filter(curso =>
                cursoPertenceSubcategoria(
                    curso,
                    subcategoriaSelecionada
                )
            );
        }

        if (categoriaSelecionada) {
            return cursos.filter(curso =>
                cursoPertenceCategoria(
                    curso,
                    categoriaSelecionada
                )
            );
        }

        return cursos;

    }, [
        cursos,
        categoriaSelecionada,
        subcategoriaSelecionada,
        cursoPertenceCategoria,
        cursoPertenceSubcategoria
    ]);

    const selecionarCategoria = (categoria) => {
        setSubcategoriaSelecionada(null);

        if (categoriaSelecionada?.slug === categoria.slug) {
            setCategoriaSelecionada(null);
            return;
        }

        setCategoriaSelecionada(categoria);
    };

    const selecionarSubcategoria = (subcategoria, categoria) => {

        if (subcategoriaSelecionada?.id === subcategoria.id) {
            setSubcategoriaSelecionada(null);
            setCategoriaSelecionada(null);
            return;
        }

        setCategoriaSelecionada(categoria);
        setSubcategoriaSelecionada(subcategoria);
    };

    const limparFiltros = () => {
        setCategoriaSelecionada(null);
        setSubcategoriaSelecionada(null);
    };

    const cursosPorCategoria = useMemo(() => {

        return categorias.map(categoria => {

            const cursosCategoria = cursos.filter(curso =>
                cursoPertenceCategoria(curso, categoria)
            );

            return {
                ...categoria,
                cursos: cursosCategoria
            };

        });

    }, [categorias, cursos, cursoPertenceCategoria]);

    if (loading) {
        return <Loading texto="cursos"/>;
    }

    if (erro) {
        return (
            <main className="explorar-cursos-page">
                <section className="explorar-error">
                    <i className="fa-solid fa-circle-exclamation"></i>

                    <h2>
                        Não foi possível carregar os cursos
                    </h2>

                    <p>
                        Tente novamente mais tarde.
                    </p>
                </section>
            </main>
        );
    }

    return (
        <main className="explorar-cursos-page">

            <section className="explorar-header">

                <div>
                    <span className="explorar-label">
                        NOSSO CATÁLOGO
                    </span>

                    <h1>
                        Explore nossos cursos
                    </h1>

                    <p>
                        Encontre cursos práticos para desenvolver novas
                        habilidades e evoluir na sua carreira.
                    </p>
                </div>

                <div className="explorar-total">
                    <strong>{cursos.length}</strong>
                    <span>cursos disponíveis</span>
                </div>

            </section>


            <section className="explorar-filtros">

                <button
                    className={
                        !categoriaSelecionada
                            ? "filtro-categoria active"
                            : "filtro-categoria"
                    }
                    onClick={limparFiltros}
                >
                    Todos os cursos
                </button>

                {categorias.map(categoria => (

                    <button
                        key={categoria.slug}
                        className={
                            categoriaSelecionada?.slug === categoria.slug &&
                            !subcategoriaSelecionada
                                ? "filtro-categoria active"
                                : "filtro-categoria"
                        }
                        onClick={() => selecionarCategoria(categoria)}
                    >
                        {categoria.nome}
                    </button>

                ))}

            </section>


            <section className="explorar-subcategorias">

                {categorias.map(categoria => (

                    <div
                        key={categoria.slug}
                        className="subcategorias-grupo"
                    >

                        <span className="subcategorias-titulo">
                            {categoria.nome}:
                        </span>

                        {categoria.subcategorias?.map(subcategoria => (

                            <button
                                key={subcategoria.id}
                                className={
                                    subcategoriaSelecionada?.slug === subcategoria.slug
                                        ? "filtro-subcategoria active"
                                        : "filtro-subcategoria"
                                }
                                onClick={() =>
                                    selecionarSubcategoria(
                                        subcategoria,
                                        categoria
                                    )
                                }
                            >
                                {subcategoria.nome}
                            </button>

                        ))}

                    </div>

                ))}

            </section>


            {(categoriaSelecionada || subcategoriaSelecionada) && (

                <section className="resultado-filtro">

                    <div>
                        <span>Explorando</span>

                        <h2>
                            {subcategoriaSelecionada
                                ? subcategoriaSelecionada.nome
                                : categoriaSelecionada.nome
                            }
                        </h2>
                    </div>

                    <button onClick={limparFiltros}>
                        Limpar filtros
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                </section>

            )}


            {!categoriaSelecionada && !subcategoriaSelecionada ? (

                <section className="catalogo-cursos">

                    <div className="catalogo-titulo">
                        <div>
                            <h2>Todos os cursos</h2>
                            <p>
                                Explore tudo o que a SkillUp tem para oferecer.
                            </p>
                        </div>

                        <span>
                            {cursos.length} cursos
                        </span>
                    </div>

                    <div className="cursos-grid">

                        {cursos.map(curso => (
                            <CardCursos
                                key={curso.id}
                                curso={curso}
                            />
                        ))}

                    </div>

                </section>

            ) : (

                <section className="catalogo-cursos">

                    <div className="catalogo-titulo">
                        <div>
                            <h2>
                                {subcategoriaSelecionada
                                    ? subcategoriaSelecionada.nome
                                    : categoriaSelecionada.nome
                                }
                            </h2>

                            <p>
                                Cursos disponíveis nesta área.
                            </p>
                        </div>

                        <span>
                            {cursosFiltrados.length} cursos
                        </span>
                    </div>


                    {cursosFiltrados.length > 0 ? (

                        <div className="cursos-grid">

                            {cursosFiltrados.map(curso => (
                                <CardCursos
                                    key={curso.id}
                                    curso={curso}
                                />
                            ))}

                        </div>

                    ) : (

                        <div className="sem-cursos">

                            <i className="fa-solid fa-book-open"></i>

                            <h3>
                                Nenhum curso encontrado
                            </h3>

                            <p>
                                Ainda não existem cursos disponíveis
                                nesta categoria.
                            </p>

                        </div>

                    )}

                </section>

            )}

            {!categoriaSelecionada && !subcategoriaSelecionada && (

                <section className="categorias-catalogo">

                    <header>
                        <h2>
                            Explore por categoria
                        </h2>

                        <p>
                            Encontre conteúdos de acordo com a área
                            que você deseja aprender.
                        </p>
                    </header>


                    <div className="categorias-grid">

                        {cursosPorCategoria.map(categoria => (

                            <article
                                key={categoria.slug}
                                className="categoria-card"
                                onClick={() =>
                                    selecionarCategoria(categoria)
                                }
                            >

                                <div className="categoria-card-icon">
                                    <i className="fa-solid fa-layer-group"></i>
                                </div>

                                <div>

                                    <h3>
                                        {categoria.nome}
                                    </h3>

                                    <p>
                                        {categoria.cursos.length} cursos
                                    </p>

                                </div>

                                <i className="fa-solid fa-arrow-right"></i>

                            </article>

                        ))}

                    </div>

                </section>

            )}

        </main>
    );
}

export default ExplorarCursos;