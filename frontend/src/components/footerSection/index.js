import { Link, useNavigate } from "react-router-dom";

import SocialBtn from "../social-media-btns";
import FooterCategorias from "./footer-categories";

function Footer(){

    const year = new Date().getFullYear();
    const navigate = useNavigate();

    return(
        <footer className="main">
            <section className="footer-dark">
                
                <div className="social">
                
                <figure>
                    <img 
                    src="/Icon.png"  
                    alt="Logo Skill Up" 
                    className="logo" 
                    onClick={() => navigate("/")}
                    />
                    <img 
                    src="/Title.png" 
                    alt="Skill Up" 
                    className="logo logo-white" 
                    onClick={() => navigate("/")}
                    />
                </figure>

                <nav className="social-icons" aria-label="Redes sociais">
                        <SocialBtn icon="fa-brands fa-youtube" href="#" tooltip="youtube" alt="Botão para acessar o YouTube"/>
                        <SocialBtn icon="fa-brands fa-facebook" href="#" tooltip="facebook" alt="Botão para acessar o Facebook"/>
                        <SocialBtn icon="fa-brands fa-instagram" href="#" tooltip="instagram" alt="Botão para acessar o Instagram"/>
                        <SocialBtn icon="fa-brands fa-twitter" href="#" tooltip="twitter" alt="Botão para acessar o Twitter"/>
                        <SocialBtn icon="fa-brands fa-tiktok" href="#" tooltip="TikTok" alt="Botão para acessar o TikTok"/>
                </nav>

                </div>

                <hr />

                <h3>Categorias mais procuradas:</h3>

                <FooterCategorias />

            </section>


            <section className="footer-darker">
                
                <section className="infos">
                
                    <nav aria-labelledby="sobre-heading">
                        <h3 id="sobre-heading">Sobre</h3>
                        <ul className="unstyled-list">
                            <li><Link to="/quem-somos">Quem somos</Link></li>
                            <li><Link to="/politica-de-privacidade">Política de privacidade</Link></li>
                            <li><Link to="/termos-de-uso">Termos de uso</Link></li>
                        </ul>
                    </nav>

                    <nav aria-labelledby="contato-heading">
                        <h3 id="contato-heading">Fale Conosco</h3>
                        <ul className="unstyled-list">
                            <li><Link to="/contato">Email e Telefone</Link></li>
                            <li><Link to="/perguntas-frequentes">Perguntas frequentes</Link></li>
                            <li><Link to="/ajuda-e-suporte">Ajuda e Suporte</Link></li>
                        </ul>
                    </nav>

                </section>

                <hr />

                <section className="footer-end">
                    <div>
                        <img src="/Icon.png"  alt="Logo Skill Up" className="logo" onClick={() => navigate("/")}/> 
                        <h4>© {year} Skill Up</h4>
                    </div>
                </section>

            </section>

        </footer>
    )
}

export default Footer;