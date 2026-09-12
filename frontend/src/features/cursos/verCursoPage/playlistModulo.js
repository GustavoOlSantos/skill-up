function closeOrOpenModule(event) {
    const iconElement = event.currentTarget;
    const moduloElement = event.currentTarget.closest(".playlist-modulo");
    moduloElement.classList.toggle("open");
    iconElement.classList.toggle("fa-chevron-down");
    iconElement.classList.toggle("fa-chevron-up");
}

function PlaylistModulo({modulo, aulasConcluidas, moduloAtual, setModuloAtual, aulaAtual, setAulaAtual, setAulaAtualDados }) {

    return (
        <div className={`playlist-modulo ${modulo.id === moduloAtual ? 'open' : 'closed'}`} key={modulo.id}>

            <div className="modulo-header">
                <div>
                    <h3>{modulo.titulo}</h3>
                    <span>{modulo.descricao}</span>
                </div>

                <i className="fa-solid fa-chevron-down" onClick={closeOrOpenModule}></i>
            </div>
            
            {modulo.aulas.map((aula) => (
                <button className={`playlist-item ${modulo.id === moduloAtual ? 'active' : ''}`} key={aula.id} onClick={() => {setAulaAtual(aula.id); setAulaAtualDados(aula); setModuloAtual(modulo.id);}}>
                    <div className="playlist-left">
                        {aula.id === aulaAtual ? (
                            <i className="fa-solid fa-circle-play"></i>
                        ) : aulasConcluidas.includes(aula.id) ? (
                            <i className="fa-solid fa-circle-check"></i>
                        ) : (
                            <i className="fa-regular fa-circle"></i>
                        )}

                        <div>
                            <strong>{aula.titulo}</strong>
                            <span>{Math.floor(aula.duracaoSegundos / 60)}:{(aula.duracaoSegundos % 60).toString().padStart(2, '0')}</span>
                        </div>

                    </div>

                    <i className="fa-solid fa-play"></i>
                </button>
            ))}
        </div>
    );
}
export default PlaylistModulo;