// Nombres, textos, imágenes y destinos públicos se editan aquí.
// Solo agregar URLs y canales confirmados por el equipo.
export const site = {
  title: 'Agronautas y proyectos del equipo',
  introduction:
    'Somos nueve emprendedores que crean proyectos de software y hardware para desafíos reales.',
  logo: null,
  contact: [
    {
      label: 'Llamar · +54 9 379 472-5842',
      url: 'tel:+5493794725842',
    },
    {
      label: 'WhatsApp · +54 9 379 472-5842',
      url: 'https://wa.me/5493794725842',
    },
  ],
}

export const projects = [
  {
    id: 'agronautas',
    name: 'Agronautas',
    shortDescription: 'Tecnología para el campo.',
    description:
      'Desarrollamos propuestas para el campo: monitoreo de las huertas de Jakaru Porá y exploración de herramientas para monitoreo ganadero y cerca electrónica. Está en desarrollo.',
    image: '/images/huertas.webp',
    imageAlt: 'Huerta verde con cultivos y un invernadero',
    links: [{ label: 'Ver proyecto', url: 'https://www.agronauta.com.ar/' }],
  },
  {
    id: 'jakaru-pora',
    name: 'Jakaru Porá',
    shortDescription: 'Seguimiento de las huertas.',
    description:
      'Una propuesta para acompañar el seguimiento de las huertas y observar cómo evolucionan los cultivos.',
    image: '/images/jakaru-sensor.webp',
    imageAlt:
      'Sensor genérico colocado en la tierra junto a plantas de huerta; imagen ilustrativa, no es un prototipo del equipo',
    links: [{ label: 'Ver proyecto', url: 'https://jakaru-pora-front.vercel.app/#/' }],
  },
  {
    id: 'tus',
    name: 'TUS',
    shortDescription: 'Personas y profesionales.',
    description:
      'Un espacio para acercar a las personas con profesionales según el servicio o la solución que necesitan.',
    image: '/images/tus.webp',
    imageAlt: 'Electricista revisando un tablero de control con un multímetro',
    links: [{ label: 'Ver proyecto', url: 'https://www.tusservicios.shop' }],
  },
  {
    id: 'pia',
    name: 'Pía',
    shortDescription: 'Turismo con IA.',
    description:
      'Una asistente turística con inteligencia artificial pensada para acompañar la exploración de destinos y experiencias.',
    image: '/images/pia.webp',
    imageAlt: 'Guía turística explicando un recorrido a un grupo de visitantes',
    links: [{ label: 'Ver proyecto', url: 'https://proyecto-paso.vercel.app/' }],
  },
  {
    id: 'medbot',
    name: 'Medbot',
    shortDescription: 'Medición de signos vitales.',
    description:
      'Una iniciativa que combina tecnología y cuidado para explorar la medición de signos vitales.',
    image: '/images/medbot.webp',
    imageAlt: 'Toma de presión arterial con un tensiómetro',
    links: [{ label: 'Ver proyecto', url: 'https://www.medbot.com.ar' }],
  },
  {
    id: 'tilo',
    name: 'Tilo',
    shortDescription: 'Compañía cotidiana.',
    description:
      'Un asistente de compañía pensado para acompañar a personas mayores en su vida cotidiana.',
    image: '/images/tilo.webp',
    imageAlt: 'Persona mayor sonriente usando una tableta en su hogar',
    links: [{ label: 'Ver proyecto', url: 'https://www.tilotech.com.ar' }],
  },
  {
    id: 'software-hardware',
    name: 'Desarrollo de software y hardware personalizado',
    shortDescription: 'Robótica, software y dispositivos a medida.',
    description:
      'Diseñamos y desarrollamos soluciones según las necesidades de cada proyecto, incluyendo aplicaciones, sistemas, dispositivos y robótica. Estamos abiertos a escuchar ideas, colaborar y desarrollar nuevos proyectos.',
    image: '/images/software.webp',
    imageAlt: 'Robot educativo armado con componentes electrónicos y sensores',
    links: [],
  },
]
