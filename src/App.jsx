import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  loadAbout,
  loadBlog,
  loadBlogDetail,
  loadCareer,
  loadContact,
  loadHome,
  loadImmersiveLearning,
  loadIndustryDetail,
  loadLearningTechnology,
  loadNotFound,
  loadPortfolio,
  loadPrivacy,
  loadProducts,
  loadServiceDetail,
  loadServices,
  loadTerms,
  loadTrainingDelivery,
  loadTrainingModules,
} from './route-loaders';

const Home = lazy(loadHome);
const About = lazy(loadAbout);
const Contact = lazy(loadContact);
const Career = lazy(loadCareer);
const Privacy = lazy(loadPrivacy);
const Terms = lazy(loadTerms);
const Portfolio = lazy(loadPortfolio);
const IndustryDetail = lazy(loadIndustryDetail);
const Services = lazy(loadServices);
const ServiceDetail = lazy(loadServiceDetail);
const Products = lazy(loadProducts);
const Blog = lazy(loadBlog);
const BlogDetail = lazy(loadBlogDetail);
const TrainingModules = lazy(loadTrainingModules);
const TrainingDelivery = lazy(loadTrainingDelivery);
const ImmersiveLearning = lazy(loadImmersiveLearning);
const LearningTechnology = lazy(loadLearningTechnology);
const NotFound = lazy(loadNotFound);

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<IndustryDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/training-modules" element={<TrainingModules />} />
          <Route path="/training-delivery" element={<TrainingDelivery />} />
          <Route path="/immersive-learning" element={<ImmersiveLearning />} />
          <Route path="/learning-technology" element={<LearningTechnology />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
