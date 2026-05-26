import NavbarPublic from '../../components/PublicComponets/NavbarPublic.jsx'
import Hero         from '../../components/PublicComponets/hero'
import Ticker       from '../../components/PublicComponets/ticker'
import Stats        from '../../components/PublicComponets/stats'
import Features     from '../../components/PublicComponets/features'
import HowItWorks   from '../../components/PublicComponets/howItWorks'
import Artists      from '../../components/PublicComponets/artists'
import Marketplace  from '../../components/PublicComponets/marketplace'
import Ranking      from '../../components/PublicComponets/ranking'
import Discord      from '../../components/PublicComponets/discord'
import Testimonials from '../../components/PublicComponets/testimonials'
import FAQ          from '../../components/PublicComponets/faq'
import CTA          from '../../components/PublicComponets/cta'
import Footer       from '../../components/PublicComponets/footer'

export default function Landing() {
    return (
        <div>
            <NavbarPublic />
            <Hero />
            <Ticker />
            <Stats />
            <Features />
            <HowItWorks />
            <Artists />
            <Marketplace />
            <Ranking />
            <Discord />
            <Testimonials />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    )
}
