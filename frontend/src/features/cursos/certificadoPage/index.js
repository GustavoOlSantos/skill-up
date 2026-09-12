import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../not-found/style.css";


function Certificado() {
    const navigate = useNavigate();
    
    return(
        <div className="notfound-container">
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>

            <div className="notfound-content">
                <h1 className="notfound-logo">🥳</h1>

                <h2>Parabéns por concluir o curso!</h2>

                <p>
                    Sinta-se livre para voltar e revisar o conteúdo sempre que quiser. Esperamos que o conhecimento adquirido seja útil para 
                    você em sua jornada de aprendizado contínuo.
                </p>

                <div className="notfound-actions">
                <Link to="/" className="home-button">
                    Ir para Home
                </Link>

                <button className="back-button" onClick={()=> navigate(-1)}>
                    Voltar
                </button>
                </div>
            </div>
        </div>
    )
}

export default Certificado;