function FeatureCard({icon, title, text}){
    return(
        <div className="feature-card">
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p className='dimmed'>
                {text}
            </p>
        </div>
    )
}

export default FeatureCard