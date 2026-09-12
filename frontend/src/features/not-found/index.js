import { Link, useNavigate } from "react-router-dom";
import "./style.css";

function NotFound(){
    const navigate = useNavigate();
    return(
        <div className="notfound-container">
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>

            <div className="notfound-content">
                <h1 className="notfound-logo">404</h1>

                <h2>Oops... página não encontrada</h2>

                <p>
                Parece que você entrou em uma rota perdida
                no espaço digital.
                </p>

                <div className="notfound-actions">
                <Link to="/" className="home-button">
                    Ir para Home
                </Link>

                <button className="back-button" onClick={()=> navigate(-2)}>
                    Voltar
                </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound;