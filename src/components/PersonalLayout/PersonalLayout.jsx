import './personal-tokens.css'
import './PersonalLayout.css'

export default function PersonalLayout({ children, playerPadding, split }) {
    return (
        <div className={'pl personal-scope' + (split ? ' pl--split' : '')}>
            <main className={
                'pl__main' +
                (!split && playerPadding ? ' pl__main--has-player' : '') +
                (split ? ' pl__main--split' : '')
            }>
                <div className="pl__container">
                    {children}
                </div>
            </main>
        </div>
    )
}
