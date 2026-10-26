import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import './legal.css'

export default function Privacy() {
    return (
        <main className="legal">
            <div className="legal__container">

                <Link to="/register" className="legal__back">
                    <HiArrowLeft size={14} /> Voltar
                </Link>

                <div className="legal__eyebrow">Documentos legais</div>
                <h1 className="legal__title">Política de Privacidade</h1>
                <p className="legal__meta">Última atualização: outubro de 2025</p>

                <div className="legal__body">

                    <h2>1. Responsável pelo tratamento de dados</h2>
                    <p>
                        O responsável pelo tratamento dos teus dados pessoais é o Batuku.
                        Para qualquer questão relacionada com privacidade, podes contactar-nos através de <a href="mailto:batuku.suporte@gmail.com">batuku.suporte@gmail.com</a>.
                    </p>

                    <h2>2. Dados que recolhemos</h2>
                    <p>Recolhemos os seguintes dados quando utilizas o Batuku:</p>
                    <ul>
                        <li><strong>Dados de registo</strong>:nome, username, email e password (armazenada de forma encriptada).</li>
                        <li><strong>Dados de perfil</strong>:país, localização, foto de perfil e links sociais fornecidos voluntariamente.</li>
                        <li><strong>Dados de utilização</strong>:faixas ouvidas, gostos, comentários, playlists criadas e interações na plataforma.</li>
                        <li><strong>Dados de autenticação OAuth</strong>:quando entras com Google ou Discord, recebemos o teu nome, email e foto de perfil desses serviços.</li>
                    </ul>

                    <h2>3. Como utilizamos os teus dados</h2>
                    <p>Os teus dados são utilizados para:</p>
                    <ul>
                        <li>Fornecer e melhorar os serviços da plataforma.</li>
                        <li>Gerir a tua conta e autenticar o acesso.</li>
                        <li>Enviar emails transacionais (verificação de conta, recuperação de password, notificações importantes).</li>
                        <li>Calcular rankings, pontuações e funcionalidades de gamificação.</li>
                        <li>Apresentar recomendações de música personalizadas.</li>
                        <li>Gerar estatísticas para artistas sobre as suas faixas.</li>
                    </ul>
                    <p>
                        Não utilizamos os teus dados para publicidade de terceiros nem os vendemos a entidades externas.
                    </p>

                    <h2>4. Partilha de dados com terceiros</h2>
                    <p>Os teus dados podem ser partilhados com os seguintes serviços para o funcionamento da plataforma:</p>
                    <ul>
                        <li><strong>Spotify</strong>:para reprodução de pré-visualizações de faixas via Spotify Embed.</li>
                        <li><strong>Google e Discord</strong>:caso uses autenticação OAuth com esses serviços.</li>
                        <li><strong>Brevo</strong>:serviço de envio de emails transacionais.</li>
                        <li><strong>Cloudflare R2</strong>:armazenamento de ficheiros de áudio, capas e imagens.</li>
                    </ul>
                    <p>
                        Todos os serviços terceiros utilizados operam sob as suas próprias políticas de privacidade.
                    </p>

                    <h2>5. Retenção de dados</h2>
                    <p>
                        Os teus dados são mantidos enquanto a tua conta estiver ativa.
                        Após o encerramento da conta, os dados pessoais serão eliminados, exceto os necessários para cumprir obrigações legais.
                    </p>

                    <h2>6. Segurança</h2>
                    <p>
                        Adotamos medidas técnicas para proteger os teus dados, incluindo encriptação de passwords, comunicação via HTTPS e tokens de autenticação com validade limitada.
                        Nenhum sistema é infalível, pelo que não podemos garantir segurança absoluta.
                    </p>

                    <h2>7. Os teus direitos</h2>
                    <p>Tens direito a:</p>
                    <ul>
                        <li>Aceder aos teus dados pessoais.</li>
                        <li>Corrigir dados incorretos através das definições do perfil.</li>
                        <li>Solicitar a eliminação da tua conta e dados associados.</li>
                        <li>Opor-te ao tratamento dos teus dados em determinadas circunstâncias.</li>
                    </ul>
                    <p>
                        Para exercer estes direitos, contacta-nos em <a href="mailto:batuku.suporte@gmail.com">batuku.suporte@gmail.com</a>.
                    </p>

                    <h2>8. Cookies e armazenamento local</h2>
                    <p>
                        O Batuku utiliza armazenamento local do browser (localStorage) para guardar o teu token de sessão.
                        Não utilizamos cookies de rastreamento ou publicidade de terceiros.
                    </p>

                    <h2>9. Alterações a esta política</h2>
                    <p>
                        Podemos atualizar esta Política de Privacidade ocasionalmente. As alterações serão publicadas nesta página com a data de atualização.
                        Alterações significativas serão comunicadas por email.
                    </p>

                    <h2>10. Contacto</h2>
                    <p>
                        Para questões relacionadas com privacidade, contacta-nos através de <a href="mailto:batuku.suporte@gmail.com">batuku.suporte@gmail.com</a>.
                    </p>

                </div>

                <div className="legal__footer">
                    © 2025 Batuku · <a href="mailto:batuku.suporte@gmail.com">batuku.suporte@gmail.com</a>
                    &nbsp;·&nbsp; <Link to="/terms">Termos e Condições</Link>
                </div>

            </div>
        </main>
    )
}
