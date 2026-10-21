import { useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext'
import NavbarPublic from '../../components/PublicComponents/NavbarPublic.jsx'
import Hero         from '../../components/PublicComponents/hero'
import Ticker       from '../../components/PublicComponents/ticker'
import Features     from '../../components/PublicComponents/features'
import HowItWorks   from '../../components/PublicComponents/howItWorks'
import Marketplace  from '../../components/PublicComponents/marketplace'
import Discord      from '../../components/PublicComponents/discord'
import FAQ          from '../../components/PublicComponents/faq'
import CTA          from '../../components/PublicComponents/cta'
import Footer       from '../../components/PublicComponents/footer'

export default function Landing() {
    const { setTrack } = usePlayer()
    useEffect(() => { setTrack(null) }, [])

    return (
        <div className="page-enter">
            <NavbarPublic />
            <Hero />
            <Ticker />
<Features />
            <HowItWorks />
<Marketplace />
<Discord />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    )
}
