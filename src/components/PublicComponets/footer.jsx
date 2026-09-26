/* ─────────────────────────────────────────────────────────────────
   Footer, Rodapé com colunas de links e copyright.
   ───────────────────────────────────────────────────────────────── */

import logo from '../../assets/batuku.png'
import './footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">

                <div className="footer__top">
                    <div className="footer__brand">
                        <div className="footer__logo-row">
                            <img src={logo} alt="Batuku" className="footer__logo" />
                            <span className="footer__wordmark">Batuku</span>
                        </div>
                        <p className="footer__tag">
                            A casa dos artistas independentes de Cabo Verde.
                        </p>
                    </div>
                </div>

                <div className="footer__bottom">
                    <span>© 2026 Batuku. Todos os direitos reservados.</span>
                    <span>Feito com o coração 🇨🇻, Praia · Lisboa · Boston</span>
                </div>
            </div>
        </footer>
    );
}
