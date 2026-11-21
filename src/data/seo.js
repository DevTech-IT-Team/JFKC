export const seo = {
  home: {
    title: 'Custom eLearning Company in India | JF Knowledge Centre',
    description:
      'JF Knowledge Centre builds custom eLearning, instructional design, immersive learning and LMS solutions for corporate teams in India and worldwide.',
    keywords:
      'JF Knowledge Centre, e-learning solutions, LMS development, digital learning, instructional design, corporate training',
    path: '/',
  },
  about: {
    title: 'About JF Knowledge Centre | eLearning Company in New Delhi',
    description:
      'Meet JF Knowledge Centre, a New Delhi eLearning company designing custom courses, immersive learning and learning technology for enterprise teams.',
    keywords:
      'about JF Knowledge Centre, JF Knowledge Centre, e-learning company, learning solutions, digital education, corporate learning',
    path: '/about',
  },
  contact: {
    title: 'Contact JF Knowledge Centre | Custom eLearning Enquiries',
    description:
      'Contact JF Knowledge Centre to discuss custom eLearning, instructional design, LMS or training projects. Share your brief and we will get back to you.',
    keywords:
      'contact JF Knowledge Centre, e-learning consultation, business enquiries, corporate training services, learning solutions contact',
    path: '/contact',
  },
  career: {
    title: 'Careers at JF Knowledge Centre | eLearning & Design Jobs',
    description:
      'Explore careers at JF Knowledge Centre in instructional design, eLearning development, multimedia and learning technology. See open roles and apply.',
    keywords:
      'JF Knowledge Centre careers, jobs at JF Knowledge Centre, e-learning jobs, instructional design careers, digital learning jobs',
    path: '/career',
  },
  privacy: {
    title: 'Privacy Policy | JF Knowledge Centre',
    description:
      'Read the JF Knowledge Centre privacy policy to understand how we collect, use and protect your personal information.',
    keywords:
      'JF Knowledge Centre privacy policy, data privacy, personal information, website privacy, privacy practices',
    path: '/privacy',
  },
  terms: {
    title: 'Terms and Conditions | JF Knowledge Centre',
    description:
      'Review the terms and conditions that govern use of the JF Knowledge Centre website, services and content.',
    keywords:
      'JF Knowledge Centre terms, terms and conditions, website terms, intellectual property, website usage policy',
    path: '/terms',
  },
  services: {
    title: 'eLearning & Training Services | JF Knowledge Centre',
    description:
      'Explore JF Knowledge Centre services: custom eLearning, instructional design, immersive learning, learning technology, training delivery and localization.',
    keywords:
      'JF Knowledge Centre services, business services, e-learning services, CPA bookkeeping, recruitment, IT asset management, digital marketing',
    path: '/services',
  },
  products: {
    title: 'Athena LMS & AI Learning Products | JF Knowledge Centre',
    description:
      'Explore Athena LMS products from JF Knowledge Centre: an LMS with AI course creation, virtual studio, eBooks and a website builder in one platform.',
    keywords:
      'Athena Learning Products, digital learning products, microlearning, e-learning content libraries, gamification, VR training',
    path: '/products',
  },
  portfolio: {
    title: 'eLearning Portfolio by Industry | JF Knowledge Centre',
    description:
      'See JF Knowledge Centre eLearning and training projects across BFSI, healthcare, manufacturing, aviation, government and more industries.',
    keywords:
      'JF Knowledge Centre portfolio, e-learning portfolio, digital learning projects, instructional design samples, corporate training portfolio',
    path: '/portfolio',
  },
  blog: {
    title: 'eLearning & Learning Design Blog | JF Knowledge Centre',
    description:
      'Read JF Knowledge Centre articles on custom eLearning, instructional design, learning technology and training strategy.',
    keywords:
      'JF Knowledge Centre blog, learning design articles, digital learning insights, corporate training blog, e-learning journal',
    path: '/blog',
  },
  'training-modules': {
    title: 'Training Modules | Compliance, Leadership and Onboarding',
    description:
      'Ready and custom training modules for compliance, leadership, onboarding, soft skills and storytelling, built for corporate learners.',
    keywords:
      'training modules, onboarding training, leadership programs, compliance training, soft skills modules, DEI learning',
    path: '/training-modules',
  },
  'training-delivery': {
    title: 'Training Delivery Services | VILT, ILT & Blended | JFKC',
    description:
      'Training delivery services for virtual instructor-led, classroom and blended programmes, run by JF Knowledge Centre for corporate teams.',
    keywords:
      'training delivery, interactive videos, micro-learning, online courses, blended learning, VILT training',
    path: '/training-delivery',
  },
  'immersive-learning': {
    title: 'Immersive Learning Solutions | Gamification & VR | JFKC',
    description:
      'Immersive learning solutions using gamification, branching scenarios, video-based and VR training to build real skills, not just knowledge.',
    keywords:
      'immersive learning, gamification, scenario-based learning, VR simulations, AR learning, custom learning games',
    path: '/immersive-learning',
  },
  'learning-technology': {
    title: 'LMS and Learning Technology Solutions | JFKC',
    description:
      'Learning technology solutions: LMS for corporate training, LXP, learning portals and integrations, including custom LMS development.',
    keywords:
      'learning technology, LMS platform, LXP expertise, learning portal, authoring tools, interactive video framework',
    path: '/learning-technology',
  },
};

