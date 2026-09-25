/* ─────────────────────────────────────────────────────────────────
   AguardarValidacao.jsx, Ecrã de espera para artistas pendentes.
   ───────────────────────────────────────────────────────────────── */

import { useLocation, Link } from 'react-router-dom'
import AuthSide from '../../components/AuthComponents/AuthSide.jsx'
import { isPendingClaim } from '../../utils/auth.js'
import '../../components/AuthComponents/auth.css'

export default function AguardarValidacao() {
    const { state } = useLocation()
    const email = state?.email
    const claimNotSubmitted = isPendingClaim()

    return (
        <main className="auth">
            <AuthSide
                title="Quase lá,"
                accent="artista."
                lede="A tua conta está a ser verificada pela equipa Batuku. Receberás confirmação em breve."
                quote="A música cabo-verdiana merece a melhor casa possível."
                author=", Equipa Batuku"
            />

            <section className="auth__form-col">
                <div className="auth__form">
                    <div className="label-eyebrow">Conta artista</div>
                    <h1 className="auth__title">À espera de validação</h1>

                    <div className="pending-validation__card">
                        <div className="pending-validation__icon">⏳</div>
                        <p className="pending-validation__text">
                            {claimNotSubmitted
                                ? 'Ainda não submeteste a verificação de identidade. Clica abaixo para continuar.'
                                : 'A tua conta de artista está a aguardar validação pela equipa Batuku.'}
                        </p>
                        {email && (
                            <p className="pending-validation__email">
                                Conta registada com <strong>{email}</strong>
                            </p>
                        )}
                        <p className="pending-validation__sub">
                            {claimNotSubmitted
                                ? 'Precisas de submeter o teu perfil Spotify, selfie e documento de identificação.'
                                : 'Assim que a validação estiver concluída, podes entrar normalmente.'}
                        </p>
                    </div>

                    {claimNotSubmitted
                        ? <Link to="/claim-profile" className="btn btn--primary" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-5)' }}>
                            Continuar verificação →
                          </Link>
                        : <Link to="/login" className="btn btn--ghost" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-5)' }}>
                            Voltar ao login
                          </Link>
                    }
                </div>
            </section>
        </main>
    )
}
