//import { useNavigate } from 'react-router-dom';

function SearchBar(){

    //const navigate = useNavigate();

    return(
        <div className="search-container">
            <i id="search-icon" className="fa-solid fa-magnifying-glass"></i>
            <input type="text" className="main-searcher" placeholder="Busque pelo nome do curso ou área de interesse..." />
        </div>
    )
}
export default SearchBar;