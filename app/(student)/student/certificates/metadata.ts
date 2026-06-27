import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Certificates | Playfit Classes - Achievements & Awards',
  description: 'View and download your course completion certificates. Showcase your achievements, skills mastered, and earned credentials.',
  keywords: ['certificates', 'course completion', 'achievements', 'credentials', 'awards', 'diplomas'],
  openGraph: {
    title: 'My Certificates | Playfit Classes',
    description: 'View your course completion certificates and achievements',
    url: 'https://playfitclasses.com/student/certificates',
    type: 'website',
  },
  alternates: {
    canonical: 'https://playfitclasses.com/student/certificates',
  },
  robots: {
    index: false,
    follow: true,
  },
};
