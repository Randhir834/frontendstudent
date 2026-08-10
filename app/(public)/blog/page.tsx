'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, BookOpen, Menu, X, Mail, Phone, Heart } from 'lucide-react';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 9,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const data = await blogService.getPublishedBlogs(params);
      setBlogs(data.blogs);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.location.href = `/#${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-200 safe-top shadow-lg shadow-purple-500/10">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1920px] mx-auto">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-16 lg:h-18 xl:h-20">
            <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
              <img
                src="/logo.jpg"
                alt="Playfit"
                className="h-7 sm:h-9 md:h-11 lg:h-13 xl:h-15 w-auto object-contain max-w-[100px] xs:max-w-[110px] sm:max-w-[130px] md:max-w-[160px] transition-transform hover:scale-105"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-5">
              <Link 
                href="/courses"
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </Link>
              <Link 
                href="/blog"
                className="text-xs lg:text-sm xl:text-base font-bold text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Blog
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></span>
              </Link>
              <a 
                href="/#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="/#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <Link href="/login" className="ml-1 lg:ml-2 xl:ml-3 px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white text-xs lg:text-sm xl:text-base font-bold rounded-full transition-all hover:scale-105 hover:shadow-xl whitespace-nowrap shadow-purple-500/40">
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-purple-50 rounded-lg transition-colors touch-target"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-200 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="px-3 sm:px-4 py-3 space-y-2 max-w-md mx-auto">
              <Link 
                href="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95"
              >
                Courses
              </Link>
              <Link 
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-sm font-bold text-purple-600 bg-purple-50 rounded-lg transition-all touch-target"
              >
                Blog
              </Link>
              <a 
                href="/#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                About
              </a>
              <a 
                href="/#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Contact
              </a>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-sm font-bold rounded-lg text-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all mt-2 touch-target shadow-lg shadow-purple-500/40 active:scale-95">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-12 xs:py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 relative overflow-hidden min-h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && blogs.length === 0 && (
            <div className="relative bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-lg max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl opacity-50"></div>
              <div className="relative text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BookOpen className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">No Blogs Found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search terms' : 'No blog posts available yet'}
                </p>
              </div>
            </div>
          )}

          {/* Blogs Grid */}
          {!loading && blogs.length > 0 && (
            <>
              <div className="mb-6 text-center">
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  Showing {blogs.length} of {total} article{total !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group"
                  >
                    <article className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                      {/* Featured Image */}
                      <div className="relative overflow-hidden h-56 sm:h-64">
                        {blog.featured_image_url ? (
                          <img
                            src={blog.featured_image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-purple-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col">
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(blog.publication_date)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                            {blog.excerpt}
                          </p>
                        )}

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:text-pink-600 transition-colors">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 sm:mt-12">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-5 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700 shadow-md hover:shadow-lg transition-all"
              >
                Previous
              </button>
              <span className="px-5 py-3 text-gray-700 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-5 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700 shadow-md hover:shadow-lg transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Enhanced with Color */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 sm:py-10 md:py-12 lg:py-16 safe-bottom relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
              {/* Brand Section */}
              <div>
                <Link href="/" className="inline-block mb-3 sm:mb-4">
                  <img
                    src="/logo.jpg"
                    alt="Playfit"
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                  />
                </Link>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  Empowering children with creative and skill-building courses in Art, Chess, Piano, Public Speaking, Abacus, and more.
                </p>
              </div>

              {/* Courses Section */}
              <div>
                <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                  Popular Courses
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><a href="/#courses" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🎨 Art & Drawing</a></li>
                  <li><a href="/#courses" className="text-xs sm:text-sm text-gray-300 hover:text-purple-400 transition-colors block py-1 hover:translate-x-1 transition-transform">♟️ Chess</a></li>
                  <li><a href="/#courses" className="text-xs sm:text-sm text-gray-300 hover:text-pink-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🎹 Piano</a></li>
                  <li><a href="/#courses" className="text-xs sm:text-sm text-gray-300 hover:text-green-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🎤 Public Speaking</a></li>
                  <li><a href="/#courses" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🧮 Abacus</a></li>
                </ul>
              </div>

              {/* Quick Links Section */}
              <div>
                <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                  Quick Links
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><Link href="/#about" className="text-xs sm:text-sm text-gray-300 hover:text-purple-400 transition-colors block py-1 hover:translate-x-1 transition-transform">About Us</Link></li>
                  <li><Link href="/#contact" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Contact Us</Link></li>
                  <li><Link href="/#trial" className="text-xs sm:text-sm text-gray-300 hover:text-pink-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Free Trial</Link></li>
                  <li><Link href="/login" className="text-xs sm:text-sm text-gray-300 hover:text-green-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Student Login</Link></li>
                  <li><a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Help Center</a></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div>
                <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
                  Contact Us
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-300 group">
                    <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                    <a href="mailto:cplayfit@gmail.com" className="break-all group-hover:text-blue-400 transition-colors">cplayfit@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 group">
                    <Phone className="w-4 h-4 flex-shrink-0 group-hover:text-green-400 transition-colors" />
                    <a href="tel:+918910484299" className="group-hover:text-green-400 transition-colors">+91 8910484299</a>
                  </li>
                </ul>
                
                {/* CTA Button */}
                <div className="mt-6">
                  <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 shadow-lg">
                    <Mail className="w-4 h-4" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                  © {new Date().getFullYear()} Playfit. All rights reserved. Made with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> for young learners.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-xs sm:text-sm">Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-xs sm:text-sm">Terms</a>
                  <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-xs sm:text-sm">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
