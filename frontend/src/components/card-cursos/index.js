import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../app/providers/user-context";
import favoriteService from "../../services/favorite";
import cartService from "../../services/cart";
import { getCloudImageUrl } from "../../services/cloud_images";
import Tags from "../tags-cursos";

function CardCursos({ curso, maisVendidos, origin, aulasConcluidas }) {

    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [imgLoaded, setImgLoaded] = useState(false);

    const [favorito, setFavorito] = useState(false);
    const [noCarrinho, setNoCarrinho] = useState(false);

    const [loadingFavorito, setLoadingFavorito] = useState(false);
    const [loadingCarrinho, setLoadingCarrinho] = useState(false);

    useEffect(() => {

        if (!user || !curso?.id) {
            setFavorito(false);
            setNoCarrinho(false);
            return;
        }

        favoriteService.existe(curso.id)
            .then(existe => {
                setFavorito(existe);
            })
            .catch(err => {
                console.error(
                    "Erro ao verificar favorito:",
                    err
                );
            });

        cartService.existe(curso.id)
            .then(existe => {
                setNoCarrinho(existe);
            })
            .catch(err => {
                console.error(
                    "Erro ao verificar carrinho:",
                    err
                );
            });

    }, [user, curso?.id]);

    const toggleFavorito = async (e) => {

        e.stopPropagation();

        if (!user) {
            navigate("/entrar");
            return;
        }

        if (loadingFavorito) return;

        setLoadingFavorito(true);

        try {
            if (favorito) {
                await favoriteService.remover(curso.id);
                setFavorito(false);
            } 
            else {
                await favoriteService.adicionar(curso.id);
                setFavorito(true);
            }
        } 
        catch (err) {
            console.error("Erro ao alterar favorito:", err);
        } 
        finally {
            setLoadingFavorito(false);
        }
    };

    const toggleCarrinho = async (e) => {

        e.stopPropagation();

        if (!user) {
            navigate("/entrar");
            return;
        }

        if (loadingCarrinho) return;

        setLoadingCarrinho(true);

        try {
            if (noCarrinho) {
                await cartService.remover(curso.id);
                setNoCarrinho(false);
            } 
            else {
                await cartService.adicionar(curso.id);
                setNoCarrinho(true);
            }

        } catch (err) {
            console.error( "Erro ao alterar carrinho:", err);
        } 
        finally {
            setLoadingCarrinho(false);
        }
    };

    const abrirCurso = () => {
        navigate(`/cursos/${curso.slug}`);
    };

    return (

        <article className="card-curso" onClick={abrirCurso} >

            <section className={`card-image ${imgLoaded ? "loaded" : ""}`}>
                <img src={getCloudImageUrl(curso.imagemUrl)} alt={curso.nome} onLoad={() => setImgLoaded(true)} loading="lazy" />
            </section>

            <section className="card-curso-actions">
                <button type="button" className={`card-action favorito ${ favorito ? "active" : "" }`} onClick={toggleFavorito} disabled={loadingFavorito}
                    title={ favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                    <i className={ favorito ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                </button>

                <button type="button" className={`card-action carrinho ${ noCarrinho ? "active" : "" }`}onClick={toggleCarrinho} disabled={loadingCarrinho}
                    title={ noCarrinho ? "Remover do carrinho" : "Adicionar ao carrinho" } >
                    <i className={ noCarrinho ? "fa-solid fa-cart-shopping" : "fa-solid fa-cart-plus" }></i>
                </button>
            </section>

            <section>
                <h2>{curso.nome}</h2>
                <section className="curso-infos"> {curso.instrutor} | {curso.alunosMatriculados} alunos | {curso.nivel}</section>
            </section>

            <section className="curso-avaliacao">  
                {maisVendidos && <Tags className="mais-vendidos" texto="Mais vendidos" />}
                <Tags icone="fa-solid fa-star star" dado={curso.mediaAvaliacao}/>
                <Tags dado={curso.quantidadeAvaliacoes} texto="Avaliações"/>
            </section>

            {origin === null || origin === undefined ?
                <section className="curso-preco">
                    <h2>R$ {curso.preco.toLocaleString()}</h2>
                </section>
            : 
                <section className="curso-progress">
                    <i className="fa-solid fa-trophy"></i>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((aulasConcluidas / curso.numeroAulas) * 100).toFixed(0)}%` }} ></div>
                    </div>
                    <p>{((aulasConcluidas / curso.numeroAulas) * 100).toFixed(0)}%</p>
                </section>
            }
        </article>
    );
}

export default CardCursos;