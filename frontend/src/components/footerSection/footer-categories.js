import {useEffect, useState} from "react";
import api from "../../services/api";

function FooterCategorias(){

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const dbcategories = [
            "Desenvolvimento",
            "Business",
            "Comunicação",
            "Desenvolvimento Pessoal",
            "Idiomas",
            "Inteligência Artificial",
            "Cloud Computing",
            "Design & Criatividade"
        ];
        
        api.post("/categorias/filtrar", dbcategories)
        .then(res => setCategorias(res.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <section className="categories">
            {categorias?.map((cat, index) => (
                <nav key={index} aria-labelledby={`cat-${cat.slug}-heading`}>
                <h3 id={`cat-${cat.slug}-heading`}>{cat.nome}</h3>

                <ul className="unstyled-list">
                    {cat.subcategorias?.map((sub, i) => (
                    <li key={i}>
                        <a href={`/explorar-cursos/${sub.slug}`}>{sub.nome}</a>
                    </li>
                    ))}
                </ul>
                </nav>
            ))}
        </section>
  );
}

export default FooterCategorias;