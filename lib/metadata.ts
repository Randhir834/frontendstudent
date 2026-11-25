import { Metadata } from 'next';

const baseUrl = 'https://playfitclasses.com';
const siteName = 'Playfit Classes';
const defaultDescription = 'Live online skill development courses for children aged 4-10 worldwide. Learn Art, Chess, Piano, Public Speaking, Phonics, and more with expert instructors from India. Join students from 15+ countries.';

export const generatePageMetadata = ({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata => {
  const fullTitle = `${title} | ${siteName}`;
  const metaDescription = description || defaultDescription;
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/logo.jpg`;

  return {
    title: fullTitle,
    description: metaDescription,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: url,
      siteName,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: path,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};

// Pre-defined metadata for common pages
import { SITE_CONFIG } from './siteConfig';

export const homeMetadata = generatePageMetadata({
  title: 'Online Courses for Kids | Art, Chess, Piano, Abacus & More',
  description: `Live online skill development courses for children aged ${SITE_CONFIG.audience.ageRange} worldwide. Join ${SITE_CONFIG.stats.students} students from 15+ countries learning Art, Chess, Piano, Phonics, Public Speaking, Abacus, and more with expert instructors from India.`,
  path: '/',
});

export const loginMetadata = generatePageMetadata({
  title: 'Student Login - Access Your Learning Dashboard',
  description: 'Login to your Playfit Classes student account. Access live courses, track progress, and continue your learning journey.',
  path: '/login',
  noIndex: true,
});

export const registerMetadata = generatePageMetadata({
  title: 'Register Student Account - Join Today',
  description: `Create your free student account and join ${SITE_CONFIG.stats.students} learners. Start learning Art, Chess, Piano, and more with expert instructors.`,
  path: '/register',
});

export const coursesMetadata = generatePageMetadata({
  title: 'Browse All Courses - Find Your Perfect Class',
  description: 'Explore 8+ skill development courses for ages 4-10 available worldwide. From Art & Drawing to Chess, Piano, Public Speaking, Phonics, and more. Find the perfect online class for your child.',
  path: '/student/courses',
});

export const dashboardMetadata = generatePageMetadata({
  title: 'Student Dashboard - Your Learning Hub',
  description: 'Access your enrolled courses, track progress, view upcoming live classes, and manage your learning journey.',
  path: '/student',
  noIndex: true,
});

export const profileMetadata = generatePageMetadata({
  title: 'Student Profile - Manage Your Account',
  description: 'Update your profile, view achievements, manage account settings, and track your learning milestones.',
  path: '/student/profile',
  noIndex: true,
});

export const liveClassesMetadata = generatePageMetadata({
  title: 'Live Classes - Interactive Online Learning',
  description: 'Join interactive live classes with expert instructors. Real-time learning, Q&A sessions, and personalized feedback.',
  path: '/student/live-classes',
  noIndex: true,
});

export const myCoursesMetadata = generatePageMetadata({
  title: 'My Enrolled Courses - Continue Learning',
  description: 'Access all your enrolled courses, track completion, view lessons, and continue your learning journey.',
  path: '/student/my-courses',
  noIndex: true,
});

export const certificatesMetadata = generatePageMetadata({
  title: 'My Certificates - Achievements & Awards',
  description: 'View and download your course completion certificates. Showcase your achievements and earned credentials.',
  path: '/student/certificates',
  noIndex: true,
});

export const forgotPasswordMetadata = generatePageMetadata({
  title: 'Forgot Password - Reset Your Account',
  description: 'Reset your Playfit Classes account password. Enter your email to receive password reset instructions.',
  path: '/forgot-password',
  noIndex: true,
});
