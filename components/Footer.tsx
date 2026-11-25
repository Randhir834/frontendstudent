'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SITE_CONFIG, getMailtoLink, getPhoneLink } from '@/lib/siteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Adjust for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
            
            {/* Company Info - Column 1 */}
            <div className="space-y-5">
              <div>
                <Image
                  width={100}
                  height={100}
                  src="/logo.jpg"
                  alt={`${SITE_CONFIG.business.name} - Online Classes for Kids`}
                  className="h-12 sm:h-14 w-auto object-contain mb-4"
                />
                <p className="text-gray-400 text-sm leading-relaxed">
                  {SITE_CONFIG.business.description}
                </p>
              </div>
              
              {/* Social Links */}
              <div>
                <h4 className="text-white font-bold mb-3 text-sm">Stay Connected</h4>
                <div className="flex gap-3">
                  {SITE_CONFIG.social.instagram && (
                    <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-all hover:scale-110 active:scale-95" aria-label="Instagram">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                  {SITE_CONFIG.social.facebook && (
                    <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110 active:scale-95" aria-label="Facebook">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links - Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-4 text-base">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#courses" 
                    onClick={(e) => scrollToSection(e, 'courses')}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-pink-500 transition-colors"></span>
                    Explore Courses
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    onClick={(e) => scrollToSection(e, 'about')}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-pink-500 transition-colors"></span>
                    About Us
                  </a>
                </li>
                <li>
                  <a 
                    href="#trial" 
                    onClick={(e) => scrollToSection(e, 'trial')}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-pink-500 transition-colors"></span>
                    Free Trial
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-pink-500 transition-colors"></span>
                    Student Login
                  </Link>
                </li>
                <li>
                  <a href="https://instructor.playfit.com" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-pink-500 transition-colors"></span>
                    Become an Instructor
                  </a>
                </li>
              </ul>
            </div>

            {/* Courses - Column 3 */}
            <div>
              <h4 className="text-white font-bold mb-4 text-base">Popular Courses</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/course/24"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-purple-500 transition-colors"></span>
                    Public Speaking
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/course/28"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-purple-500 transition-colors"></span>
                    Phonics - Intermediate
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/course/30"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-purple-500 transition-colors"></span>
                    Grammar - Basic
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/course/29"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-purple-500 transition-colors"></span>
                    Spell Bee
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/courses"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-purple-500 transition-colors"></span>
                    View All Courses
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Legal - Column 4 */}
            <div>
              <h4 className="text-white font-bold mb-4 text-base">Get in Touch</h4>
              <ul className="space-y-4">
                <li>
                  <a href={getMailtoLink()} className="text-gray-400 hover:text-white transition-colors text-sm flex items-start gap-3 group">
                    <Mail className="w-5 h-5 text-purple-500 group-hover:text-pink-500 transition-colors flex-shrink-0 mt-0.5" />
                    <span>{SITE_CONFIG.contact.email}</span>
                  </a>
                </li>
                <li>
                  <a href={getPhoneLink()} className="text-gray-400 hover:text-white transition-colors text-sm flex items-start gap-3 group">
                    <Phone className="w-5 h-5 text-purple-500 group-hover:text-pink-500 transition-colors flex-shrink-0 mt-0.5" />
                    <span>{SITE_CONFIG.contact.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <div className="text-gray-400 text-sm flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white mb-1">🌍 Serving Students Worldwide</div>
                      <div>
                        <strong>Headquarters:</strong><br />
                        {SITE_CONFIG.address.street},<br />
                        {SITE_CONFIG.address.street2},<br />
                        {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.postalCode}, India
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              {/* Legal Links */}
              <div className="mt-6">
                <h4 className="text-white font-bold mb-3 text-sm">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-400 text-center">
              © {currentYear} {SITE_CONFIG.business.name}. Built by{' '}
              <a 
                href={SITE_CONFIG.credits.developedByUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors underline"
              >
                {SITE_CONFIG.credits.developedBy}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
