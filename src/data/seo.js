export const seo = {
  home: {
    title: 'JF Knowledge Centre | E-Learning, LMS & Digital Solutions',
    description:
      'Discover JF Knowledge Centre Centre for custom e-learning content, LMS solutions, digital learning, instructional design, and business services.',
    keywords:
      'JF Knowledge Centre, e-learning solutions, LMS development, digital learning, instructional design, corporate training',
    path: '/',
  },
  about: {
    title: 'About JF Knowledge Centre | Our Expertise & Learning Solutions',
    description:
      'Learn about JF Knowledge Centre Centre, our mission, expertise, and commitment to creating engaging digital learning experiences for businesses and institutions.',
    keywords:
      'about JF Knowledge Centre, JF Knowledge Centre Centre, e-learning company, learning solutions, digital education, corporate learning',
    path: '/about',
  },
  contact: {
    title: 'Contact JF Knowledge Centre | Discuss Your Business Needs',
    description:
      'Contact JF Knowledge Centre Centre to discuss custom e-learning, corporate training, digital solutions, and professional services tailored to your business goals.',
    keywords:
      'contact JF Knowledge Centre, e-learning consultation, business enquiries, corporate training services, learning solutions contact',
    path: '/contact',
  },
  career: {
    title: 'Careers at JF Knowledge Centre | Explore Job Opportunities',
    description:
      'Explore career opportunities at JF Knowledge Centre Centre and discover opportunities to contribute to e-learning, instructional design, technology, and business solutions.',
    keywords:
      'JF Knowledge Centre careers, jobs at JF Knowledge Centre, e-learning jobs, instructional design careers, digital learning jobs',
    path: '/career',
  },
  privacy: {
    title: 'Privacy Policy | JF Knowledge Centre',
    description:
      'Read the JF Knowledge Centre Centre privacy policy to understand how personal information is collected, used, protected, and handled when you use our website.',
    keywords:
      'JF Knowledge Centre privacy policy, data privacy, personal information, website privacy, privacy practices',
    path: '/privacy',
  },
  terms: {
    title: 'Terms and Conditions | JF Knowledge Centre',
    description:
      'Review the terms and conditions governing website use, intellectual property, content access, and interactions with JF Knowledge Centre Centre.',
    keywords:
      'JF Knowledge Centre terms, terms and conditions, website terms, intellectual property, website usage policy',
    path: '/terms',
  },
  services: {
    title: 'Business Services | JF Knowledge Centre',
    description:
      'Explore JF Knowledge Centre Centre services, including e-learning content design, CPA bookkeeping, recruitment, IT asset management, localization, and digital marketing.',
    keywords:
      'JF Knowledge Centre services, business services, e-learning services, CPA bookkeeping, recruitment, IT asset management, digital marketing',
    path: '/services',
  },
  products: {
    title: 'Athena Learning Products | Digital Learning Solutions',
    description:
      'Explore Athena Learning Products for custom learning, microlearning, content libraries, video-based practice, gamification, and immersive digital training.',
    keywords:
      'Athena Learning Products, digital learning products, microlearning, e-learning content libraries, gamification, VR training',
    path: '/products',
  },
  portfolio: {
    title: 'Our Portfolio | E-Learning Projects Across Industries',
    description:
      'Explore JF Knowledge Centre Centre\'s portfolio of industry-focused e-learning content, interactive training, digital learning experiences, and customized solutions.',
    keywords:
      'JF Knowledge Centre portfolio, e-learning portfolio, digital learning projects, instructional design samples, corporate training portfolio',
    path: '/portfolio',
  },
  blog: {
    title: 'JF Knowledge Centre Journal | Learning Design Insights',
    description:
      'Read thought leadership articles and insights on learning design, digital learning, delivery models, talent strategy, and business performance.',
    keywords:
      'JF Knowledge Centre blog, learning design articles, digital learning insights, corporate training blog, e-learning journal',
    path: '/blog',
  },
  'training-modules': {
    title: 'Training Modules | JF Knowledge Centre',
    description:
      'Explore training modules on onboarding, leadership, compliance, storytelling, product training, soft skills, DEI, and content authoring tools.',
    keywords:
      'training modules, onboarding training, leadership programs, compliance training, soft skills modules, DEI learning',
    path: '/training-modules',
  },
  'training-delivery': {
    title: 'Training Delivery | Interactive Learning Formats',
    description:
      'Discover digital, hybrid, and live training delivery formats such as interactive videos, online courses, micro-learning, ILT, and VILT.',
    keywords:
      'training delivery, interactive videos, micro-learning, online courses, blended learning, VILT training',
    path: '/training-delivery',
  },
  'immersive-learning': {
    title: 'Immersive Learning | Gamification, VR & Scenario-Based Training',
    description:
      'Experience immersive learning through gamification, branching scenarios, video-based learning, VR simulations, AR experiences, and custom learning games.',
    keywords:
      'immersive learning, gamification, scenario-based learning, VR simulations, AR learning, custom learning games',
    path: '/immersive-learning',
  },
  'learning-technology': {
    title: 'Learning Technology | LMS, LXP & Digital Training Platforms',
    description:
      'Explore learning technology solutions including LMS, LXP, learning portals, interactive video frameworks, speed learning, migration, and authoring expertise.',
    keywords:
      'learning technology, LMS platform, LXP expertise, learning portal, authoring tools, interactive video framework',
    path: '/learning-technology',
  },
};

