import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";

import { UserContext } from "../../../app/providers/user-context";

import api from "../../../services/api";
import cartService from "../../../services/cart";
//import favoriteService from "../../../services/favorite";
import { getCloudImageUrl } from "../../../services/cloud_images";

import Modal from "../../../components/modal";
import ButtonText from "../../../components/buttonText";
import ButtonIcon from "../../../components/buttonIcon";
import Tags from "../../../components/tags-cursos";
import AvaliacoesCard from "../../../components/card-avaliacoes";
import Loading from "../../../components/loading";
import NotFound from "../../../features/not-found/";

import "../../../styles/cards-avaliacao.css";

function CursoPage() {

  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [curso, setCurso] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nota, setNota] = useState(0);
  const [avaliacoesNum, setAvaliacoesNum] = useState(0);

  const [jaComprou, setJaComprou] = useState(null);

  const [noCarrinho, setNoCarrinho] = useState(false);
  const [carrinhoLoading, setCarrinhoLoading] = useState(false);

  const [favorito, setFavorito] = useState(false);
  const [favoritoLoading, setFavoritoLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [compraReturn, setCompraReturn] = useState("");
  const [compraReturnClass, setCompraReturnClass] = useState("");

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []);

  useEffect(() => {

    setLoading(true);
    setNotFound(false);

    api.get(`cursos/slug/${slug}`).then(res => {

        if (!res.data || res.data.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setCurso(res.data[0]);

      })
      
      .catch(err => {
        console.error("Falha ao obter curso: ", err);
        setLoading(false);
        setNotFound(true);
      });

  }, [slug]);

  useEffect(() => {
    if (!curso) return;

    if (user != null) {

      api.get(`compras/${curso.id}`).then(res => {
          setJaComprou(res.data);
        })
        
        .catch(err => {
          console.error("Não foi possível verificar se o usuário já comprou este curso",err);
        });

      cartService.existe(curso.id).then(existe => {
        setNoCarrinho(existe);
      })

      .catch(err => {
        console.error( "Não foi possível verificar se o curso está no carrinho", err);
          setNoCarrinho(false);
        });

    } 
    
    else {
      setNoCarrinho(false);
      setJaComprou(null);
    }

    api.get(`avaliacoes/curso/id-curso/${curso.id}`).then(res => {
      setAvaliacoes(res.data);
      setLoading(false);
    })

    .catch(err => {
      console.error("Falha ao obter avaliações do curso: ", err);
      setLoading(false);
    });
  }, [curso, user]);

  useEffect(() => {
    if (!avaliacoes || avaliacoes.length === 0) {
      setAvaliacoesNum(0);
      setNota(0);

      return;
    }

    const total = avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);

    setAvaliacoesNum(avaliacoes.length);

    setNota((total / avaliacoes.length).toFixed(1));
  }, [avaliacoes]);

  useEffect(() => {
    if (jaComprou) {
      navigate(`/ver-curso/${slug}`);
    }
  }, [jaComprou, navigate, slug]);


  function alternarCarrinho() {

    if (user == null || curso == null || carrinhoLoading) {
      return;
    }

    setCarrinhoLoading(true);

    if (noCarrinho) {

      cartService.remover(curso.id).then(() => {
        setNoCarrinho(false);
      })

      .catch(err => {
        console.error("Falha ao remover curso do carrinho:", err);
      })
      .finally(() => {
        setCarrinhoLoading(false);
      });

      return;
    }

    cartService.adicionar(curso.id).then(() => {
      setNoCarrinho(true);
    })
    
    .catch(err => {
      console.error("Falha ao adicionar curso ao carrinho:", err);
    })
    .finally(() => {
      setCarrinhoLoading(false);
    });
  }

  function ConfirmarCompra() {

    if (jaComprou || user == null || curso == null) {
      return;
    }

    api.post(`compras/${curso.id}`).then(res => {

      if (res.status === 200) {
        setNoCarrinho(false);
        setCompraReturn("Compra efetuada com sucesso!");
        setCompraReturnClass("success");

        setTimeout(() => {
          navigate(`/ver-curso/${slug}`);
        }, 2000);
      }
      })
      .catch(err => {
        setCompraReturn("Falha ao comprar curso!");
        setCompraReturnClass("error");

        console.error("Falha ao comprar o curso: ", err);
      });
  }

  const visibleCards = 3;
  const step = 1;
  const maxIndex = Math.max( 0, avaliacoes.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + step > maxIndex ? 0 : prev + step);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - step < 0 ? maxIndex : prev - step);
  };

  if (loading) {
    return <Loading texto="curso" />;
  }

  if (notFound || !curso) {
    return <NotFound />;
  }

  const sidebarContent = (
    <aside className="curso-sidebar">
      <div className="curso-card-compra">
        <div className="curso-card-info">

          <span className="curso-card-label">Adquira este curso</span>
          <h1 className="curso-preco">R$ {curso.preco.toLocaleString()}</h1>

          <div className="curso-beneficio">

            <span className="beneficio-row">
              <i className="fa-solid fa-chalkboard"></i>
              <span>{curso.numeroAulas} aulas</span>
            </span>

            <span className="beneficio-row">
              <i className="fa-solid fa-film"></i>
              <span>
                {curso.duracao} horas de vídeo
              </span>
            </span>

            <span className="beneficio-row">
              <i className="fa-solid fa-infinity"></i>
              <span>Acesso vitalício</span>
            </span>

            <span className="beneficio-row">
              <i className="fa-solid fa-certificate"></i>
              <span> Certificado de conclusão </span>
            </span>

            <span className="beneficio-row">
              <i className="fa-regular fa-clock"></i>
              <span>Cancelamento gratuito em até 7 dias</span>
            </span>
          </div>
        </div>


        <div className="curso-actions">
          <ButtonText className="btn full full-sized" text="Comprar agora" 
            onClick={user == null ? () => navigate("/entrar") : () => setModalAberto(true) }
          />

          <ButtonText disabled={carrinhoLoading} className={`btn regular full-sized ${ carrinhoLoading ? "disabled" : "" }`}
            text = { carrinhoLoading ? "Aguarde..." : noCarrinho ? "Remover do carrinho" : "Adicionar ao carrinho" }
            onClick={user == null ? () => navigate("/entrar"): alternarCarrinho }
          />
        </div>
      </div>

      <hr style={{ marginBottom: 15 }} />

      <div className="outras-actions">
        <div className="action-row">
          <i className="fa-solid fa-share-nodes"></i>
          <span>Compartilhe este curso</span>
        </div>
      </div>
    </aside>
  );
  return (
    <>
      <main className="curso-page">
        <section>
          <section className="curso-hero">
            <figure className="curso-banner image">
              <img src={getCloudImageUrl(curso.imagemUrl)} alt={curso.nome} />
            </figure>

            <div className="curso-hero-content">
              <span>

                <h1>{curso.nome}</h1>
                <p className="curso-subtitulo">{curso.subtitulo}</p>
                <div className="curso-tags">

                  <Tags icone="fa-solid fa-award" texto={curso.nivel}
                    className={curso.nivel.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase().replace(/[^a-z0-9 ]/g, "").replaceAll(" ", "-")
                    }
                  />

                  {curso.subcategorias.map(
                    categoria => (
                      <Tags
                        key={categoria.id}
                        texto={categoria.nome}
                      />
                    )
                  )}
                </div>

                <div className="curso-atualizacao">
                  <i className="fa-solid fa-chalkboard-user"></i>
                  <span> Instruído por{" "} <u>{curso.instrutor}</u></span>
                </div>

                <div className="curso-atualizacao">
                  <i className="fa-solid fa-user"></i>

                  <span> Se junte a{" "} {curso.alunosMatriculados} alunos </span>
                </div>
              </span>

              <div className="curso-atualizacao">
                <i className="fa-regular fa-calendar-days"></i>

                <span>
                  Última atualização em{" "}

                  {new Date(curso.ultimaAtualizacao).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </section>
          
          <section className="curso-avaliacoes">

            <h2>
              Avaliação do curso:{" "}

              <i className="fa-solid fa-star star"></i>

              <span className="h2-slim">
                {" "}
                {nota} | {avaliacoesNum} Avaliações
              </span>
            </h2>
          </section>

          <section>
            <div className="curso-info">

              <h2>Requisitos:</h2>
              
              <ul>
                {curso.requisitos.map(
                  (req, index) => (
                    <li key={index}>
                      {req}
                    </li>
                  )
                )}
              </ul>

              <h2>
                Descrição:
              </h2>

              <div className="curso-descricao">
                <ReactMarkdown>
                  {curso.descricao}
                </ReactMarkdown>
              </div>
            </div>

            <hr />

            <div className="curso-avaliacoes">
              <h2>Avaliações:</h2>

              <div className="carousel card-avaliacoes">

                <button onClick={prevSlide} className="btn-prev avaliacoes"> ‹ </button>

                <div className="carousel-track-avaliacoes"style={{ transform: `translateX(-${currentIndex * 300}px)`}}>

                  {avaliacoes.map(
                    avaliacao => (
                      <AvaliacoesCard key={avaliacao.id} avaliacao={avaliacao} />
                    )
                  )}
                </div>

                <button onClick={nextSlide} className="btn-next avaliacoes"> › </button>

              </div>
            </div>
          </section>
        </section>

        {!isMobile && sidebarContent}

        <Modal titulo="Deseja comprar este curso?" aberto={modalAberto} onFechar={() => setModalAberto(false)} >

          <section className="pagamentos">
            <ButtonIcon icon="fa-brands fa-pix"/>
            <ButtonIcon icon="fa-brands fa-cc-visa" />
            <ButtonIcon icon="fa-brands fa-cc-mastercard"/>
            <ButtonIcon icon="fa-brands fa-cc-paypal" />
          </section>

          <section className="pagamentos">
            <p className={compraReturnClass}> {compraReturn} </p>
          </section>

          <section className="pagamentos">

            <ButtonText text="Comprar" className="btn full" onClick={ConfirmarCompra} />
            <ButtonText text="Desistir" className="btn regular" onClick={() => setModalAberto(false)} />
          </section>
        </Modal>
      </main>

      {isMobile && ReactDOM.createPortal(sidebarContent, document.body) }
    </>
  );
}

export default CursoPage;