export const getServiceSeo = (slug) => {
  const map = {
    'content-design': {
      title: 'Instructional Design | ILT, VILT and eLearning | JFKC',
      description:
        'Instructional design services for ILT, VILT and eLearning. JF Knowledge Centre turns your subject matter into courses people finish and apply.',
      keywords:
        'e-learning content design, instructional design services, custom e-learning development, interactive learning content, multimedia learning',
      path: '/services/content-design',
    },
    'recruitment-staffing': {
      title: 'Recruitment & Staff Augmentation | JF Knowledge Centre',
      description:
        'Recruitment, staffing and staff augmentation support from JF Knowledge Centre to help you hire the right talent at the right time.',
      keywords:
        'recruitment services, staffing solutions, staff augmentation, talent acquisition, workforce solutions, recruitment support',
      path: '/services/recruitment-staffing',
    },
    'it-assets-amc': {
      title: 'IT AMC and IT Asset Management Services | JFKC',
      description:
        'IT annual maintenance and asset management services from JF Knowledge Centre covering laptops, hardware and web support.',
      keywords:
        'IT asset management, IT AMC services, annual maintenance contract, IT infrastructure support, technology asset management',
      path: '/services/it-assets-amc',
    },
    'cpa-bookkeeping': {
      title: 'CPA Bookkeeping and Accounting Services | JFKC',
      description:
        'Bookkeeping and accounting services combining CPA expertise with AI-assisted workflows for clearer, faster financial reporting.',
      keywords:
        'CPA bookkeeping services, AI bookkeeping, outsourced bookkeeping, accounting services, financial reporting, bookkeeping automation',
      path: '/services/cpa-bookkeeping',
    },
    'data-translation-localization': {
      title: 'eLearning Translation and Localization | JFKC',
      description:
        'eLearning translation and localization services that adapt courses, voice-overs and on-screen text for global learners, plus data annotation support.',
      keywords:
        'data translation services, content localization, translation services, multilingual content, global localization, international content',
      path: '/services/data-translation-localization',
    },
    'digital-marketing': {
      title: 'Digital Marketing Services | SEO and SMO | JFKC',
      description:
        'Digital marketing services from JF Knowledge Centre covering SEO, social media optimization and performance campaigns.',
      keywords:
        'digital marketing services, SEO services, content marketing, online marketing, digital strategy, business visibility',
      path: '/services/digital-marketing',
    },
    'elearning-digital-innovation': {
      title: 'Custom eLearning Development | Microlearning, Gamification',
      description:
        'Custom eLearning development services: microlearning, gamification, video-based and mobile learning built around your business goals.',
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
      title: 'BFSI & Fintech Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for BFSI & Fintech teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'BFSI e-learning, fintech training, banking compliance training, financial services learning, risk management training, digital banking education',
      path: '/portfolio/bfsi-fintech',
    },
    'retail-fmcg-ecommerce': {
      title: 'Retail, FMCG & eCommerce Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Retail, FMCG & eCommerce teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'retail training, FMCG training, e-commerce training, product knowledge training, retail employee learning, sales training',
      path: '/portfolio/retail-fmcg-ecommerce',
    },
    'logistics-supply-chain': {
      title: 'Logistics & Supply Chain Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Logistics & Supply Chain teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'logistics training, supply chain training, warehouse operations learning, inventory management, distribution training, safety training',
      path: '/portfolio/logistics-supply-chain',
    },
    'corporate-enterprises': {
      title: 'Corporate & Enterprise Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Corporate & Enterprise teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'corporate training, enterprise learning, leadership training, compliance education, onboarding programs, role-based upskilling',
      path: '/portfolio/corporate-enterprises',
    },
    'healthcare-pharma': {
      title: 'Healthcare & Pharma Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Healthcare & Pharma teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'healthcare training, pharma learning, patient care training, clinical education, compliance training, medical sales enablement',
      path: '/portfolio/healthcare-pharma',
    },
    'aviation-airlines': {
      title: 'Aviation & Airline Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Aviation & Airline teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'aviation training, airline learning, aircraft safety training, customer service training, crew education, airline operations',
      path: '/portfolio/aviation-airlines',
    },
    'automobiles-manufacturing': {
      title: 'Automotive and Manufacturing Training | JFKC',
      description:
        'Custom eLearning and training for Automotive & Manufacturing teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'automotive training, manufacturing learning, assembly training, quality assurance, maintenance training, factory safety',
      path: '/portfolio/automobiles-manufacturing',
    },
    'oil-gas': {
      title: 'Oil, Gas & Energy Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Oil, Gas & Energy teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'oil and gas training, energy learning, rig safety training, hazardous materials training, emergency response education',
      path: '/portfolio/oil-gas',
    },
    'it-business-intelligence': {
      title: 'IT and Business Intelligence Training | JFKC',
      description:
        'Custom eLearning and training for IT & Business Intelligence teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'IT training, business intelligence learning, data analytics training, cybersecurity education, cloud learning, continuous learning',
      path: '/portfolio/it-business-intelligence',
    },
    'universities-edtech': {
      title: 'University & EdTech Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for University & EdTech teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'university training, EdTech learning, LMS integration, AI personalization, higher education learning, digital learning platform',
      path: '/portfolio/universities-edtech',
    },
    'hospitality-tourism': {
      title: 'Hospitality & Tourism Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Hospitality & Tourism teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'hospitality training, tourism learning, guest experience training, hotel service standards, travel staff education',
      path: '/portfolio/hospitality-tourism',
    },
    'telecommunications': {
      title: 'Telecom Training & eLearning | JFKC',
      description:
        'Custom eLearning and training for Telecom teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'telecommunications training, network learning, customer support training, telecom product education, field team skills',
      path: '/portfolio/telecommunications',
    },
    'government-public-sector': {
      title: 'Government and Public Sector Training | JFKC',
      description:
        'Custom eLearning and training for Government & Public Sector teams: role-based courses, compliance and skills programmes by JF Knowledge Centre.',
      keywords:
        'government training, public sector learning, citizen service training, compliance education, public policy learning',
      path: '/portfolio/government-public-sector',
    },
  };

  return map[slug] || seo.portfolio;
};