export const getServiceSeo = (slug) => {
  const map = {
    'content-design': {
      title: 'E-Learning Content Design Services | JF Knowledge Centre',
      description:
        'Create engaging digital learning experiences with custom e-learning content design, instructional design, interactive modules, multimedia, and training materials.',
      keywords:
        'e-learning content design, instructional design services, custom e-learning development, interactive learning content, multimedia learning',
      path: '/services/content-design',
    },
    'recruitment-staffing': {
      title: 'Recruitment, Staffing & Staff Augmentation | JF Knowledge Centre',
      description:
        'Find workforce support through recruitment, staffing, and staff augmentation solutions designed to help businesses address talent gaps and changing project needs.',
      keywords:
        'recruitment services, staffing solutions, staff augmentation, talent acquisition, workforce solutions, recruitment support',
      path: '/services/recruitment-staffing',
    },
    'it-assets-amc': {
      title: 'IT Asset Management & AMC Services | JF Knowledge Centre',
      description:
        'Support your IT infrastructure with IT asset management and annual maintenance contract services designed to help businesses maintain technology assets.',
      keywords:
        'IT asset management, IT AMC services, annual maintenance contract, IT infrastructure support, technology asset management',
      path: '/services/it-assets-amc',
    },
    'cpa-bookkeeping': {
      title: 'CPA & AI Bookkeeping Services | JF Knowledge Centre',
      description:
        'Improve financial visibility with CPA expertise and AI-assisted bookkeeping for business records, transaction management, reporting, and accounting workflows.',
      keywords:
        'CPA bookkeeping services, AI bookkeeping, outsourced bookkeeping, accounting services, financial reporting, bookkeeping automation',
      path: '/services/cpa-bookkeeping',
    },
    'data-translation-localization': {
      title: 'Data Translation & Localization Services | JF Knowledge Centre',
      description:
        'Reach international audiences with data translation and localization services that adapt digital content, language, and messaging for diverse markets.',
      keywords:
        'data translation services, content localization, translation services, multilingual content, global localization, international content',
      path: '/services/data-translation-localization',
    },
    'digital-marketing': {
      title: 'Digital Marketing Services for Businesses | JF Knowledge Centre',
      description:
        'Strengthen your digital presence with marketing services focused on SEO, content strategy, online visibility, audience engagement, and business growth.',
      keywords:
        'digital marketing services, SEO services, content marketing, online marketing, digital strategy, business visibility',
      path: '/services/digital-marketing',
    },
    'elearning-digital-innovation': {
      title: 'E-Learning & Digital Innovation Solutions | JF Knowledge Centre',
      description:
        'Transform corporate learning with e-learning development, digital innovation, interactive training content, LMS solutions, and modern learning technologies.',
      keywords:
        'e-learning solutions, digital learning innovation, LMS solutions, corporate e-learning, learning technology, digital training',
      path: '/services/elearning-digital-innovation',
    },
  };

  return map[slug] || seo.services;
};

