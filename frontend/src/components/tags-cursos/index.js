function Tags({icone, dado, texto, className}) {
    return (
        <div className={`tag ${className || ''}`}>
            <i className={icone}></i>
            {dado}  {texto}
        </div>
    )
}

export default Tags;