import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Enrolled Courses | Playfit Classes - Continue Learning',
  description: 'Access your enrolled courses, track progress, continue lessons, and manage your learning journey at Playfit Classes.',
  keywords: ['my courses', 'enrolled courses', 'my classes', 'continue learning', 'course progress'],
  openGraph: {
    title: 'My Enrolled Courses | Playfit Classes',
    description: 'Access and continue your learning journey',
    url: 'https://playfitclasses.com/student/my-courses',
    type: 'website',
  },
  alternates: {
    canonical: 'https://playfitclasses.com/student/my-courses',
  },
  robots: {
    index: false, // Private user content
    follow: true,
  },
};
