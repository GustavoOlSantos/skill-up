import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import api from '../../services/api';
import { getCloudImageUrl } from '../../services/cloud_images.js';

function SearchBar() {
    const navigate = useNavigate();
    const [cursosSearched, setCursosSearched] = useState([]);

    const searcherRef = useRef(null);
    const timeoutRef = useRef(null);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setCursosSearched([]);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function buscarCursos(event) {
        searcherRef.current = event.target.value;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (!searcherRef.current.trim()) {
            setCursosSearched([]);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            api.get(`/cursos/nome/${searcherRef.current}`)
                .then((response) => {
                    setCursosSearched(response.data);
                })
                .catch((error) => {
                    console.error('Erro ao buscar cursos:', error);
                });
        }, 1000);
    }

    function clearInput(curso){
        searcherRef.current = '';
        setCursosSearched([]);
        navigate(`/cursos/${curso.slug}`)
    }

    return (
        <div className="search-container" ref={searchContainerRef}>
            <i id="search-icon" className="fa-solid fa-magnifying-glass"></i>
            <input type="text" className="main-searcher" placeholder="Busque pelo nome do curso ou área de interesse..." onChange={buscarCursos} onClick={buscarCursos}/>

            {cursosSearched.length > 0 && (
                <div className="search-results">
                    {cursosSearched.map((curso) => (
                        <div key={curso.id} className="search-result" onClick={() => clearInput(curso) }>
                            <img src={getCloudImageUrl(curso.imagemUrl)} alt={curso.nome} />
                            <div>
                                <h3>{curso.nome}</h3>
                                <p>{curso.subtitulo}</p>
                                <h4>R$ {curso.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                                <hr />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;