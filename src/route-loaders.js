import { canonicalPath } from './data/site';

export const loadHome = () => import('./pages/Home.jsx');
export const loadAbout = () => import('./pages/About.jsx');
export const loadContact = () => import('./pages/Contact.jsx');
export const loadCareer = () => import('./pages/Career.jsx');
export const loadPrivacy = () => import('./pages/Privacy.jsx');
export const loadTerms = () => import('./pages/Terms.jsx');
export const loadPortfolio = () => import('./pages/Portfolio.jsx');
export const loadIndustryDetail = () => import('./pages/IndustryDetail.jsx');
export const loadServices = () => import('./pages/Services.jsx');
export const loadServiceDetail = () => import('./pages/ServiceDetail.jsx');
export const loadProducts = () => import('./pages/Products.jsx');
export const loadBlog = () => import('./pages/Blog.jsx');
export const loadBlogDetail = () => import('./pages/BlogDetail.jsx');
export const loadTrainingModules = () => import('./pages/TrainingModules.jsx');
export const loadTrainingDelivery = () => import('./pages/TrainingDelivery.jsx');
export const loadImmersiveLearning = () => import('./pages/ImmersiveLearning.jsx');
export const loadLearningTechnology = () => import('./pages/LearningTechnology.jsx');
export const loadNotFound = () => import('./pages/NotFound.jsx');

const exact = {
  '/': loadHome,
  '/about': loadAbout,
  '/contact': loadContact,
  '/career': loadCareer,
  '/privacy': loadPrivacy,
  '/terms': loadTerms,
  '/portfolio': loadPortfolio,
  '/services': loadServices,
  '/products': loadProducts,
  '/blog': loadBlog,
  '/training-modules': loadTrainingModules,
  '/training-delivery': loadTrainingDelivery,
  '/immersive-learning': loadImmersiveLearning,
  '/learning-technology': loadLearningTechnology,
};

export function preloadRoute(pathname) {
  const path = canonicalPath(pathname);
  if (exact[path]) return exact[path]();
  if (path.startsWith('/blog/')) return loadBlogDetail();
  if (path.startsWith('/services/')) return loadServiceDetail();
  if (path.startsWith('/portfolio/')) return loadIndustryDetail();
  return loadNotFound();
}
