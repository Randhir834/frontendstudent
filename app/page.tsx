'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Award, TrendingUp, Mail, Phone, Sparkles, Zap, Heart, Target } from 'lucide-react';
import { contactService } from '@/services/contactService';
import CourseRecommendationSection from '@/components/CourseRecommendation/CourseRecommendationSection';
import CoursesSection from '@/components/CoursesSection/CoursesSection';
import WriteReview from '@/components/WriteReview';
import ReviewsSection from '@/components/ReviewsSection';

export default function Home() {
  const [formData, setFormData] = useState({ 
    parentName: '', 
    childName: '', 
    email: '', 
    phone: '', 
    courseInterest: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu if open
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

  // Community grid animation logic
  useEffect(() => {
    const animateRandomBoxes = () => {
      if (!gridRef.current) return;
      
      const boxes = gridRef.current.querySelectorAll('.community-grid-item');
      const animations = [
        'animate-light-orange',
        'animate-medium-orange', 
        'animate-dark-orange',
        'animate-amber',
        'animate-gold',
        'animate-yellow',
        'animate-peach',
        'animate-tangerine'
      ];
      
      let activeBoxes = new Set<number>(); // Track currently active boxes
      
      // Function to maintain 7-8 active boxes at all times
      const maintainActiveBoxes = () => {
        const targetCount = 7 + Math.floor(Math.random() * 2); // 7 or 8 boxes
        
        // Remove some boxes randomly to make room for new ones
        if (activeBoxes.size > 0) {
          const boxesToRemove = Math.floor(Math.random() * 3) + 1; // Remove 1-3 boxes
          const activeArray = Array.from(activeBoxes);
          
          for (let i = 0; i < Math.min(boxesToRemove, activeArray.length); i++) {
            const randomActiveIndex = Math.floor(Math.random() * activeArray.length);
            const boxIndex = activeArray.splice(randomActiveIndex, 1)[0] as number;

            // Remove animation from box
            animations.forEach(anim => {
              boxes[boxIndex]?.classList.remove(anim);
            });
            activeBoxes.delete(boxIndex);
          }
        }
        
        // Add new boxes to reach target count
        while (activeBoxes.size < targetCount) {
          let randomIndex;
          let attempts = 0;
          
          // Find available box (not currently active)
          do {
            randomIndex = Math.floor(Math.random() * 64);
            attempts++;
            if (attempts > 100) break; // Prevent infinite loop
          } while (activeBoxes.has(randomIndex));
          
          if (attempts <= 100) {
            // Assign a color that's not currently in use (when possible)
            const usedAnimations = Array.from(activeBoxes).map(index => {
              const box = boxes[index as number];
              return animations.find(anim => box.classList.contains(anim));
            }).filter(Boolean);
            
            const availableAnimations = animations.filter(anim => !usedAnimations.includes(anim));
            const animationToUse = availableAnimations.length > 0 
              ? availableAnimations[Math.floor(Math.random() * availableAnimations.length)]
              : animations[Math.floor(Math.random() * animations.length)];
            
            boxes[randomIndex]?.classList.add(animationToUse);
            activeBoxes.add(randomIndex);
            
            // Schedule removal of this animation
            setTimeout(() => {
              boxes[randomIndex]?.classList.remove(animationToUse);
              activeBoxes.delete(randomIndex);
            }, 2400 + Math.random() * 1200); // Remove after 2.4-3.6s
          }
        }
      };
      
      // Initial setup
      maintainActiveBoxes();
      
      // Set up interval to continuously refresh the animation
      const interval = setInterval(maintainActiveBoxes, 800); // Update every 0.8 seconds
      
      return () => clearInterval(interval);
    };
    
    const cleanup = animateRandomBoxes();
    return cleanup;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactService.submitContact({
        parentName: formData.parentName,
        childName: formData.childName,
        phone: formData.phone,
        email: formData.email,
        courseInterest: formData.courseInterest,
        message: formData.message,
        type: 'trial' // This form is primarily for trial requests
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ 
          parentName: '', 
          childName: '', 
          email: '', 
          phone: '', 
          courseInterest: '',
          message: ''
        });
      }, 5000);
    } catch (err: unknown) {
      console.error('Error submitting contact form:', err);
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to submit form. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Fixed Premium Header - Fully Responsive */}
      <header className="sticky top-0 z-50 bg-white backdrop-blur-xl border-b border-gray-100 safe-top shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center flex-shrink-0 transition-opacity hover:opacity-80">
              <img
                src="/logo.jpg"
                alt="Playfit"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/courses"
                className="px-4 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-purple-600 transition-all relative group cursor-pointer"
              >
                Courses
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
              <Link 
                href="/blog"
                className="px-4 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-purple-600 transition-all relative group cursor-pointer"
              >
                Blog
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="px-4 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-purple-600 transition-all relative group cursor-pointer"
              >
                About
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="px-4 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-purple-600 transition-all relative group cursor-pointer"
              >
                Contact
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </a>
              <a 
                href="#trial" 
                onClick={(e) => scrollToSection(e, 'trial')}
                className="px-4 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-purple-600 transition-all relative group cursor-pointer"
              >
                Free Trial
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </a>
              <Link 
                href="/login" 
                className="ml-3 px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white text-[15px] font-semibold rounded-full transition-all hover:shadow-lg shadow-purple-500/20 duration-300"
              >
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-xl">
            <nav className="px-4 py-3 space-y-1 max-w-md mx-auto">
              <Link 
                href="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-[15px] font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                Courses
              </Link>
              <Link 
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-[15px] font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                Blog
              </Link>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="block py-3 px-4 text-[15px] font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                About
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="block py-3 px-4 text-[15px] font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                Contact
              </a>
              <a 
                href="#trial" 
                onClick={(e) => scrollToSection(e, 'trial')}
                className="block py-3 px-4 text-[15px] font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                Free Trial
              </a>
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-[15px] font-semibold rounded-xl text-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all mt-2 shadow-lg shadow-purple-500/30"
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Fixed Responsive Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-pink-400/8 to-orange-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 lg:space-y-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/20">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 flex-shrink-0" />
                <span className="text-sm font-semibold text-white">Trusted by 5,000+ Students</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.15] tracking-tight pb-2">
                  Transform Your{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 pb-1">
                    Learning Journey
                  </span>
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-normal max-w-2xl">
                  Interactive <span className="text-blue-600 font-semibold">live classes</span> in Art, Chess, Piano, Public Speaking, and more. Designed for students passionate about learning.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="#courses"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-base font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Courses
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </a>
                <a 
                  href="#trial"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-base font-semibold rounded-xl hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Start Free Trial
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                {[
                  { number: "5,000+", label: "Active Students", gradient: "from-blue-600 to-purple-600" },
                  { number: "9+", label: "Skill Courses", gradient: "from-purple-600 to-pink-600" },
                  { number: "4.9", label: "Parent Rating", gradient: "from-orange-600 to-pink-600", icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" /> }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      {stat.icon}
                      <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.number}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium whitespace-nowrap">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Fixed Feature Cards */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {[
                { icon: Users, title: "Live Classes", desc: "Interactive sessions with expert instructors", color: "from-blue-500 to-blue-600", badge: "Live Now", badgeIcon: "pulse" },
                { icon: Sparkles, title: "AI Learning", desc: "Personalized recommendations for every student", color: "from-purple-500 to-purple-600", badge: "Smart", badgeIcon: "sparkle" },
                { icon: BookOpen, title: "Practice Tests", desc: "Master skills with interactive exercises", color: "from-pink-500 to-pink-600", badge: "Interactive", badgeIcon: "target" },
                { icon: TrendingUp, title: "Progress Tracker", desc: "Monitor growth with detailed analytics", color: "from-orange-500 to-orange-600", badge: "Track", badgeIcon: "trophy" }
              ].map((feature, i) => (
                <div key={i} className={`group bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]`}>
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/25 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 group-hover:scale-105 group-hover:bg-white/35 transition-all duration-300 flex-shrink-0">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 lg:mb-3 leading-tight">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-3 sm:mb-4">{feature.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 self-start">
                    {feature.badgeIcon === "pulse" && <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>}
                    {feature.badgeIcon === "sparkle" && <Sparkles className="w-3 h-3 text-white flex-shrink-0" />}
                    {feature.badgeIcon === "target" && <Target className="w-3 h-3 text-white flex-shrink-0" />}
                    {feature.badgeIcon === "trophy" && <Trophy className="w-3 h-3 text-white flex-shrink-0" />}
                    <span className="text-xs font-semibold text-white whitespace-nowrap">{feature.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - PREMIUM WORLD-CLASS RESPONSIVE DESIGN */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Premium Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] bg-gradient-to-tr from-pink-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-5 sm:mb-6 lg:mb-8 border border-white/20">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300 flex-shrink-0" />
              <span className="text-sm font-bold text-white whitespace-nowrap">Trusted Worldwide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 sm:mb-5 lg:mb-6 leading-tight px-4">
              Join The Learning
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent pb-2 leading-[1.15]">
                Revolution
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto font-medium px-4">
              Thousands of students are already mastering new skills with our world-class platform
            </p>
          </div>

          {/* Premium Stats Grid - Fully Responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
            {[
              { 
                number: "5,000+", 
                label: "Happy Students", 
                subtext: "Learning Daily", 
                gradient: "from-cyan-400 via-blue-400 to-blue-500", 
                icon: "👨‍🎓",
                iconBg: "from-cyan-500 to-blue-500"
              },
              { 
                number: "50+", 
                label: "Expert Instructors", 
                subtext: "Certified & Trained", 
                gradient: "from-pink-400 via-rose-400 to-rose-500", 
                icon: "👩‍🏫",
                iconBg: "from-pink-500 to-rose-500"
              },
              { 
                number: "9+", 
                label: "Skill Courses", 
                subtext: "And Growing", 
                gradient: "from-amber-400 via-orange-400 to-orange-500", 
                icon: "📚",
                iconBg: "from-amber-500 to-orange-500"
              },
              { 
                number: "98%", 
                label: "Satisfaction", 
                subtext: "Parent Approved", 
                gradient: "from-emerald-400 via-green-400 to-green-500", 
                icon: "⭐",
                iconBg: "from-emerald-500 to-green-500"
              }
            ].map((stat, i) => (
              <div key={i} className="group relative">
                {/* Premium Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500`}></div>
                
                {/* Premium Card - Fully Responsive */}
                <div className="relative bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden">
                  {/* Decorative Gradient Corner */}
                  <div className={`absolute -top-10 -right-10 sm:-top-12 sm:-right-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full`}></div>
                  
                  {/* Icon with Premium Background */}
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className={`inline-flex w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.iconBg} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0`}>
                      <span className="text-2xl sm:text-3xl lg:text-4xl filter drop-shadow-lg">{stat.icon}</span>
                    </div>
                  </div>
                  
                  {/* Number with Premium Gradient */}
                  <div className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 sm:mb-2.5 lg:mb-3 leading-tight pb-2`}>
                    {stat.number}
                  </div>
                  
                  {/* Label - Responsive Text */}
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 leading-tight">
                    {stat.label}
                  </div>
                  
                  {/* Subtext - Responsive */}
                  <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section - All Available Courses */}
      <CoursesSection />

      {/* Find Your Best Courses Section */}
      <CourseRecommendationSection />

      {/* How It Works - WORLD-CLASS PREMIUM RESPONSIVE DESIGN */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-6 sm:mb-8 border border-white/20 shadow-xl">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-sm font-bold whitespace-nowrap">Simple 3-Step Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-5 lg:mb-6 leading-tight px-4">
              Getting Started Is{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-1 leading-[1.2]">
                  Super Easy
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-50"></span>
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto font-medium px-4">
              Join thousands of students in just 3 simple steps
            </p>
          </div>

          {/* Premium Steps Grid - Fully Responsive */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-10 xl:gap-12 relative">
            {/* Premium Connection Line - Hidden on mobile */}
            <div className="hidden md:block absolute top-20 lg:top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 rounded-full" style={{width: 'calc(100% - 4rem)', left: '2rem', marginLeft: 'auto', marginRight: 'auto'}}></div>

            {[
              {
                step: "01",
                title: "Choose Your Course",
                description: "Browse our 11+ expertly designed courses and pick what excites your child the most",
                icon: <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                color: "from-blue-500 via-cyan-500 to-teal-500",
                glowColor: "from-blue-500/50 to-cyan-500/50"
              },
              {
                step: "02",
                title: "Book Free Trial",
                description: "Experience a live class absolutely free—no credit card required, zero commitment",
                icon: <Target className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                color: "from-purple-500 via-pink-500 to-rose-500",
                glowColor: "from-purple-500/50 to-pink-500/50"
              },
              {
                step: "03",
                title: "Start Learning",
                description: "Join small interactive classes and watch your child grow with confidence",
                icon: <Zap className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                color: "from-orange-500 via-amber-500 to-yellow-500",
                glowColor: "from-orange-500/50 to-yellow-500/50"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                {/* Premium Glow Effect */}
                <div className={`absolute -inset-3 sm:-inset-4 bg-gradient-to-r ${item.glowColor} rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                
                {/* Premium Card - Fully Responsive */}
                <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 xl:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:translate-y-[-8px] shadow-2xl h-full min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col">
                  {/* Icon Container - Responsive */}
                  <div className="mb-5 sm:mb-6">
                    <div className={`inline-flex w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} shadow-xl transform group-hover:scale-110 transition-all duration-500 flex-shrink-0`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content - Responsive */}
                  <div className="flex-grow">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Section - Vibrant Colorful Cards - Fully Responsive */}
      <section id="courses" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden scroll-mt-16">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-80 sm:h-80 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-5 px-4 pb-2 leading-[1.2]">
                Upcoming Courses
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-medium max-w-3xl mx-auto px-4">
                New courses launching soon to help your child excel
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 xl:gap-8">
              {[
                { title: "Grammar", gradient: "from-emerald-500 to-green-600", icon: "📝", bgPattern: "from-emerald-50 via-green-50 to-emerald-100", description: "Master language and communication skills" },
                { title: "Art and Craft", gradient: "from-rose-500 to-pink-600", icon: "🎨", bgPattern: "from-rose-50 via-pink-50 to-rose-100", description: "Create beautiful handmade crafts" },
                { title: "Maths", gradient: "from-blue-500 to-indigo-600", icon: "🔢", bgPattern: "from-blue-50 via-indigo-50 to-blue-100", description: "Build strong mathematical foundations" }
              ].map((course, i) => (
                <div key={i} className={`group relative bg-gradient-to-br ${course.bgPattern} rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-white hover:border-white/50`}>
                  {/* Animated Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                  
                  <div className="relative p-6 sm:p-7 lg:p-8">
                    {/* Icon Badge */}
                    <div className="mb-5 sm:mb-6">
                      <div className={`inline-flex w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br ${course.gradient} shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 flex-shrink-0`}>
                        <span className="text-4xl sm:text-5xl filter drop-shadow-xl">{course.icon}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-xl sm:text-2xl leading-tight">{course.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">{course.description}</p>
                      </div>
                      
                      <button className="group/btn inline-flex items-center gap-2 text-sm sm:text-base font-bold text-gray-700 hover:text-gray-900 transition-colors">
                        Explore Course
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform flex-shrink-0" />
                      </button>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className={`absolute top-0 right-0 w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br ${course.gradient} opacity-5 rounded-bl-full`}></div>
                    <div className={`absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr ${course.gradient} opacity-5 rounded-tr-full`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12 sm:mt-16">
              <a 
                href="#trial"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:-translate-y-0.5 hover:shadow-2xl shadow-blue-500/40 duration-300"
              >
                Enroll in Your First Course
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Fully Responsive */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(99, 102, 241, 0.1) 2px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
                <Heart className="w-5 h-5 text-pink-600 fill-pink-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-purple-900">Parent & Student Reviews</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-5 px-4">
                Real Stories, Real Success
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
                Hear from parents and students who've transformed their skills with us
              </p>
            </div>

            {/* Testimonial Cards - Fully Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
              {[
                { 
                  name: "Ananya Sharma", 
                  location: "Mumbai", 
                  course: "Art Champion", 
                  quote: "I never imagined I could draw like this! My teacher helped me discover my artistic side, and now I love creating art every day.",
                  gradient: "from-rose-500 to-pink-600",
                  rating: 5,
                  image: "👧"
                },
                { 
                  name: "Rohan Patel", 
                  location: "Delhi", 
                  course: "Chess Master", 
                  quote: "Chess taught me to think ahead and solve problems. Now I'm winning tournaments and even teaching my friends!",
                  gradient: "from-blue-500 to-cyan-600",
                  rating: 5,
                  image: "🧑"
                },
                { 
                  name: "Priya Reddy", 
                  location: "Bangalore", 
                  course: "Piano Prodigy", 
                  quote: "Playing piano brings me so much joy! I performed at my school's annual function and everyone loved it.",
                  gradient: "from-purple-500 to-indigo-600",
                  rating: 5,
                  image: "👧"
                },
                {
                  name: "Mrs. Kapoor",
                  location: "Pune",
                  course: "Public Speaking Student",
                  quote: "My son was extremely shy. After joining the Public Speaking course, his confidence has skyrocketed. Thank you Playfit!",
                  gradient: "from-green-500 to-emerald-600",
                  rating: 5,
                  image: "👩"
                },
                {
                  name: "Aarav Kumar",
                  location: "Hyderabad",
                  course: "Abacus Champion",
                  quote: "Mental math is now my superpower! I can calculate faster than calculators and it's so much fun.",
                  gradient: "from-amber-500 to-orange-600",
                  rating: 5,
                  image: "👦"
                },
                {
                  name: "Mr. & Mrs. Singh",
                  location: "Kolkata",
                  course: "Piano Students",
                  quote: "Both our daughters take piano lessons. The teachers are patient, skilled, and genuinely care about their progress.",
                  gradient: "from-teal-500 to-cyan-600",
                  rating: 5,
                  image: "👨‍👩"
                }
              ].map((testimonial, i) => (
                <div key={i} className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-white hover:border-purple-200">
                  {/* Quote Text */}
                  <p className="text-gray-700 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-5 sm:mb-6">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    ))}
                  </div>
                  
                  {/* Student/Parent Info */}
                  <div className="flex items-center gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-gray-100">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${testimonial.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-lg`}>
                      {testimonial.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{testimonial.location}</p>
                      <p className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent pb-0.5 truncate`}>
                        {testimonial.course}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators - Fully Responsive */}
            <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: "⭐", number: "4.9/5", label: "Average Rating" },
                { icon: "💬", number: "500+", label: "Happy Reviews" },
                { icon: "🏆", number: "98%", label: "Recommend Us" },
                { icon: "❤️", number: "5K+", label: "Satisfied Families" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section - Approved Reviews from Database */}
      <ReviewsSection />

      {/* Write a Review Section */}
      <WriteReview />

      {/* About Playfit Section - Fully Responsive */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 scroll-mt-16 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* About Playfit Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-purple-900">About Playfit</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 sm:mb-6 pb-2 leading-tight px-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Joyful Learning</span>
                {' '}for Young Minds
              </h2>
            </div>

            {/* Mission Statement */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 shadow-xl mb-12 sm:mb-16 lg:mb-20 border-2 border-white">
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed text-center mb-5 sm:mb-6">
                <strong className="text-purple-600">Playfit</strong> is a fun and engaging learning platform designed to help young children build <strong>confidence</strong>, <strong>communication skills</strong>, <strong>reading habits</strong>, <strong>grammar understanding</strong>, and <strong>creative thinking</strong>. Our programs are carefully created for early learners with age-appropriate lessons, interactive activities, games, stories, worksheets, and practice sessions.
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed text-center mb-5 sm:mb-6">
                At Playfit, we believe that <strong className="text-pink-600">learning should be joyful, active, and meaningful</strong>. Each session is designed to make children participate, speak, think, read, and express themselves with confidence. Our child-friendly approach helps learners enjoy every class while developing strong foundational skills for school and life.
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2 leading-relaxed">
                Playfit aims to make every child a confident learner, active thinker, and happy communicator.
              </p>
            </div>

            {/* Meet the Founders Section - Fully Responsive */}
            <div className="mb-16 sm:mb-20">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10 sm:mb-12 lg:mb-16 px-4">
                Meet the Founders
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
                {/* Founder 1 - Puja Agarwal */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white hover:border-purple-200">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-5 sm:mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg ring-4 ring-purple-100 flex-shrink-0">
                      <img
                        src="/images/puja.jpg"
                        alt="Puja Agarwal"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Puja Agarwal</h4>
                      <p className="text-purple-600 font-semibold text-sm sm:text-base">Co-founder, COO & Lead Educator</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    Puja Agarwal is an experienced educator with <strong>over 15 years of teaching experience</strong> in both online and offline learning environments globally. She is a graduate and holds a <strong>Phonics Teacher's Degree</strong>, with strong expertise in early reading, phonics, language development, and child-friendly teaching methods.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    With her passion for education, Puja Agarwal has helped young learners build confidence, improve communication, and develop strong foundational skills through engaging lessons, stories, activities, and interactive learning. Her vision behind Playfit is to create a joyful and meaningful learning space where every child feels encouraged to read, speak, think, and express with confidence.
                  </p>
                </div>

                {/* Founder 2 - Sonika Goel */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white hover:border-blue-200">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-5 sm:mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg ring-4 ring-blue-100 flex-shrink-0">
                      <img
                        src="/images/sonika.jpg"
                        alt="Sonika Goel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Sonika Goel</h4>
                      <p className="text-blue-600 font-semibold text-sm sm:text-base">Co-founder & CEO</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    Sonika Goel is a marketing professional with a <strong>postgraduate degree in Marketing</strong> and <strong>over 10 years of industry experience</strong>. She also holds certifications in Public Speaking and a diploma in French, reflecting her strong communication skills and interest in continuous learning.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    With her experience in marketing, communication, and brand development, Sonika brings a creative and strategic vision to Playfit. She is passionate about building engaging learning experiences that are meaningful, accessible, and enjoyable for children. Through Playfit, her vision is to create a trusted learning platform that supports children in becoming confident speakers, curious learners, and independent thinkers.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Parents Trust Us - Benefits Grid - Fully Responsive */}
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10 sm:mb-12 lg:mb-16 px-4">
                Why 10,000+ Parents Choose Us
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
                {[
                  {
                    icon: <Users className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                    title: "Small Class Sizes",
                    description: "Maximum 8 students per class ensures personalized attention for every child",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: <Target className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                    title: "Certified Instructors",
                    description: "Every teacher is professionally trained, background-verified, and passionate about teaching",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    icon: <Zap className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                    title: "Live Interactive Classes",
                    description: "Real-time interaction with teachers and peers, not pre-recorded videos",
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    icon: <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                    title: "Flexible Scheduling",
                    description: "Choose class timings that work best for your family's schedule",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: <Trophy className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                    title: "Progress Tracking",
                    description: "Regular assessments and detailed progress reports to track your child's growth",
                    color: "from-amber-500 to-orange-500"
                  },
                  {
                    icon: <Heart className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />,
                    title: "100% Satisfaction",
                    description: "98% parent satisfaction rate with option to switch classes if needed",
                    color: "from-pink-500 to-rose-500"
                  }
                ].map((benefit, i) => (
                  <div key={i} className="group relative h-full">
                    <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 rounded-2xl sm:rounded-3xl transition-opacity`}></div>
                    <div className="relative h-full bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 hover:border-gray-200 transition-all hover:shadow-lg flex flex-col">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${benefit.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-5 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg flex-shrink-0`}>
                        {benefit.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">{benefit.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced Book Free Trial - Fully Responsive */}
      <section id="trial" className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden safe-bottom scroll-mt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm font-semibold text-white">Limited Slots Available</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-5 leading-tight px-4">
                Start Learning Today - It's FREE!
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
                Book a free trial class now. No credit card required. No hidden charges.
              </p>
            </div>

            {/* Form Card - Fully Responsive */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl">
              {submitted ? (
                <div className="text-center py-10 sm:py-12">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-2xl">
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white flex-shrink-0" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">🎉 Trial Booked Successfully!</h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 px-4">
                    Thank you! Our team will contact you within 24 hours to schedule your free trial class.
                  </p>
                  <div className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-800 font-semibold text-sm sm:text-base">
                    <span>✓</span> Check your email for confirmation
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-medium flex items-center gap-3">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xs">!</div>
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label htmlFor="parentName" className="block text-sm font-semibold text-gray-900 mb-2">
                        Parent's Full Name *
                      </label>
                      <input
                        type="text"
                        id="parentName"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="childName" className="block text-sm font-semibold text-gray-900 mb-2">
                        Child's Name
                      </label>
                      <input
                        type="text"
                        id="childName"
                        name="childName"
                        value={formData.childName}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="Enter child's name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="courseInterest" className="block text-sm font-semibold text-gray-900 mb-2">
                      Which course interests you? (Optional)
                    </label>
                    <select
                      id="courseInterest"
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    >
                      <option value="">Select a course</option>
                      <option value="art">🎨 Art & Drawing</option>
                      <option value="chess">♟️ Chess</option>
                      <option value="piano">🎹 Piano</option>
                      <option value="phonics">🅰️ Phonics</option>
                      <option value="speaking">🎤 Public Speaking</option>
                      <option value="abacus">🧮 Abacus</option>
                      <option value="readers">📚 Reader's Club</option>
                      <option value="toastmaster">🗣️ Toastmaster</option>
                      <option value="sholak">🎯 Sholak</option>
                      <option value="computers">💻 Computers</option>
                      <option value="rubiks">🧩 Rubik's Cube</option>
                      <option value="ai">🤖 AI & Machine Learning</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
                      placeholder="Any specific questions or requirements?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 sm:py-5 text-base sm:text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl sm:rounded-2xl transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking Your Trial...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2.5">
                        🎉 Book My FREE Trial Class
                        <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
                      </span>
                    )}
                  </button>

                  {/* Trust Indicators - Fully Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t-2 border-gray-100">
                    {[
                      { icon: "✓", text: "100% Free" },
                      { icon: "✓", text: "No Card Required" },
                      { icon: "✓", text: "Instant Confirmation" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </form>
              )}
            </div>

            {/* Additional Trust Elements */}
            <div className="mt-10 sm:mt-12 text-center">
              <p className="text-white/90 text-base sm:text-lg mb-6 px-4">
                <strong>Join 10,000+ happy families</strong> who trust Playfit for their child's skill development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section - Fully Responsive */}
      <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden scroll-mt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm font-semibold">Get in Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 px-4">
                We'd Love to Hear From You!
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                Have questions about our courses or need help choosing the right program for your child? The Playfit team is always happy to help.
              </p>
            </div>

            {/* Contact Info Grid - Fully Responsive */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-12 sm:mb-16">
              {/* Phone */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg flex-shrink-0">
                  <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Phone</h3>
                <a href="tel:+918910484299" className="text-gray-300 hover:text-green-400 transition-colors text-base sm:text-lg break-words">
                  +91 8910484299
                </a>
              </div>

              {/* Email */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg flex-shrink-0">
                  <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Email</h3>
                <a href="mailto:cplayfit@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg break-all">
                  cplayfit@gmail.com
                </a>
              </div>

              {/* Visit Us */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10 sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg flex-shrink-0">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Visit Us</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  18, Rabindra Sarani, Terita Bazar<br />
                  Poddar Court, 4th floor, Tiretti<br />
                  Kolkata, West Bengal 700012
                </p>
              </div>
            </div>

            {/* CTA to Trial Form - Fully Responsive */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
                Book a free trial class to experience our interactive learning approach. Use the form below to request your trial session.
              </p>
              <a 
                href="#trial"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-0.5 shadow-xl duration-300"
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                Book Your Free Trial
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </a>
            </div>

            {/* Stay Connected */}
            <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-4">Stay Connected With Playfit</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
                Connect with us for course updates, learning tips, activity ideas, and exciting announcements.
              </p>
              <p className="text-base sm:text-lg text-gray-400 px-4">
                At Playfit, we are committed to making learning joyful, interactive, and meaningful for every child.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Fully Responsive */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-10 sm:py-12 lg:py-16 safe-bottom relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-8 lg:gap-10 mb-8 sm:mb-10">
              {/* Brand Section */}
              <div className="text-center sm:text-left">
                <Link href="/" className="inline-block mb-4 sm:mb-5">
                  <img
                    src="/logo.jpg"
                    alt="Playfit"
                    className="h-12 sm:h-14 lg:h-16 w-auto object-contain mx-auto sm:mx-0"
                  />
                </Link>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 max-w-xs mx-auto sm:mx-0">
                  Empowering children with creative and skill-building courses in Art, Chess, Piano, Public Speaking, Abacus, and more.
                </p>
              </div>

              {/* Courses Section */}
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-white mb-4 sm:mb-5 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                  Popular Courses
                </h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">🎨 Art & Drawing</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-purple-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">♟️ Chess</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-pink-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">🎹 Piano</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-green-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">🎤 Public Speaking</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">🧮 Abacus</a></li>
                </ul>
              </div>

              {/* Quick Links Section */}
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-white mb-4 sm:mb-5 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                  Quick Links
                </h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  <li><Link href="#about" className="text-xs sm:text-sm text-gray-300 hover:text-purple-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">About Us</Link></li>
                  <li><Link href="#contact" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">Contact Us</Link></li>
                  <li><Link href="#trial" className="text-xs sm:text-sm text-gray-300 hover:text-pink-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">Free Trial</Link></li>
                  <li><Link href="/login" className="text-xs sm:text-sm text-gray-300 hover:text-green-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">Student Login</Link></li>
                  <li><a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition-colors block py-1 hover:translate-x-1 transition-transform inline-block">Help Center</a></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-white mb-4 sm:mb-5 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
                  Contact Us
                </h4>
                <ul className="space-y-3 sm:space-y-3.5">
                  <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-300 group justify-center sm:justify-start">
                    <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                    <a href="mailto:cplayfit@gmail.com" className="break-all group-hover:text-blue-400 transition-colors">cplayfit@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 group justify-center sm:justify-start">
                    <Phone className="w-4 h-4 flex-shrink-0 group-hover:text-green-400 transition-colors" />
                    <a href="tel:+918910484299" className="group-hover:text-green-400 transition-colors">+91 8910484299</a>
                  </li>
                </ul>
                
                {/* CTA Button */}
                <div className="mt-5 sm:mt-6 flex justify-center sm:justify-start">
                  <Link href="#contact" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold rounded-full transition-all hover:-translate-y-0.5 shadow-lg duration-300">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 sm:pt-8">
              <div className="flex justify-center items-center">
                <p className="text-xs sm:text-sm text-gray-400 text-center">
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
        </div>
      </footer>
    </div>
    </>
  );
}
