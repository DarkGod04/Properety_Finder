import  Findsection from './components/home_compo/find'
// import ExploreSection removed to avoid duplicate find filter
import  Footer from './components/footer/Footer'

export default function HomePage() {
    return (
        <section>
            <Findsection />
            <Footer />
        </section>
    );
}