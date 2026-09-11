import React, { useEffect, useState } from "react";

import favoriteService from "../../../services/favorite";
import CardCursos from "../../../components/card-cursos";

import Loading from "../../../components/loading";

function Favoritos() {

    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const carregarFavoritos = async () => {

            try {
                const data = await favoriteService.listar();
                setCursos(data);
            } catch (error) {
                console.error("Erro ao carregar favoritos:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarFavoritos();

    }, []);

    if (loading) {
        return  <Loading texto="seus favoritos" /> ;
    }

    return (
        <main className="favoritos-page">

            <section className="favoritos-header">
                <div>
                    <h1>Meus favoritos</h1>
                    <p>Cursos que você salvou para ver depois.</p>
                </div>

                <span>
                    {cursos.length} cursos
                </span>
            </section>


            {cursos.length > 0 ? (
                <section className="cursos-grid">
                    {cursos.map(curso => (
                        <CardCursos key={curso.id} curso={curso} />
                    ))}
                </section>
            ) : (
                <section className="favoritos-vazio">
                    <i className="fa-regular fa-heart"></i>
                    <h2>Você ainda não possui favoritos</h2>
                    <p> Salve cursos que você deseja fazer posteriormente.</p>
                </section>
            )}
        </main>
    );
}

export default Favoritos;