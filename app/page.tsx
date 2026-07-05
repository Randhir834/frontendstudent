'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Award, TrendingUp, Mail, Phone, Sparkles, Zap, Heart, Target } from 'lucide-react';
import { contactService } from '@/services/contactService';
import CourseRecommendationSection from '@/components/CourseRecommendation/CourseRecommendationSection';

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
      {/* Clean Professional Header - Mobile Optimized */}
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
              <a 
                href="#courses" 
                onClick={(e) => scrollToSection(e, 'courses')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="#trial" 
                onClick={(e) => scrollToSection(e, 'trial')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Free Trial
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

        {/* Mobile Menu - Full Width */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-200 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="px-3 sm:px-4 py-3 space-y-2 max-w-md mx-auto">
              <a 
                href="#courses" 
                onClick={(e) => scrollToSection(e, 'courses')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Courses
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                About
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Contact
              </a>
              <a 
                href="#trial" 
                onClick={(e) => scrollToSection(e, 'trial')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Free Trial
              </a>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-sm font-bold rounded-lg text-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all mt-2 touch-target shadow-lg shadow-purple-500/40 active:scale-95">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Consistent with Site Design */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden py-12 sm:py-16 md:py-20 border-b border-gray-200">
        {/* Vibrant Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/25">
                <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-300 fill-yellow-300" />
                <span className="text-xs sm:text-sm font-bold text-white">Trusted by 10,000+ Students</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Learning Journey
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed font-medium">
                Interactive <span className="text-blue-600 font-semibold">live classes</span> in Art, Chess, Piano, Public Speaking, and more. Designed for students passionate about learning.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  href="#courses"
                  className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-md hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105"
                >
                  Explore Courses
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#trial"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm sm:text-base font-semibold rounded-md hover:shadow-xl hover:shadow-orange-500/40 transition-all hover:scale-105"
                >
                  Start Free Trial
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 sm:gap-6 pt-4 flex-wrap">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md border border-blue-100">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10,000+</div>
                  <div className="text-sm text-gray-700 font-medium">Active Students</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md border border-purple-100">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">11+</div>
                  <div className="text-sm text-gray-700 font-medium">Skill Courses</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md border border-orange-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">4.9</span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">Parent Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards Grid */}
            <div className="w-full">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Feature Card 1 - Live Classes */}
                <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Live Classes</h3>
                  <p className="text-sm text-blue-100 mb-4 flex-grow leading-relaxed">Interactive sessions with expert instructors</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 self-start">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-white">Live Now</span>
                  </div>
                </div>

                {/* Feature Card 2 - AI Learning */}
                <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">AI Learning</h3>
                  <p className="text-sm text-purple-100 mb-4 flex-grow leading-relaxed">Personalized recommendations for every student</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 self-start">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Smart</span>
                  </div>
                </div>

                {/* Feature Card 3 - Practice Tests */}
                <div className="group bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl shadow-pink-500/25 hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Practice Tests</h3>
                  <p className="text-sm text-pink-100 mb-4 flex-grow leading-relaxed">Master skills with interactive exercises</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 self-start">
                    <Target className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Interactive</span>
                  </div>
                </div>

                {/* Feature Card 4 - Progress Tracker */}
                <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Progress Tracker</h3>
                  <p className="text-sm text-orange-100 mb-4 flex-grow leading-relaxed">Monitor growth with detailed analytics</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 self-start">
                    <Trophy className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Track Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - PREMIUM WORLD-CLASS DESIGN */}
      <section className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Premium Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-pink-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 xs:px-5 py-2 xs:py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-4 xs:mb-5 sm:mb-6 border border-white/20">
              <Sparkles className="w-4 xs:w-5 h-4 xs:h-5 text-yellow-300" />
              <span className="text-xs xs:text-sm font-bold text-white">Trusted Worldwide</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 xs:mb-4 sm:mb-5 md:mb-6 leading-tight">
              Join The Learning
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Revolution
              </span>
            </h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-medium px-4">
              Thousands of students are already mastering new skills with our world-class platform
            </p>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8">
            {[
              { 
                number: "10,000+", 
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
                number: "11+", 
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
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500`}></div>
                
                {/* Premium Card */}
                <div className="relative bg-white/95 backdrop-blur-xl rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden">
                  {/* Decorative Gradient Corner */}
                  <div className={`absolute -top-12 -right-12 w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full`}></div>
                  
                  {/* Icon with Premium Background */}
                  <div className="relative mb-4 xs:mb-5 sm:mb-6">
                    <div className={`inline-flex w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 items-center justify-center rounded-xl xs:rounded-2xl bg-gradient-to-br ${stat.iconBg} shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <span className="text-2xl xs:text-3xl sm:text-4xl filter drop-shadow-lg">{stat.icon}</span>
                    </div>
                  </div>
                  
                  {/* Number with Premium Gradient */}
                  <div className={`text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 xs:mb-2.5 sm:mb-3 leading-tight`}>
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 mb-1.5 xs:mb-2 leading-tight">
                    {stat.label}
                  </div>
                  
                  {/* Subtext */}
                  <div className="text-xs xs:text-sm text-gray-600 font-medium">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Best Courses Section */}
      <CourseRecommendationSection />

      {/* How It Works - WORLD-CLASS PREMIUM DESIGN */}
      <section className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 xs:px-5 py-2 xs:py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-4 xs:mb-6 sm:mb-8 border border-white/20 shadow-xl">
              <Zap className="w-4 xs:w-5 h-4 xs:h-5 text-yellow-400" />
              <span className="text-xs xs:text-sm font-bold">Simple 3-Step Process</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 xs:mb-4 sm:mb-5 md:mb-6 leading-tight">
              Getting Started Is{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Super Easy
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-50"></span>
              </span>
            </h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium px-4">
              Join thousands of students in just 3 simple steps
            </p>
          </div>

          {/* Premium Steps Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 md:gap-10 lg:gap-12 relative">
            {/* Premium Connection Line */}
            <div className="hidden md:block absolute top-16 xs:top-18 sm:top-20 md:top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 rounded-full" style={{width: 'calc(100% - 4rem)', left: '2rem', marginLeft: 'auto', marginRight: 'auto'}}></div>

            {[
              {
                step: "01",
                title: "Choose Your Course",
                description: "Browse our 11+ expertly designed courses and pick what excites your child the most",
                icon: <BookOpen className="w-8 h-8" />,
                color: "from-blue-500 via-cyan-500 to-teal-500",
                glowColor: "from-blue-500/50 to-cyan-500/50"
              },
              {
                step: "02",
                title: "Book Free Trial",
                description: "Experience a live class absolutely free—no credit card required, zero commitment",
                icon: <Target className="w-8 h-8" />,
                color: "from-purple-500 via-pink-500 to-rose-500",
                glowColor: "from-purple-500/50 to-pink-500/50"
              },
              {
                step: "03",
                title: "Start Learning",
                description: "Join small interactive classes and watch your child grow with confidence",
                icon: <Zap className="w-8 h-8" />,
                color: "from-orange-500 via-amber-500 to-yellow-500",
                glowColor: "from-orange-500/50 to-yellow-500/50"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                {/* Premium Glow Effect */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${item.glowColor} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                
                {/* Premium Card */}
                <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:translate-y-[-8px] shadow-2xl h-full min-h-[400px] flex flex-col">
                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className={`inline-flex w-20 h-20 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-xl transform group-hover:scale-110 transition-all duration-500`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium CTA */}
          <div className="text-center mt-16 lg:mt-20">
            <Link 
              href="#trial" 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 shadow-xl relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <span className="relative">Start Your Free Trial Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative" />
            </Link>
          </div>
        </div>
      </section>

      {/* Course Section - Vibrant Colorful Cards */}
      <section id="courses" className="py-12 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden scroll-mt-16">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold mb-6 shadow-lg shadow-purple-500/30">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                12+ Courses Available ✨
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-5 px-2">
                Explore Our Skill Development Courses
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto px-3">
                Live online classes designed to nurture <span className="text-purple-600 font-bold">creativity</span>, <span className="text-pink-600 font-bold">confidence</span>, and <span className="text-blue-600 font-bold">critical thinking</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {[
                { title: "Art & Drawing", gradient: "from-rose-500 to-pink-600", icon: "🎨", bgPattern: "from-rose-50 via-pink-50 to-rose-100", description: "Unleash creativity on canvas" },
                { title: "Chess", gradient: "from-slate-700 to-gray-900", icon: "♟️", bgPattern: "from-slate-50 via-gray-50 to-slate-100", description: "Master strategic thinking" },
                { title: "Piano", gradient: "from-violet-500 to-purple-600", icon: "🎹", bgPattern: "from-violet-50 via-purple-50 to-violet-100", description: "Create beautiful melodies" },
                { title: "Phonics", gradient: "from-sky-500 to-blue-600", icon: "🅰️", bgPattern: "from-sky-50 via-blue-50 to-sky-100", description: "Build reading confidence" },
                { title: "Public Speaking", gradient: "from-emerald-500 to-green-600", icon: "🎤", bgPattern: "from-emerald-50 via-green-50 to-emerald-100", description: "Speak with confidence" },
                { title: "Abacus", gradient: "from-amber-500 to-orange-600", icon: "🧮", bgPattern: "from-amber-50 via-orange-50 to-amber-100", description: "Lightning-fast mental math" },
                { title: "Reader's Club", gradient: "from-orange-500 to-red-600", icon: "📚", bgPattern: "from-orange-50 via-red-50 to-orange-100", description: "Discover reading joy" },
                { title: "Toastmaster", gradient: "from-teal-500 to-cyan-600", icon: "🗣️", bgPattern: "from-teal-50 via-cyan-50 to-teal-100", description: "Lead and inspire others" },
                { title: "Sholak", gradient: "from-indigo-500 to-purple-600", icon: "🎯", bgPattern: "from-indigo-50 via-purple-50 to-indigo-100", description: "Ancient wisdom meets modern" },
                { title: "Computers", gradient: "from-blue-500 to-cyan-600", icon: "💻", bgPattern: "from-blue-50 via-cyan-50 to-blue-100", description: "Code the future" },
                { title: "Rubiks Cube", gradient: "from-fuchsia-500 to-pink-600", icon: "🧩", bgPattern: "from-fuchsia-50 via-pink-50 to-fuchsia-100", description: "Puzzle-solving genius" },
                { title: "AI & Machine Learning", gradient: "from-cyan-500 to-blue-700", icon: "🤖", bgPattern: "from-cyan-50 via-blue-50 to-cyan-100", description: "Build intelligent systems" }
              ].map((course, i) => (
                <div key={i} className={`group relative bg-gradient-to-br ${course.bgPattern} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-white hover:border-white/50`}>
                  {/* Animated Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                  
                  <div className="relative p-7 sm:p-8">
                    {/* Icon Badge */}
                    <div className="mb-6">
                      <div className={`inline-flex w-24 h-24 items-center justify-center rounded-3xl bg-gradient-to-br ${course.gradient} shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <span className="text-5xl filter drop-shadow-xl">{course.icon}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 text-xl md:text-2xl leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${course.gradient} transition-all">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      </div>
                      
                      <button className="group/btn inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
                        Explore Course
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.gradient} opacity-5 rounded-bl-full`}></div>
                    <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${course.gradient} opacity-5 rounded-tr-full`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-10 sm:mt-12">
              <Link href="#trial" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 hover:shadow-2xl shadow-blue-500/50">
                Enroll in Your First Course
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
              {/* Left - Visual */}
              <div className="relative">
                <div className="aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12">
                  <div className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Expert Learning</h3>
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Discover Unique Learning Experiences
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  From artistic expression through Art & Drawing to strategic thinking with Chess, from musical mastery with Piano to mental math with Abacus - we offer diverse courses that spark curiosity and build lifelong skills.
                </p>
                <Link 
                  href="#trial"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white border-2 border-gray-900 text-gray-900 text-xs sm:text-sm md:text-base font-medium rounded-md hover:bg-gray-50 transition-colors touch-target w-full sm:w-auto"
                >
                  START YOUR FREE TRIAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Development Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-dark-900 text-white">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
              {/* Left - Visual */}
              <div className="relative order-2 lg:order-1">
                <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full max-w-xs sm:max-w-sm">
                    <div className="aspect-square bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 order-1 lg:order-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  Build Skills Beyond Academics
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  Our courses help children develop creativity through Art, strategic thinking with Chess, musical talent via Piano, public confidence through Speaking, and computational speed with Abacus - essential skills for the 21st century.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 text-[10px] sm:text-xs md:text-sm text-gray-300">
                  <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white/10 rounded">Creative Arts</span>
                  <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white/10 rounded">Strategic Thinking</span>
                  <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white/10 rounded">Music & Performance</span>
                </div>
                <Link 
                  href="#trial"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white text-dark-900 text-xs sm:text-sm md:text-base font-medium rounded-md hover:bg-gray-100 transition-colors touch-target w-full sm:w-auto"
                >
                  EXPLORE PROGRAMS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Community Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-dark-900 text-white">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
              {/* Left - Visual (Abstract Pattern) */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div ref={gridRef} className="grid grid-cols-8 gap-0.5 sm:gap-1 max-w-xs sm:max-w-sm mx-auto lg:mx-0">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded community-grid-item"
                    />
                  ))}
                </div>
                <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5 text-center lg:text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  Join Thousands of Young Learners
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  Students from across India are mastering Art, Chess, Piano, Public Speaking, Abacus, and more through our live online classes
                </p>
                <Link 
                  href="#trial"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white text-dark-900 text-xs sm:text-sm md:text-base font-medium rounded-md hover:bg-gray-100 transition-colors touch-target w-full sm:w-auto"
                >
                  START YOUR FREE TRIAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 bg-gradient-to-b from-yellow-500 to-yellow-600 w-full overflow-hidden">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
              {/* Left - Curriculum Icons - Better Mobile Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                {[
                  { icon: "🎨", label: "ART & DRAWING" },
                  { icon: "♟️", label: "CHESS" },
                  { icon: "🎹", label: "PIANO" },
                  { icon: "🅰️", label: "PHONICS" },
                  { icon: "🎤", label: "PUBLIC SPEAKING" },
                  { icon: "🧮", label: "ABACUS" },
                  { icon: "📚", label: "READER'S CLUB" },
                  { icon: "🗣️", label: "TOASTMASTER" },
                  { icon: "🎯", label: "SHOLAK" },
                  { icon: "💻", label: "COMPUTERS" },
                  { icon: "🧩", label: "RUBIKS CUBE" },
                  { icon: "🎓", label: "MORE COMING" },
                  { icon: "✨", label: "CREATIVITY" },
                  { icon: "🧠", label: "LOGIC" },
                  { icon: "📈", label: "GROWTH" },
                  { icon: "🌟", label: "EXCELLENCE" }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 lg:p-5 text-center space-y-1 sm:space-y-1.5 md:space-y-2 hover:shadow-md transition-shadow">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">{item.icon}</div>
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold text-gray-900 leading-tight break-words">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right - Content */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Expert-Led Courses by Certified Instructors
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-100 leading-relaxed">
                  Our carefully crafted curriculum spans creative arts, strategic games, music, communication, and cognitive development
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-yellow-100 leading-relaxed">
                  Each course is designed to build confidence, creativity, and critical thinking in a fun, engaging online environment
                </p>
                <Link 
                  href="#trial"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-white text-yellow-700 font-semibold rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm md:text-base lg:text-lg touch-target w-full sm:w-auto"
                >
                  START YOUR FREE TRIAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <p className="text-[10px] sm:text-xs md:text-sm font-medium text-blue-200 mb-2 sm:mb-3 md:mb-4">
                EXPLORE OUR DIVERSE SKILL CATEGORIES
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {[
                { icon: "🎨", label: "ART STUDIO" },
                { icon: "♟️", label: "CHESS ACADEMY" },
                { icon: "🎹", label: "MUSIC ROOM" },
                { icon: "🎤", label: "SPEAKING LAB" },
                { icon: "🧮", label: "MATH HUB" },
                { icon: "💻", label: "TECH ZONE" }
              ].map((activity, i) => (
                <div key={i} className="text-center space-y-2 sm:space-y-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl border-2 sm:border-3 md:border-4 border-white/20">
                    {activity.icon}
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase leading-tight px-1">
                    {activity.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(99, 102, 241, 0.1) 2px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
                <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                <span className="text-sm font-semibold text-purple-900">Parent & Student Reviews</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Real Stories, Real Success
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from parents and students who've transformed their skills with us
              </p>
            </div>

            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                <div key={i} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-white hover:border-purple-200">
                  {/* Quote Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 text-base">
                    {testimonial.quote}
                  </p>
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Student/Parent Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                      {testimonial.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base truncate">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}>
                        {testimonial.course}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: "⭐", number: "4.9/5", label: "Average Rating" },
                { icon: "💬", number: "500+", label: "Happy Reviews" },
                { icon: "🏆", number: "98%", label: "Recommend Us" },
                { icon: "❤️", number: "10K+", label: "Satisfied Families" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Playfit Section */}
      <section id="about" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 scroll-mt-16 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* About Playfit Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">About Playfit</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 pb-2 leading-tight">
                Joyful Learning for Young Minds
              </h2>
            </div>

            {/* Mission Statement */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl mb-12 border-2 border-white">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center mb-6">
                <strong className="text-purple-600">Playfit</strong> is a fun and engaging learning platform designed to help young children build <strong>confidence</strong>, <strong>communication skills</strong>, <strong>reading habits</strong>, <strong>grammar understanding</strong>, and <strong>creative thinking</strong>. Our programs are carefully created for early learners with age-appropriate lessons, interactive activities, games, stories, worksheets, and practice sessions.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center mb-6">
                At Playfit, we believe that <strong className="text-pink-600">learning should be joyful, active, and meaningful</strong>. Each session is designed to make children participate, speak, think, read, and express themselves with confidence. Our child-friendly approach helps learners enjoy every class while developing strong foundational skills for school and life.
              </p>
              <p className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Playfit aims to make every child a confident learner, active thinker, and happy communicator.
              </p>
            </div>

            {/* Meet the Founders Section */}
            <div className="mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                Meet the Founders
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Founder 1 - Puja Agarwal */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white hover:border-purple-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                      👩‍🏫
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">Puja Agarwal</h4>
                      <p className="text-purple-600 font-semibold">Co-Founder & Lead Educator</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Puja Agarwal is an experienced educator with <strong>over 15 years of teaching experience</strong> in both online and offline learning environments globally. She is a graduate and holds a <strong>Phonics Teacher's Degree</strong>, with strong expertise in early reading, phonics, language development, and child-friendly teaching methods.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    With her passion for education, Puja Agarwal has helped young learners build confidence, improve communication, and develop strong foundational skills through engaging lessons, stories, activities, and interactive learning. Her vision behind Playfit is to create a joyful and meaningful learning space where every child feels encouraged to read, speak, think, and express with confidence.
                  </p>
                </div>

                {/* Founder 2 - Sonika Goel */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white hover:border-blue-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                      👩‍💼
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">Sonika Goel</h4>
                      <p className="text-blue-600 font-semibold">Co-Founder & Marketing Lead</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Sonika Goel is a marketing professional with a <strong>postgraduate degree in Marketing</strong> and <strong>over 10 years of industry experience</strong>. She also holds certifications in Public Speaking and a diploma in French, reflecting her strong communication skills and interest in continuous learning.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    With her experience in marketing, communication, and brand development, Sonika brings a creative and strategic vision to Playfit. She is passionate about building engaging learning experiences that are meaningful, accessible, and enjoyable for children. Through Playfit, her vision is to create a trusted learning platform that supports children in becoming confident speakers, curious learners, and independent thinkers.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Parents Trust Us - Benefits Grid */}
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                Why 10,000+ Parents Choose Us
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Small Class Sizes",
                    description: "Maximum 8 students per class ensures personalized attention for every child",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: "Certified Instructors",
                    description: "Every teacher is professionally trained, background-verified, and passionate about teaching",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: "Live Interactive Classes",
                    description: "Real-time interaction with teachers and peers, not pre-recorded videos",
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    icon: <CheckCircle className="w-8 h-8" />,
                    title: "Flexible Scheduling",
                    description: "Choose class timings that work best for your family's schedule",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: <Trophy className="w-8 h-8" />,
                    title: "Progress Tracking",
                    description: "Regular assessments and detailed progress reports to track your child's growth",
                    color: "from-amber-500 to-orange-500"
                  },
                  {
                    icon: <Heart className="w-8 h-8" />,
                    title: "100% Satisfaction",
                    description: "98% parent satisfaction rate with option to switch classes if needed",
                    color: "from-pink-500 to-rose-500"
                  }
                ].map((benefit, i) => (
                  <div key={i} className="group relative h-full">
                    <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`}></div>
                    <div className="relative h-full bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-gray-200 transition-all hover:shadow-lg flex flex-col">
                      <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                        {benefit.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed flex-grow">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced Book Free Trial */}
      <section id="trial" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden safe-bottom scroll-mt-16">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-semibold text-white">Limited Slots Available</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Start Learning Today - It's FREE!
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Book a free trial class now. No credit card required. No hidden charges.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">🎉 Trial Booked Successfully!</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Thank you! Our team will contact you within 24 hours to schedule your free trial class.
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-800 font-semibold">
                    <span>✓</span> Check your email for confirmation
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-3">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0">!</div>
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                        className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                        className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                        className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="+91 98765 43210"
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
                      className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                      className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
                      placeholder="Any specific questions or requirements?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking Your Trial...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        🎉 Book My FREE Trial Class
                        <ArrowRight className="w-6 h-6" />
                      </span>
                    )}
                  </button>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-gray-100">
                    {[
                      { icon: "✓", text: "100% Free" },
                      { icon: "✓", text: "No Card Required" },
                      { icon: "✓", text: "Instant Confirmation" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs">
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
            <div className="mt-12 text-center">
              <p className="text-white/90 text-lg mb-6">
                <strong>Join 10,000+ happy families</strong> who trust Playfit for their child's skill development
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section - Contact Info Only */}
      <section id="contact" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden scroll-mt-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold">Get in Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                We'd Love to Hear From You!
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Have questions about our courses or need help choosing the right program for your child? The Playfit team is always happy to help.
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Phone */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Phone</h3>
                <a href="tel:+918910484299" className="text-gray-300 hover:text-green-400 transition-colors text-lg">
                  +91 8910484299
                </a>
              </div>

              {/* Email */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Email</h3>
                <a href="mailto:cplayfit@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors text-lg break-all">
                  cplayfit@gmail.com
                </a>
              </div>

              {/* Visit Us */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Visit Us</h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  18, Rabindra Sarani, Terita Bazar<br />
                  Poddar Court, 4th floor, Tiretti<br />
                  Kolkata, West Bengal 700012
                </p>
              </div>
            </div>

            {/* CTA to Trial Form */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Book a free trial class to experience our interactive learning approach. Use the form below to request your trial session.
              </p>
              <a 
                href="#trial"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Book Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Stay Connected */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Connected With Playfit</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect with us for course updates, learning tips, activity ideas, and exciting announcements.
              </p>
              <p className="text-lg text-gray-400">
                At Playfit, we are committed to making learning joyful, interactive, and meaningful for every child.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🎨 Art & Drawing</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-purple-400 transition-colors block py-1 hover:translate-x-1 transition-transform">♟️ Chess</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-pink-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🎹 Piano</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-green-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🎤 Public Speaking</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition-colors block py-1 hover:translate-x-1 transition-transform">🧮 Abacus</a></li>
                </ul>
              </div>

              {/* Quick Links Section */}
              <div>
                <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                  Quick Links
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><Link href="#about" className="text-xs sm:text-sm text-gray-300 hover:text-purple-400 transition-colors block py-1 hover:translate-x-1 transition-transform">About Us</Link></li>
                  <li><Link href="#contact" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Contact Us</Link></li>
                  <li><Link href="#trial" className="text-xs sm:text-sm text-gray-300 hover:text-pink-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Free Trial</Link></li>
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
                  <Link href="#contact" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 shadow-lg">
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
    </>
  );
}
