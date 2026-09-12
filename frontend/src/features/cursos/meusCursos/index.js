import {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../services/api";
import Loading from "../../../components/loading/";
import { UserContext } from "../../../app/providers/user-context";
import CardCursos from "../../../components/card-cursos";

function MeusCursos() {

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [cursos, setCursos] = useState([]);
    const [cursosConcluidos, setcursosConcluidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user === undefined) return;

        if(user == null){
            navigate("/entrar");
        }

        api.get("/compras")
            .then(response => {
                setCursos(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar cursos adquiridos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, navigate]);

    useEffect(() => {
        if (!cursos || cursos.length === 0) return;

        const promises = cursos.map(curso =>
            api.get(`progresso/aulas-concluidas/${curso.id}`)
                .then(res => ({ cursoId: curso.id, concluidas: res.data.length }))
                .catch(() => ({ cursoId: curso.id, concluidas: 0 }))
        );

        Promise.all(promises).then(resultados => {
            const map = {};
            resultados.forEach(({ cursoId, concluidas }) => {
                map[cursoId] = concluidas;
            });
            setcursosConcluidos(map);
        });
    }, [cursos]);

    if(loading) {
        return <Loading texto="sua lista de cursos"/>;
    }

    return(
        <div className="meus-cursos">

            <h2>Meus Cursos:</h2>

            <section className="cursos-adquiridos">
                {cursos.length === 0 ? <p>Você ainda não adquiriu nenhum curso.</p> :  
                    cursos.map(curso => (
                        <CardCursos key={curso.id} curso={curso} maisVendidos={true} origin="meus-cursos" aulasConcluidas={cursosConcluidos[curso.id] ?? 0} />  
                    ))
                }
            </section>
                
            
        </div>
    );
}

export default MeusCursos;