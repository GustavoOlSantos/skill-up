import React, { useEffect, useState } from "react";

import cartService from "../../../services/cart";
import { getCloudImageUrl } from "../../../services/cloud_images";

import Tags from "../../../components/tags-cursos";
import Loading from "../../../components/loading";

function Carrinho() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarCarrinho();
    }, []);

    const carregarCarrinho = async () => {
        try {
            const data = await cartService.listar();
            setCursos(data);
        } catch (error) {
            console.error("Erro ao carregar carrinho:", error);
        } finally {
            setLoading(false);
        }
    };

    const removerCurso = async (cursoId) => {
        try {
            await cartService.remover(cursoId);
            setCursos(prev => prev.filter(curso => curso.id !== cursoId));
        } catch (error) {
            console.error("Erro ao remover curso:", error);
        }
    };

    const limparCarrinho = async () => {
        try {
            await cartService.limpar();
            setCursos([]);
        } catch (error) {
            console.error("Erro ao limpar carrinho:", error);
        }
    };

    const total = cursos.reduce((soma, curso) => soma + curso.preco, 0);

    if (loading) {
        return <Loading texto="seu carrinho"/>;
    }

    return (
        <main className="carrinho-page">
            <section className="carrinho-header">
                <div>
                    <h1>Meu carrinho</h1>
                    <p>{cursos.length} curso(s) no carrinho</p>
                </div>

                {cursos.length > 0 && (
                    <div>
                         <button className="btn textOnly rmv" onClick={limparCarrinho}>
                            Limpar carrinho
                        </button>
                    </div>
                )}
            </section>

            {cursos.length === 0 ? (
                <section className="carrinho-vazio">
                    <i className="fa-solid fa-cart-shopping"></i>
                    <h2>Seu carrinho está vazio</h2>
                    <p>Explore nossos cursos e encontre algo para aprender.</p>
                </section>
            ) : (
                <section className="carrinho-content">
                    <section className="carrinho-items">
                        {cursos.map(curso => (
                            <article className="carrinho-item" key={curso.id}>
                                <img
                                    src={getCloudImageUrl(curso.imagemUrl)}
                                    alt={curso.nome}
                                />

                                <div className="carrinho-item-info">
                                    <h2>{curso.nome}</h2>
                                    <p>{curso.instrutor}</p>
                                    
                                    <Tags icone="fa-solid fa-star star" dado={curso.mediaAvaliacao} />
                                </div>

                                <div className="carrinho-item-price">
                                    <strong>
                                        R$ {curso.preco.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2
                                        })}
                                    </strong>

                                    <button className="btn textOnly" onClick={() => removerCurso(curso.id)} >
                                        X Remover
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>

                    <aside className="carrinho-resumo">
                        <h2>Resumo</h2>

                        <div>
                            <span>{cursos.length} curso(s) </span>

                            <strong>
                                R$ {total.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2
                                })}
                            </strong>
                        </div>

                        <button className="btn full full-sized">Comprar</button>
                    </aside>
                </section>
            )}
        </main>
    );
}

export default Carrinho;
