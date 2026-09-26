import { useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext'
import NavbarPublic from '../../components/PublicComponets/NavbarPublic.jsx'
import Hero         from '../../components/PublicComponets/hero'
import Ticker       from '../../components/PublicComponets/ticker'
import Features     from '../../components/PublicComponets/features'
import HowItWorks   from '../../components/PublicComponets/howItWorks'
import Marketplace  from '../../components/PublicComponets/marketplace'
import Discord      from '../../components/PublicComponets/discord'
import FAQ          from '../../components/PublicComponets/faq'
import CTA          from '../../components/PublicComponets/cta'
import Footer       from '../../components/PublicComponets/footer'

export default function Landing() {
    const { setTrack } = usePlayer()
    useEffect(() => { setTrack(null) }, [])

    return (
        <div>
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
