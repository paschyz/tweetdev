import "../styles/HomePage.css"

function HomePage() {
    return (
        <div className="homepage_container">
            <div className="homepage_introduction">
                <div className="homepage_introduction-child">   
                    <h1>Codez, Partagez, Collaborez</h1>
                <p>La plateforme ultime pour les développeurs passionnés.</p>
                </div>
            </div>  
            <section className="hero">
                <a href="#" className="btn btn-primary">Commencer gratuitement</a>
                <a href="#" className="btn">Voir une démo</a>
            </section>
            <section id="features" className="features">
                <h2>Fonctionnalités Principales</h2>
                <div className="feature">
                    <h3>Écriture de Code en Ligne</h3>
                    <p>Éditeur de code intégré avec support multi-langages.</p>
                </div>
                <div className="feature">
                    <h3>Partage de Code</h3>
                    <p>Partagez facilement votre code via des liens ou des dépôts.</p>
                </div>
                <div className="feature">
                    <h3>Suivi des Développeurs</h3>
                    <p>Suivez vos développeurs préférés.</p>
                </div>
            </section>
            <div className="homepage_other-services">
           
                </div>
        </div>
    );
}

export default HomePage;