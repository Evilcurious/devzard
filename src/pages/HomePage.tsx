import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import ServicesPreview from "../components/ServicesPreview";
import ProductsPreview from "../components/ProductsPreview";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesPreview />
      <ProductsPreview />
      <Process />
      <Testimonials />
      <Contact />
    </>
  );
}
