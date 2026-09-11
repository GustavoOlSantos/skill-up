import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import SearchBar from "../searchBar";
import ButtonIcon from "../buttonIcon";
import ButtonText from "../buttonText";
import {Dropdown} from "../dropdown";

import { UserContext } from "../../app/providers/user-context";
import { authService } from "../../features/auth/services/authService";

import {getCloudImageUrl} from "../../services/cloud_images";
import defaultIcon from "../../assets/default-icon.jpg";

function NavBar() {

    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    const [openModal, setOpenModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest("[data-dropdown]")) setOpenModal(false);
            if (!e.target.closest("[data-mobile-menu]")) setMobileMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header>
            <img
                src="/Title.png"
                alt="Logo"
                className="logo"
                onClick={() => navigate("/")}
            />

            <ButtonText
                className="btn textOnly desktop-only"
                text="Descobrir"
                onClick={() => navigate("/explorar-cursos")}
            />

            <div className={`search-wrapper ${mobileSearchOpen ? "mobile-open" : ""}`}>
                <SearchBar />
            </div>

            <button
                className="btn-icon mobile-only"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Buscar"
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            {user && (
                <div className="mobile-only header-icons-mobile">
                    <ButtonIcon
                        icon="fa-solid fa-cart-shopping"
                        onClick={() => navigate("/carrinho")}
                        alt="Carrinho de compras"
                    />

                    <ButtonIcon
                        icon="fa-regular fa-heart"
                        onClick={() => navigate("/favoritos")}
                        alt="Cursos desejados"
                    />
                </div>
            )}

            {!user ? (
                <div className="header-container desktop-only">
                    <ButtonText
                        className="btn textOnly"
                        text="Business"
                        onClick={() => navigate("/empresas")}
                    />

                    <ButtonText
                        className="btn textOnly"
                        text="Ensine na SkillUp"
                        onClick={() => navigate("/ensine-na-skillUp")}
                    />

                    <ButtonText
                        className="btn regular"
                        text="Fazer login"
                        onClick={() => navigate("/entrar")}
                    />

                    <ButtonText
                        className="btn full"
                        text="Cadastre-se"
                        onClick={() => navigate("/cadastro")}
                    />
                </div>
            ) : (
                <div className="header-container desktop-only">
                    <ButtonText
                        className="btn textOnly"
                        text="Meus cursos"
                        onClick={() => navigate("/meus-cursos")}
                    />

                    <ButtonText
                        className="btn textOnly disabled"
                        text="Ensine na SkillUp"
                        /*onClick={() => navigate("/ensine-na-skillUp")}*/
                    />

                    <div className="header-icons">
                        <ButtonIcon
                            className=""
                            icon="fa-solid fa-cart-shopping"
                            onClick={() => navigate("/carrinho")}
                            alt="Carrinho de compras"
                        />

                        <ButtonIcon
                            className=""
                            icon="fa-regular fa-heart"
                            onClick={() => navigate("/favoritos")}
                            alt="Cursos desejados"
                        />

                        <div style={{ position: "relative", display: "inline-block" }} data-dropdown>
                            <img
                                className="user-icon"
                                src={user.userImagePath ? getCloudImageUrl(user.userImagePath) : defaultIcon}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = defaultIcon;
                                }}
                                onClick={() => setOpenModal(!openModal)}
                            />

                            {openModal && (
                                <Dropdown
                                    options={[
                                        { label: "Perfil", value: "profile", onClick: () => navigate("/perfil") },
                                        { label: "Configurações", value: "settings", onClick: () => navigate("#") },
                                        { label: "Sair", value: "logout", onClick: () => authService.logout() },
                                    ]}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <button
                className="btn-icon mobile-only hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                data-mobile-menu
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            {mobileMenuOpen && (
                <div className="mobile-menu-panel" data-mobile-menu>
                    {!user ? (
                        <>
                            <ButtonText className="btn textOnly" text="Business" onClick={() => navigate("/empresas")} />
                            <ButtonText className="btn textOnly" text="Ensine na SkillUp" onClick={() => navigate("/ensine-na-skillUp")} />
                            <ButtonText className="btn regular" text="Fazer login" onClick={() => navigate("/entrar")} />
                            <ButtonText className="btn full" text="Cadastre-se" onClick={() => navigate("/cadastro")} />
                        </>
                    ) : (
                        <>
                            <ButtonText className="btn textOnly" text="Meus cursos" onClick={() => navigate("/meus-cursos")} />
                            <ButtonText className="btn textOnly disabled" text="Ensine na SkillUp" />
                            <ButtonText className="btn textOnly" text="Perfil" onClick={() => navigate("/perfil")} />
                            <ButtonText className="btn textOnly" text="Sair" onClick={() => authService.logout()} />
                        </>
                    )}
                </div>
            )}
        </header>
    );
}

export default NavBar;