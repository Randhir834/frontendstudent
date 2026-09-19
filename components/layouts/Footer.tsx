'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src="/logo.jpg" alt="Playfit" className="h-8 w-auto" />
            </Link>
            <h3 className="text-base font-semibold text-white pt-2">Your Learning Adventure</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Playfit brings courses, live classes, interactive learning, and more exciting features into one beautiful learning platform for students worldwide.
            </p>
            <div className="pt-2">
              <Link href="/login" className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Student Login
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-5">Menu</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#courses" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#updates" className="text-sm text-gray-400 hover:text-white transition-colors">Updates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-5">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#roadmap" className="text-sm text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
              <li><Link href="#support" className="text-sm text-gray-400 hover:text-white transition-colors">Customer portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-800">
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-400 text-center">
              © 2026 Playfit Classes. Built by{' '}
              <a 
                href="https://devcastle.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors underline"
              >
                DevCastle.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