export const getIndustrySeo = (slug) => {
  const map = {
    'bfsi-fintech': {
      title: 'BFSI & Fintech E-Learning Solutions | JF Knowledge Centre',
      description:
        'Explore e-learning solutions for banking, financial services, and fintech, covering compliance, risk management, digital banking, and financial product training.',
      keywords:
        'BFSI e-learning, fintech training, banking compliance training, financial services learning, risk management training, digital banking education',
      path: '/portfolio/bfsi-fintech',
    },
    'retail-fmcg-ecommerce': {
      title: 'Retail, FMCG & E-Commerce Training Solutions | JF Knowledge Centre',
      description:
        'Improve employee knowledge with retail, FMCG, and e-commerce training covering product knowledge, customer service, sales, merchandising, and operations.',
      keywords:
        'retail training, FMCG training, e-commerce training, product knowledge training, retail employee learning, sales training',
      path: '/portfolio/retail-fmcg-ecommerce',
    },
    'logistics-supply-chain': {
      title: 'Logistics & Supply Chain Training Solutions | JF Knowledge Centre',
      description:
        'Develop workforce skills with logistics and supply chain training covering warehouse operations, inventory management, distribution, safety, and process efficiency.',
      keywords:
        'logistics training, supply chain training, warehouse operations learning, inventory management, distribution training, safety training',
      path: '/portfolio/logistics-supply-chain',
    },
    'corporate-enterprises': {
      title: 'Corporate & Enterprise Learning Solutions | JF Knowledge Centre',
      description:
        'Support business growth with corporate learning solutions covering leadership, compliance, onboarding, role-based upskilling, and performance training.',
      keywords:
        'corporate training, enterprise learning, leadership training, compliance education, onboarding programs, role-based upskilling',
      path: '/portfolio/corporate-enterprises',
    },
    'healthcare-pharma': {
      title: 'Healthcare & Pharma Training Solutions | JF Knowledge Centre',
      description:
        'Build capability in healthcare and pharma teams with training on clinical knowledge, patient care, compliance, and scientific sales enablement.',
      keywords:
        'healthcare training, pharma learning, patient care training, clinical education, compliance training, medical sales enablement',
      path: '/portfolio/healthcare-pharma',
    },
    'aviation-airlines': {
      title: 'Aviation & Airline Training Solutions | JF Knowledge Centre',
      description:
        'Deliver safety-focused aviation training covering procedures, systems knowledge, customer service, and operational readiness for airline teams.',
      keywords:
        'aviation training, airline learning, aircraft safety training, customer service training, crew education, airline operations',
      path: '/portfolio/aviation-airlines',
    },
    'automobiles-manufacturing': {
      title: 'Automobiles & Manufacturing Training Solutions | JF Knowledge Centre',
      description:
        'Create manufacturing and automotive learning programs for productivity, quality, safety, maintenance, and operational excellence on the shop floor.',
      keywords:
        'automotive training, manufacturing learning, assembly training, quality assurance, maintenance training, factory safety',
      path: '/portfolio/automobiles-manufacturing',
    },
    'oil-gas': {
      title: 'Oil & Gas / Energy Training Solutions | JF Knowledge Centre',
      description:
        'Support energy and industrial teams with safety, compliance, technical training, and emergency response learning built for field operations.',
      keywords:
        'oil and gas training, energy learning, rig safety training, hazardous materials training, emergency response education',
      path: '/portfolio/oil-gas',
    },
    'it-business-intelligence': {
      title: 'IT & Business Intelligence Training Solutions | JF Knowledge Centre',
      description:
        'Keep digital teams current with IT and business intelligence training covering coding, analytics, cloud, cyber, and continuous learning.',
      keywords:
        'IT training, business intelligence learning, data analytics training, cybersecurity education, cloud learning, continuous learning',
      path: '/portfolio/it-business-intelligence',
    },
    'universities-edtech': {
      title: 'Universities & EdTech Learning Solutions | JF Knowledge Centre',
      description:
        'Redefine learning for universities and edtech businesses with AI-powered personalization, scalable content, and seamless LMS integration.',
      keywords:
        'university training, EdTech learning, LMS integration, AI personalization, higher education learning, digital learning platform',
      path: '/portfolio/universities-edtech',
    },
    'hospitality-tourism': {
      title: 'Hospitality & Tourism Training Solutions | JF Knowledge Centre',
      description:
        'Train hospitality and tourism teams in guest experience, service standards, reservations, safety, and destination knowledge for consistent journeys.',
      keywords:
        'hospitality training, tourism learning, guest experience training, hotel service standards, travel staff education',
      path: '/portfolio/hospitality-tourism',
    },
    'telecommunications': {
      title: 'Telecommunications Training Solutions | JF Knowledge Centre',
      description:
        'Equip telecom teams with product, customer service, sales, and network knowledge designed for retail, contact centre, and field operations.',
      keywords:
        'telecommunications training, network learning, customer support training, telecom product education, field team skills',
      path: '/portfolio/telecommunications',
    },
    'government-public-sector': {
      title: 'Government & Public Sector Training Solutions | JF Knowledge Centre',
      description:
        'Improve policy, citizen service, and role-based capabilities with training programmes designed for public service teams and large-scale rollouts.',
      keywords:
        'government training, public sector learning, citizen service training, compliance education, public policy learning',
      path: '/portfolio/government-public-sector',
    },
  };

  return map[slug] || seo.portfolio;
};
