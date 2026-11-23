import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Products = lazy(() => import('./pages/Products'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const TrainingModules = lazy(() => import('./pages/TrainingModules'));
const TrainingDelivery = lazy(() => import('./pages/TrainingDelivery'));
const ImmersiveLearning = lazy(() => import('./pages/ImmersiveLearning'));
const LearningTechnology = lazy(() => import('./pages/LearningTechnology'));
const Career = lazy(() => import('./pages/Career'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function AppShell() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[50vh]" role="status" aria-live="polite">
            <span className="sr-only">Loading page</span>
          </div>
        }
      >
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

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
