import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import WhoWEAre from '../components/Home/WhoWEAre';
import SetUsApart from '../components/Home/SetUsApart';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import VissionMission from '../components/Home/VissionMission';
import CTA from '../components/CTA';
import SEO from '../components/SEO';
import { seo } from '../data/seo';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JF Knowledge Centre',
  alternateName: 'JFKC',
  url: 'https://jfknowledge.com/',
  logo: 'https://jfknowledge.com/logobg.png',
  email: 'info@jfknowledge.com',
  telephone: '+91-9818238969',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'GF-41, Omaxe Square, Jasola District Centre',
    addressLocality: 'New Delhi',
    postalCode: '110025',
    addressCountry: 'IN',
  },
};

const Home = () => {
  return (
    <>
      <SEO {...seo.home} jsonLd={orgSchema} />
      <Hero />
      <About />
      <WhoWEAre />
      <SetUsApart />
      <WhyChooseUs />
      <VissionMission />
      <CTA />
    </>
  );
};

export default Home;
