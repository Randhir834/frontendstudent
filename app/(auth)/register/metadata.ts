import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `Register for Online Classes – Join ${SITE_CONFIG.stats.students} Kids`,
  description: `Create your free ${SITE_CONFIG.business.name} account. Enroll in live online classes for Phonics, Art, Chess, Piano, Public Speaking, Abacus, Coding, and more. Ages ${SITE_CONFIG.audience.ageRange}.`,
  openGraph: {
    title: `Register for Online Classes – Join ${SITE_CONFIG.stats.students} Kids | ${SITE_CONFIG.business.name}`,
    description: `Create your free account and join thousands of kids learning new skills with live online classes. Ages ${SITE_CONFIG.audience.ageRange}.`,
    url: `${SITE_CONFIG.urls.main}/register`,
    type: 'website',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Register for Online Classes – Join ${SITE_CONFIG.stats.students} Kids | ${SITE_CONFIG.business.name}`,
    description: 'Create your free account and start learning with expert instructors today.',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: '/register',
  },
  robots: {
    index: false, // Don't index registration page
    follow: true,
  },
};
