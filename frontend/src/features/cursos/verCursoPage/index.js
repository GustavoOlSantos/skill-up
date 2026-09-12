import {useContext, useState, useEffect, useRef, useCallback} from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import { UserContext } from '../../../app/providers/user-context';

import Loading from "../../../components/loading";
import ButtonText from '../../../components/buttonText';
import ButtonIcon from '../../../components/buttonIcon';
import PlaylistModulo from './playlistModulo';

import api from '../../../services/api';

function extractVideoId(url) {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
}

// Flag fora do componente: sobrevive ao double-mount do StrictMode
let ytPlayerInitialized = false;

function VerCurso(){
    const { user } = useContext(UserContext);
    const { slug } = useParams();
    const navigate = useNavigate();
    const playerRef = useRef(null);
    const pendingVideoIdRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);
    const aulaAtualRef = useRef(null);
    const aulaAtualTimeStampRef = useRef(0);

    const [curso, setCurso] = useState(null);
    const [aulaAtual, setAulaAtual] = useState(null);  
    const [aulaAtualDados, setAulaAtualDados] = useState(null);
    //const [ultimaAula, setUltimaAula] = useState(null);
    const [aulaAtualTimeStamp, setAulaAtualTimeStamp] = useState(0);
    const [moduloAtual, setModuloAtual] = useState(null);
    const [menorAulaId, setMenorAulaId] = useState(null);
    const [aulasConcluidas, setAulasConcluidas] = useState([]);
    const [jaComprou, setJaComprou] = useState(null);
    const [nota, setNota] = useState(0);
    const [loading, setLoading] = useState(true);

    const tryGoToEnd = () => {
        const player = playerRef.current;
        player.playVideo();

        if (!player || typeof player.getDuration !== "function") {
            setTimeout(tryGoToEnd, 200);
            return;
        }

        const duration = player.getDuration();

        if (duration > 0) {
            player.seekTo(duration - 0.5, true);
        }
    };

    const onPlayerStateChange = useCallback((event) => {
        const player = playerRef.current;

        if (!player || typeof player.seekTo !== "function") return;

        if (event.data === window.YT.PlayerState.PLAYING) {
            if (aulaAtualTimeStampRef.current != null && !player.__seeked) {
                const duration = player.getDuration?.() || 0;

                if (duration > 0) {
                    player.__seeked = true;

                    requestAnimationFrame(() => {
                        player.seekTo(aulaAtualTimeStampRef.current, true);
                    });
                }
            }
        }

        if (event.data === window.YT.PlayerState.ENDED) {
            const currentId = aulaAtualRef.current;

            if (!curso || !currentId) return;

            const aulas = curso.modulos.flatMap(m => m.aulas);
            const indexAtual = aulas.findIndex(a => a.id === currentId);
            const nextAula = aulas[indexAtual + 1];

            api.post("/progresso/aula", {
                aulaId: currentId,
                ultimoSegundo: player.getCurrentTime(),
                concluida: true
            });

            if (!nextAula) return;

            const moduloDaProxima = curso.modulos.find(m =>
                m.aulas.some(a => a.id === nextAula.id)
            );

            if (moduloDaProxima) {
                setModuloAtual(moduloDaProxima.id);
            }

            setAulaAtual(nextAula.id);
            setAulaAtualDados(nextAula);
        }
    }, [curso]);

    /* function toggleDescription(){
        const el = document.querySelector(".curso-descricao-text");
        el.classList.toggle("collapsed");
    }*/
           

    useEffect(() => {
        if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
    }, []);

    useEffect(() => {
        if (loading) return;

        const initPlayer = () => {
            if (ytPlayerInitialized) return;
            ytPlayerInitialized = true;

            playerRef.current = new window.YT.Player("player", {
                events: {
                    onReady: () => {
                        setPlayerReady(true);
                    },
                    onStateChange: onPlayerStateChange
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            ytPlayerInitialized = false;
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [loading, onPlayerStateChange]);

    useEffect(() => {
        aulaAtualRef.current = aulaAtual;
    }, [aulaAtual]);

    useEffect(() => {
        aulaAtualTimeStampRef.current = aulaAtualTimeStamp;
    }, [aulaAtualTimeStamp]);

    useEffect(() => {
        if(user === undefined) return;

        if(user === null){
            navigate("/entrar");
        }
    }, [user, navigate]);

    useEffect(() => {
        api.get(`cursos/aulas/slug/${slug}`)
        .then(res =>{
        setCurso(res.data[0]);
        })
        .catch(err => {
        console.error("Falha ao obter curso: ", err);
        setLoading(false);
        // setNotFound(true);
        });
    }, [slug, navigate]);

    useEffect(() => {
        if (curso == null) return;
        if(user == null) return;

        api.get(`compras/${curso.id}`)
        .then(res => {
            setJaComprou(res.data);
        })
        .catch(err => {
            console.error("Não foi possível verificar se o usuário ja comprou este curso", err);
            navigate(-1);
            return;
        });

        curso.modulos.forEach(modulo => {
            if (modulo === null || modulo.ordem !== 1) return;
            setMenorAulaId(modulo.aulas[0].id);
        });
    }, [curso, navigate, user]);
   
    useEffect(() => {
        if(curso === null) return;
        if(jaComprou === null) return;
        if(menorAulaId === null) return;

        if(jaComprou !== true){
            navigate(-1);
            return;
        }

        api.get(`progresso/ultima-aula/${curso.id}`)
        .then(res => {
            if(res.data === ""){
                setAulaAtual(menorAulaId);
                const moduloDaAula = curso.modulos.find(m => m.aulas.some(a => a.id === menorAulaId));
                setModuloAtual(moduloDaAula.id);
                const aulaData = moduloDaAula.aulas.find(a => a.id === menorAulaId);
                setAulaAtualDados(aulaData);
            }
            else{
                //setUltimaAula(res.data);
                setAulaAtualTimeStamp(res.data.ultimoSegundo);
                setAulaAtual(res.data.aula.id);
                setModuloAtual(res.data.aula.moduloId);
                setAulaAtualDados(res.data.aula);
            }
            
        })
        .catch(err => {
            console.error("Não foi possível obter a última aula assistida", err);
            setAulaAtual(menorAulaId);
            const moduloDaAula = curso.modulos.find(m => m.aulas.some(a => a.id === menorAulaId));
            setModuloAtual(moduloDaAula.id);
            const aulaData = moduloDaAula.aulas.find(a => a.id === menorAulaId);
            setAulaAtualDados(aulaData);
        });

        api.get(`avaliacoes/curso/id-curso/${curso.id}`)
        .then(res =>{
            let avaliacoes = res.data;
            const total = avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);
            setNota((total / avaliacoes.length).toFixed(1));
        })
        .catch(err => {
            console.error("Falha ao obter avaliações do curso: ", err);
            setLoading(false);
        });
    }, [curso, jaComprou, navigate, user, menorAulaId]);


    useEffect(() => {
        if (!aulaAtual || !curso || !aulaAtualDados) return;

        const aula = curso.modulos
            .flatMap(m => m.aulas)
            .find(a => a.id === aulaAtual);

        if (!aula) return;

        const videoId = extractVideoId(aula.videoUrl);

        if (!playerReady) {
            pendingVideoIdRef.current = videoId;
            return;
        }

        setTimeout(() => {
            if (!playerRef.current) return;
            playerRef.current.cueVideoById(videoId);
            playerRef.current.playVideo();
        }, 100);
    }, [aulaAtual, aulaAtualDados, curso, playerReady, menorAulaId, navigate]);
    
    useEffect(() => {
        if (!aulaAtual) return;
        if(!curso) return;
        if(!aulaAtualDados) return;

        api.get(`progresso/aulas-concluidas/${curso.id}`)
        .then(res => {
            setAulasConcluidas(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Não foi possível obter o número de aulas concluidas", err);
        })
    }, [aulaAtual, aulaAtualDados, curso]);

    useEffect(() => {
        if (!playerReady) return;
        if (!pendingVideoIdRef.current) return;

        setTimeout(() => {
            if (!playerRef.current) return;
            playerRef.current.cueVideoById(pendingVideoIdRef.current);
            playerRef.current.playVideo();
            pendingVideoIdRef.current = null;
        }, 100);
    }, [playerReady, aulaAtualDados, curso]);

    useEffect(() => {
        if (!aulaAtual) return;

        const interval = setInterval(() => {
            api.post("/progresso/aula", {
                aulaId: aulaAtual,
                ultimoSegundo: playerRef.current.getCurrentTime()
            })
            .catch(err => {
                console.error("Não foi possível salvar o progresso da aula", err);
            });

        }, 10000);

        return () => clearInterval(interval);
    }, [aulaAtual]);
    
    if (loading === true) {
        return <Loading texto="Conteúdo do curso"/>;
    }

    return (
        <main className="assistir-curso-page">
            <section className="assistir-main-content">

                <div className="video-player-container">

                <div className="video-topbar">
                    <div>
                    <span className="curso-path">
                        {curso.nome} • Módulo {moduloAtual}
                    </span>

                    <h1>
                        {aulaAtualDados?.titulo}
                    </h1>
                    </div>

                    <ButtonIcon className="btn regular border" icon="fa-solid fa-bookmark" />
                </div>

                <div className="video-wrapper">
                    <div id="player"></div>
                </div>

                <div className="video-infos">

                    <div className="video-stats">
                        <span>
                            <i className="fa-solid fa-star star"></i>
                            {nota}
                        </span>

                        <span>
                            <i className="fa-solid fa-person"></i>
                            {curso.alunosMatriculados >= 1000
                            ? `${Math.floor(curso.alunosMatriculados / 1000)}k `
                            : curso.alunosMatriculados} 
                            alunos
                        </span>

                        <span>
                            <i className="fa-solid fa-clock"></i>
                            {parseFloat(curso.duracao).toFixed(1)}h de curso
                        </span>

                        <span>
                            <i className="fa-solid fa-web-awesome"></i>
                            {curso.nivel}
                        </span>
                    </div>

                    <div className="video-actions">

                        <ButtonIcon className="btn full with-text" onClick={tryGoToEnd}> <i className="fa-solid fa-check"></i>
                            Marcar como concluído
                        </ButtonIcon>

                        {/* <ButtonIcon className="btn regular border with-text"> <i className="fa-solid fa-download"></i>
                            Material complementar
                        </ButtonIcon> */}

                    </div>

                </div>

                <section className="video-descricao">

                    <h2>Sobre esta aula</h2>

                    <p>
                        {aulaAtualDados?.descricao}
                    </p>


                </section>

                <hr></hr>

                <section className="curso-descricao">

                    <h2>Sobre o curso</h2>
                    
                    <div className="curso-descricao-text">
                        <ReactMarkdown>
                            {curso.descricao}
                        </ReactMarkdown>
                    </div>

                </section>

                </div>

            </section>

            <aside className="assistir-sidebar">

                <div className="curso-progresso-card">

                    <div className="progresso-header">
                        <div>
                            <span className="progresso-label">
                                Seu progresso
                            </span>

                            <h2>{((aulasConcluidas.length / curso.numeroAulas) * 100).toFixed(0)}%</h2>
                        </div>

                        <i className="fa-solid fa-trophy"></i>
                    </div>

                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((aulasConcluidas.length / curso.numeroAulas) * 100).toFixed(0)}%` }} ></div>
                    </div>

                    {((aulasConcluidas.length / curso.numeroAulas) * 100).toFixed(0) === 100 ? (
                        <>
                            <div className="progresso-completo">
                                <i className="fa-solid fa-award"></i>
                                <span>Parabéns, curso completo!</span>
                            </div>
                            <div className="progresso-completo">
                                <ButtonText className="btn progress" onClick={() => navigate(`/cursos/${slug}/certificado`)} text="Ver certificado" />
                            </div>
                        </>
                    ) : null }

                </div>

                <div className="playlist-container">

                    <div className="playlist-header">

                        <h2>Conteúdo do curso</h2>

                        <span>{curso.numeroAulas} aulas</span>

                    </div>
                    
                    {curso.modulos.map((modulo) => (
                        <PlaylistModulo key={modulo.id} modulo={modulo} aulasConcluidas={aulasConcluidas} moduloAtual={moduloAtual} setModuloAtual={setModuloAtual} aulaAtual={aulaAtual} setAulaAtual={setAulaAtual} setAulaAtualDados={setAulaAtualDados} />
                    ))}

                </div>

            </aside>

        </main>
    );
    }

export default VerCurso;