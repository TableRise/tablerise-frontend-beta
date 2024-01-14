import 'src/pages/styles/Match.css';

export default function Match() {
    const handleCreateAvatar = () => {
        
    };

    return (
        <section className="match-page">
            <div className="match-items">
                <button
                    onClick={handleCreateAvatar}
                >
                    Criar Avatar
                </button>
                <button>Excluir Avatar</button>
            </div>

            <div className="match-map">
                
            </div>
        </section>
    )
}
