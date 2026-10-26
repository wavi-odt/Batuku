import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import './legal.css'

export default function Terms() {
    return (
        <main className="legal">
            <div className="legal__container">

                <Link to="/register" className="legal__back">
                    <HiArrowLeft size={14} /> Voltar
                </Link>

                <div className="legal__eyebrow">Documentos legais</div>
                <h1 className="legal__title">Termos e Condições</h1>
                <p className="legal__meta">Última atualização: outubro de 2025</p>

                <div className="legal__body">

                    <h2>1. Aceitação dos termos</h2>
                    <p>
                        Ao acederes e utilizares a plataforma Batuku, aceitas ficar vinculado a estes Termos e Condições.
                        Se não concordares com alguma das condições aqui descritas, não deves utilizar o serviço.
                    </p>

                    <h2>2. Descrição do serviço</h2>
                    <p>
                        O Batuku é uma plataforma de música dedicada a artistas e fãs de música cabo-verdiana.
                        Permite descobrir artistas, ouvir música, criar playlists, interagir com a comunidade e, para artistas verificados, publicar faixas e vender beats.
                    </p>

                    <h2>3. Contas de utilizador</h2>
                    <p>
                        Para utilizar o Batuku é necessário criar uma conta. És responsável por manter a confidencialidade das tuas credenciais de acesso e por todas as atividades realizadas na tua conta.
                        Deves notificar-nos imediatamente em caso de acesso não autorizado através de <a href="mailto:batuku.suporte@gmail.com">batuku.suporte@gmail.com</a>.
                    </p>
                    <p>
                        Existem dois tipos de conta:
                    </p>
                    <ul>
                        <li><strong>Fã:</strong> acesso a todas as funcionalidades de descoberta, interação e gamificação.</li>
                        <li><strong>Artista:</strong> adicionalmente, permite publicar música e aceder a analytics. Requer verificação de identidade pela equipa Batuku.</li>
                    </ul>

                    <h2>4. Conteúdo publicado</h2>
                    <p>
                        Os artistas são os únicos responsáveis pelo conteúdo que publicam na plataforma, incluindo faixas, imagens e descrições.
                        Ao publicares conteúdo, declaras que tens todos os direitos necessários para o fazer e que esse conteúdo não viola direitos de terceiros.
                    </p>
                    <p>
                        O Batuku reserva-se o direito de remover qualquer conteúdo que viole estes termos ou que seja considerado inadequado, sem aviso prévio.
                    </p>

                    <h2>5. Conduta proibida</h2>
                    <p>É estritamente proibido:</p>
                    <ul>
                        <li>Publicar conteúdo que infrinja direitos de autor ou outros direitos de propriedade intelectual.</li>
                        <li>Utilizar a plataforma para fins ilegais ou fraudulentos.</li>
                        <li>Assediar, ameaçar ou difamar outros utilizadores.</li>
                        <li>Tentar aceder a contas ou sistemas sem autorização.</li>
                        <li>Publicar conteúdo de natureza ofensiva, discriminatória ou violenta.</li>
                        <li>Usar mecanismos automatizados para manipular métricas (reproduções, gostos, etc.).</li>
                    </ul>

                    <h2>6. Marketplace de beats</h2>
                    <p>
                        O Batuku disponibiliza um espaço para produtores venderem beats. As transações são realizadas entre os utilizadores e o Batuku não assume responsabilidade por disputas resultantes dessas transações.
                        Cada listagem deve respeitar os direitos de autor. As condições de licenciamento são definidas e padronizadas pelo Batuku.
                    </p>

                    <h2>7. Suspensão e encerramento de conta</h2>
                    <p>
                        O Batuku reserva-se o direito de suspender ou encerrar contas que violem estes termos, a qualquer momento e sem aviso prévio.
                        Podes também encerrar a tua conta a qualquer momento, basta nos contactar.
                    </p>

                    <h2>8. Limitação de responsabilidade</h2>
                    <p>
                        O Batuku é fornecido "tal como está", sem garantias de qualquer tipo.
                        Não nos responsabilizamos por perdas de dados, interrupções do serviço ou danos resultantes da utilização da plataforma.
                    </p>

                    <h2>9. Alterações aos termos</h2>
                    <p>
                        Podemos atualizar estes Termos e Condições ocasionalmente. As alterações serão publicadas nesta página com a data de atualização.
                        O uso continuado da plataforma após a publicação de alterações constitui aceitação das mesmas.
                    </p>

                    <h2>10. Contacto</h2>
                    <p>
                        Para questões relacionadas com estes termos, contacta-nos através de <a href="mailto:batuku.suporte@gmail.com">batuku.suporte@gmail.com</a>.
                    </p>

                </div>

                <div className="legal__footer">
                    © 2025 Batuku · <a href="mailto:batuku.suporte@gmail.com">batuku.suporte@gmail.com</a>
                    &nbsp;·&nbsp; <Link to="/privacy">Política de Privacidade</Link>
                </div>

            </div>
        </main>
    )
}
