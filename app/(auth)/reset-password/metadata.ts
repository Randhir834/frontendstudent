import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password – Create New Password',
  description: 'Create a new password for your PlayFit account. Secure your account and regain access to your courses.',
  alternates: {
    canonical: '/reset-password',
  },
  openGraph: {
    title: 'Reset Password – Create New Password | PlayFit',
    description: 'Create a new password for your PlayFit account.',
    url: 'https://playfitclasses.com/reset-password',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reset Password – Create New Password | PlayFit',
    description: 'Create a new password for your account.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: false,
    follow: true,
  },
};
