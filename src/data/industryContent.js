// Additive copy for existing /portfolio/:slug pages. Rules: no competitor/brand names, no "best/first"
// claims, no stats, no testimonials, no promised outcomes. Facts only come from what jfknowledge.com
// already says (industries.js, services.js, /immersive-learning, /training-modules, /training-delivery).
export const industryContent = {
  'healthcare-pharma': {
    heading: 'What we build for Healthcare & Pharma teams',
    intro: [
      'Healthcare and pharmaceutical teams have to keep learning: procedures change, medical knowledge is updated and field teams need to explain products clearly. JF Knowledge Centre designs custom eLearning for continuing medical education (CME), clinical and compliance training, and sales enablement.',
      'Every programme starts from your own source material: your protocols, product information and policies, reviewed by your subject-matter experts. We shape that material into modules people can complete between shifts or visits.',
    ],
    topicsTitle: 'Typical training topics',
    topics: [
      'Clinical and procedural training, from step-by-step walkthroughs to refreshers',
      'Patient-care communication and everyday practice',
      'Compliance and policy training for clinical and non-clinical staff',
      'Medical updates and continuing medical education (CME)',
      'Pharmacology and disease-management learning',
      'Product knowledge and sales-representative enablement',
    ],
    formatsTitle: 'Formats we use',
    formats: [
      'Interactive eLearning modules with knowledge checks',
      'Micro-learning for short, focused updates',
      'Scenario-based and simulation learning for decisions and procedures',
      'Explainer, demo and training video',
      'Virtual instructor-led training (VILT) material',
    ],
    note: 'Our modules support training. Clinical, regulatory and legal content is supplied and approved by your own experts and does not replace professional or regulatory guidance.',
    faqs: [
      {
        q: 'Can you build eLearning from our existing clinical or product material?',
        a: 'Yes. Most projects start with the documents, slides, protocols or recordings you already have. We organise the content, design the learning activities and build the modules, and your subject-matter experts review each stage.',
      },
      {
        q: 'Do you create CME-style training for healthcare professionals?',
        a: 'We build the learning content and assessments for continuing education programmes. Accreditation and credit decisions stay with the relevant accrediting body and your organisation.',
      },
      {
        q: 'Can the training be used inside our own learning management system?',
        a: 'Our content is designed to be mobile-first and LMS-ready. If you do not have a platform yet, JF Knowledge Centre can also discuss delivery options with you.',
      },
      {
        q: 'Do you also train pharma sales teams?',
        a: 'Yes. Sales-enablement modules cover product knowledge, disease areas and conversation practice using scenarios, built from approved product information that you provide.',
      },
    ],
  },
  'bfsi-fintech': {
    heading: 'What we build for BFSI & Fintech teams',
    intro: [
      'Banking, insurance and fintech teams train on topics that change often: regulations, products, risk and digital channels. JF Knowledge Centre creates custom eLearning for compliance, product and risk training, digital banking, and case-study and simulation-based learning.',
      'We work from your policies, product documents and procedures, and your compliance or business teams approve the content before it goes live.',
    ],
    topicsTitle: 'Typical training topics',
    topics: [
      'Compliance and regulatory awareness for staff and new joiners',
      'Product training for banking, insurance and fintech offerings',
      'Risk and control awareness',
      'Digital banking and customer-journey learning',
      'Blockchain and emerging-technology fundamentals',
      'Financial-expertise case studies and interactive simulations',
    ],
    formatsTitle: 'Formats we use',
    formats: [
      'Interactive eLearning modules with assessments',
      'Scenario-based learning and branching case studies',
      'Micro-learning refreshers for policy and product changes',
      'Gamified quizzes for knowledge reinforcement',
      'Explainer and instructional video',
    ],
    note: 'Regulatory and policy content is provided and approved by your own compliance team. Our training does not replace legal or regulatory advice.',
    faqs: [
      {
        q: 'Can you build compliance training for our organisation?',
        a: 'Yes. We turn your policies and procedures into role-based modules with scenarios and assessments. Your compliance team supplies and signs off the content.',
      },
      {
        q: 'Can you update modules when a policy or product changes?',
        a: 'Yes. Micro-learning modules are quick to revise, so a single policy or product change does not require rebuilding a full course. Agree the update process when we scope the project.',
      },
      {
        q: 'Do you build simulations and case studies for finance roles?',
        a: 'Yes. We design case studies and interactive simulations that let learners practise decisions in a safe setting, based on scenarios your team provides.',
      },
      {
        q: 'How do we start?',
        a: 'Contact us with a short description of the audience and topics. We will discuss scope, review your source material and propose a plan.',
      },
    ],
  },
  'corporate-enterprises': {
    heading: 'What we build for Corporate & Enterprise teams',
    intro: [
      'Larger organisations need training that reaches many people consistently: onboarding, compliance, leadership and role-based upskilling. JF Knowledge Centre builds custom eLearning that scales across teams and locations.',
      'We start with your learning goals and existing content, then design modules around the roles and tasks your people actually perform.',
    ],
    topicsTitle: 'Typical training topics',
    topics: [
      'New-hire onboarding and induction',
      'Compliance and policy training',
      'Leadership and people-management skills',
      'Soft skills such as communication, teamwork and time management',
      'Role-based upskilling for specific functions',
      'Process and systems training for internal tools',
    ],
    formatsTitle: 'Formats we use',
    formats: [
      'Custom eLearning from foundational to advanced levels',
      'Virtual instructor-led training (VILT) material',
      'Micro-learning nuggets for on-the-job reference',
      'Simulations and scenario-based learning',
      'Training and how-to video',
    ],
    note: '',
    faqs: [
      {
        q: 'Can you localise training for teams in different countries?',
        a: 'Yes. JF Knowledge Centre also offers translation and localisation, so courses can be adapted for different languages and regions. Tell us the audiences and languages when you contact us.',
      },
      {
        q: 'Should we buy off-the-shelf courses or build custom ones?',
        a: 'It depends on how specific the topic is to your organisation. Our guide on custom versus off-the-shelf training explains the trade-offs, and we are happy to talk through your case.',
      },
      {
        q: 'Can you work with our existing LMS?',
        a: 'Our content is designed to be LMS-ready. Share which platform you use and we will confirm the delivery format during scoping.',
      },
      {
        q: 'Can you train managers and leaders as well as frontline staff?',
        a: 'Yes. Leadership and soft-skills modules use scenarios and exercises so learners can practise conversations before they happen at work.',
      },
    ],
  },
};
