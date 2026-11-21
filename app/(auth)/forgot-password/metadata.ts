import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password – Reset Your PlayFit Account',
  description: 'Reset your PlayFit account password securely. Enter your email to receive password reset instructions.',
  openGraph: {
    title: 'Forgot Password – Reset Your PlayFit Account',
    description: 'Reset your account password securely and regain access to your courses.',
    url: 'https://playfitclasses.com/forgot-password',
    type: 'website',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forgot Password – Reset Your PlayFit Account',
    description: 'Reset your password securely.',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: '/forgot-password',
  },
  robots: {
    index: false,
    follow: true,
  },
};
