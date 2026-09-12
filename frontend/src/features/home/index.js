import {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../app/providers/user-context';
import BannerCards from './banner-cards';
import CardCursos from '../../components/card-cursos';
import FeatureCard from '../../components/feature-card'
import api from '../../services/api';
import "../../styles/cards-cursos.css";

import { getCloudImageUrl } from '../../services/cloud_images';
import sectionImg from "../../assets/section.jpg"
import defaultIcon from "../../assets/default-icon.jpg";

function Home(){

    //const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cursos, setCursos] = useState([]);
    const { user } = useContext(UserContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        api.get("/cursos/maisVendidos")
        .then(res => {
            setCursos(res.data);
        })
        .catch(err => {
            console.error("Erro ao carregar cursos em alta:", err);
        });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setCurrentIndex(0);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const visibleCards = isMobile ? 1 : 4;
    const step = isMobile ? 1 : 3;
    const cardWidthPercent = isMobile ? 10 : 13;
    const maxIndex = Math.max(0, cursos.length - visibleCards);

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + step > maxIndex ? 0 : prev + step
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev - step < 0 ? maxIndex : prev - step
        );
    };

    return(
        <main className="home-page">
            <header className='colored-banner'>
                <BannerCards />
            </header>

            {user && (
                <section className="welcome-section">
                    <img className="welcome-avatar" src={user.userImagePath ? getCloudImageUrl(user.userImagePath) : defaultIcon}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultIcon; }}
                        alt={user.nome}   
                    />
                    <div className="welcome-text">
                        <h2>Bem-vindo(a) de volta, {user.nome.split(" ")[0]}!</h2>
                        <p><Link to="/meus-cursos" className='link'>Veja os seus cursos em andamento </Link> e continue de onde parou!</p>
                    </div>
                </section>
            )}

            <section className="em-alta">
                <h2>Nossos cursos mais vendidos</h2>
                <div className="carousel cursos-em-alta">
                    <button onClick={prevSlide} className="btn-prev cursos">‹</button>
                    
                    <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * cardWidthPercent}%)` }}>
                        {cursos?.map(curso => (
                            <CardCursos key={curso.id} curso={curso} maisVendidos={true} />
                        ))}
                    </div>
                    
                    <button onClick={nextSlide} className="btn-next cursos">›</button>
                </div>
            </section>

            <section className="evolucao double-container">
                <figure>
                    <img src={sectionImg} alt="Evolua sua carreira" />
                </figure>

                <article>
                    <h1 className='bigger'> <span>Evolua</span> na <span>sua carreira</span> com habilidades que o mercado realmente exige</h1>
                    <p className='dimmed'>Na SkillUp, você aprende com cursos práticos, atualizados e direto ao ponto — focados em desenvolvimento, tecnologia e tudo que impulsiona seu crescimento profissional.</p>
                    <p className='dimmed'>Sem mensalidade, sem pressão: você adquire o curso uma vez e tem acesso vitalício para aprender no seu ritmo, revisitar conteúdos e evoluir sempre que quiser.</p>
                    <p className='dimmed'>Invista no seu futuro. Comece hoje com a SkillUp.</p>
                </article>
            </section>

            <section className="features-section">
                <FeatureCard icon="📚" title="ACESSO A TODOS OS CURSOS" text=" Cursos completos e novos conteúdos toda semana para você evoluir
                        constantemente na sua carreira." />
                <FeatureCard icon="⚓" title="A MELHOR DIDÁTICA" text="Projetos práticos e desafios reais conectados ao mercado,
                        com ensino direto ao ponto." />
                <FeatureCard icon="🏆" title="CERTIFICADOS RECONHECIDOS" text="Conclua cursos e comprove suas habilidades com certificados
                        valorizados pelo mercado." />
            </section>
        </main>
    )
}
export default Home;