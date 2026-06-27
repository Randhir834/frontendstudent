import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Playfit Classes - Online Learning Platform for Kids',
    short_name: 'Playfit Classes',
    description: 'Live online skill development courses for children aged 8-18. Learn Art, Chess, Piano, Public Speaking, and more with expert instructors.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1E88E5',
    icons: [
      {
        src: '/favicon.png',
        sizes: '1254x1254',
        type: 'image/png',
      },
      {
        src: '/images/playfit-logo.jpg',
        sizes: '1254x1254',
        type: 'image/jpeg',
      },
    ],
    categories: ['education', 'kids', 'learning'],
  }
}
