export type Lang = 'es' | 'en';

export const translations = {
  es: {
    // Navbar
    nav: {
      home: 'Inicio',
      about: 'Sobre Mí / CV',
      projects: 'Proyectos',
      blog: 'Blog',
      contact: 'Contacto',
      availableForHire: 'Disponible para trabajar',
    },
    // Footer
    footer: {
      rights: 'Todos los derechos reservados.',
    },
    // Index page
    index: {
      viewProjects: 'VER PROYECTOS',
      aboutMe: 'SOBRE MÍ',
      title: 'Portafolio Creativo Inmersivo',
    },
    // About page
    about: {
      title: 'Sobre Mí',
      downloadCv: 'Descargar CV',
      trajectory: 'Mi Trayectoria',
      education: 'Educación',
      serviceUiTitle: 'UI/UX Design',
      serviceUiDesc:
        'Creación de interfaces estéticas, interactivas y centradas en el usuario, optimizando flujos de experiencia e identidad visual digital.',
      serviceFrontendTitle: 'Frontend Development',
      serviceFrontendDesc:
        'Desarrollo de lógica cliente limpia utilizando frameworks reactivos rápidos. Especialista en optimizaciones de Core Web Vitals.',
      noTrajectory: 'No se cargó información de trayectoria laboral.',
      noEducation: 'No se cargó información de educación.',
      metaTitle: 'Sobre Mí',
    },
    // Projects page
    projects: {
      title: 'Proyectos',
      subtitle:
        'Explora mi portafolio de ingeniería de software, interfaces inmersivas e identidad de marca.',
      noProjects: 'No se encontraron proyectos publicados en este momento.',
      metaTitle: 'Proyectos Creativos',
      metaDescription:
        'Explora mi portafolio de proyectos de ingeniería de software, interfaces web interactivas, desarrollo frontend y diseño de producto digital.',
    },
    // Contact page
    contact: {
      title: 'CONTÁCTAME',
      subtitle: 'Trabajemos Juntos',
      metaTitle: 'Contacto',
    },
    // CV Sidebar
    cv: {
      coreSkills: 'Core Skills',
      tools: 'Herramientas',
      languages: 'Idiomas',
    },
    // 404
    notFound: {
      title: '404',
      message: 'Página no encontrada',
    },
  },

  en: {
    // Navbar
    nav: {
      home: 'Home',
      about: 'About / CV',
      projects: 'Projects',
      blog: 'Blog',
      contact: 'Contact',
      availableForHire: 'Available for hire',
    },
    // Footer
    footer: {
      rights: 'All rights reserved.',
    },
    // Index page
    index: {
      viewProjects: 'VIEW PROJECTS',
      aboutMe: 'ABOUT ME',
      title: 'Immersive Creative Portfolio',
    },
    // About page
    about: {
      title: 'About Me',
      downloadCv: 'Download CV',
      trajectory: 'My Journey',
      education: 'Education',
      serviceUiTitle: 'UI/UX Design',
      serviceUiDesc:
        'Crafting aesthetic, interactive, and user-centered interfaces that optimize experience flows and digital visual identity.',
      serviceFrontendTitle: 'Frontend Development',
      serviceFrontendDesc:
        'Building clean client-side logic using fast reactive frameworks. Specialist in Core Web Vitals optimizations.',
      noTrajectory: 'No work experience data loaded.',
      noEducation: 'No education data loaded.',
      metaTitle: 'About Me',
    },
    // Projects page
    projects: {
      title: 'Projects',
      subtitle:
        'Explore my portfolio of software engineering, immersive interfaces and brand identity.',
      noProjects: 'No published projects found at this time.',
      metaTitle: 'Creative Projects',
      metaDescription:
        'Explore my portfolio of software engineering projects, interactive web interfaces, frontend development and digital product design.',
    },
    // Contact page
    contact: {
      title: 'GET IN TOUCH',
      subtitle: "Let's Collaborate",
      metaTitle: 'Contact',
    },
    // CV Sidebar
    cv: {
      coreSkills: 'Core Skills',
      tools: 'Tools',
      languages: 'Languages',
    },
    // 404
    notFound: {
      title: '404',
      message: 'Page not found',
    },
  },
} as const;
