'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Play, Award, TrendingUp, Mail, Phone, Sparkles, Zap, Heart, Target } from 'lucide-react';
import { trialService } from '@/services/trialService';
import CourseRecommendationSection from '@/components/CourseRecommendation/CourseRecommendationSection';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', grade: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await trialService.requestTrial(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', grade: '' });
      }, 5000);
    } catch (err: unknown) {
      console.error('Error submitting trial request:', err);
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to request trial. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Clean Professional Header - Mobile Optimized */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 safe-top shadow-sm">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
            <Link href="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/playfit-logo.jpg"
                alt="Playfit"
                className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[180px] transition-transform hover:scale-105"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6">
              <Link href="#courses" className="text-xs lg:text-sm font-medium text-gray-700 hover:text-blue-600 transition-all hover:scale-105 whitespace-nowrap relative group">
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
              </Link>
              <Link href="#about" className="text-xs lg:text-sm font-medium text-gray-700 hover:text-blue-600 transition-all hover:scale-105 whitespace-nowrap relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
              </Link>
              <Link href="#trial" className="text-xs lg:text-sm font-medium text-gray-700 hover:text-blue-600 transition-all hover:scale-105 whitespace-nowrap relative group">
                Free Trial
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
              </Link>
              <Link href="/login" className="ml-2 lg:ml-3 px-4 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs lg:text-sm font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg whitespace-nowrap shadow-blue-500/30">
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-blue-50 rounded-lg transition-colors touch-target"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Width */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-lg">
            <nav className="px-3 sm:px-4 py-3 space-y-2">
              <Link href="#courses" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-target">
                Courses
              </Link>
              <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-target">
                About
              </Link>
              <Link href="#trial" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-target">
                Free Trial
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg text-center hover:from-blue-700 hover:to-blue-800 transition-all mt-2 touch-target shadow-lg shadow-blue-500/30">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 animate-in slide-in-from-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span className="text-sm font-medium">Trusted by 10,000+ Students</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100">
                  Unlock Your Child's Potential
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-50 leading-relaxed">
                  Discover engaging <span className="font-semibold text-white bg-white/10 px-2 py-1 rounded">live online classes</span> in <span className="font-semibold text-yellow-300">Art & Drawing</span>, <span className="font-semibold text-green-300">Chess</span>, <span className="font-semibold text-purple-300">Piano</span>, <span className="font-semibold text-pink-300">Public Speaking</span>, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="#trial"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-700 text-base font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105 hover:shadow-2xl shadow-white/30 touch-target"
                  >
                    START YOUR FREE TRIAL
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="#courses"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white text-base font-bold rounded-full hover:bg-white/20 transition-all hover:scale-105 border-2 border-white/30 touch-target"
                  >
                    <Play className="w-5 h-5" />
                    Explore Courses
                  </Link>
                </div>
              </div>

              {/* Right Visual - Enhanced 3D Elements */}
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px] animate-in slide-in-from-right">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 opacity-80 animate-float shadow-2xl shadow-yellow-500/50 rotate-12"></div>
                <div className="absolute bottom-10 left-0 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-500 opacity-80 animate-float-slow shadow-2xl shadow-blue-500/50 -rotate-12"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-3xl bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 opacity-90 animate-float-slower shadow-2xl shadow-purple-500/50"></div>
                
                {/* Floating Icons */}
                <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float">
                  <span className="text-3xl">🎨</span>
                </div>
                <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float-slow">
                  <span className="text-3xl">♟️</span>
                </div>
                <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float-slower">
                  <span className="text-3xl">🎹</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
        
        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[
                { number: "10,000+", label: "Happy Students", gradient: "from-blue-500 to-cyan-500", icon: "👨‍🎓" },
                { number: "50+", label: "Expert Instructors", gradient: "from-purple-500 to-pink-500", icon: "👩‍🏫" },
                { number: "11+", label: "Skill Courses", gradient: "from-orange-500 to-yellow-500", icon: "📚" },
                { number: "98%", label: "Satisfaction Rate", gradient: "from-green-500 to-emerald-500", icon: "⭐" }
              ].map((stat, i) => (
                <div key={i} className="group relative bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full`}></div>
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className={`text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Find Your Best Courses Section */}
      <CourseRecommendationSection />

      {/* Course Section - Mobile Optimized Cards */}
      <section id="courses" className="py-12 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                <Star className="w-4 h-4 fill-blue-600" />
                11+ Courses Available
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
                Explore Our Skill Development Courses
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-3">
                Live online classes designed to nurture creativity, confidence, and critical thinking
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
              {[
                { title: "Art & Drawing", age: "Ages 5-15", gradient: "from-red-400 to-pink-500", icon: "🎨", bgPattern: "from-red-50 to-pink-50" },
                { title: "Chess", age: "Ages 6-16", gradient: "from-gray-700 to-gray-900", icon: "♟️", bgPattern: "from-gray-50 to-slate-50" },
                { title: "Piano", age: "Ages 5-15", gradient: "from-purple-400 to-indigo-500", icon: "🎹", bgPattern: "from-purple-50 to-indigo-50" },
                { title: "Phonics", age: "Ages 4-8", gradient: "from-blue-400 to-cyan-500", icon: "🅰️", bgPattern: "from-blue-50 to-cyan-50" },
                { title: "Public Speaking", age: "Ages 7-17", gradient: "from-green-400 to-emerald-500", icon: "🎤", bgPattern: "from-green-50 to-emerald-50" },
                { title: "Abacus", age: "Ages 5-12", gradient: "from-yellow-400 to-orange-500", icon: "🧮", bgPattern: "from-yellow-50 to-orange-50" },
                { title: "Reader's Club", age: "Ages 6-14", gradient: "from-orange-400 to-red-500", icon: "📚", bgPattern: "from-orange-50 to-red-50" },
                { title: "Toastmaster", age: "Ages 10-17", gradient: "from-teal-400 to-cyan-500", icon: "🗣️", bgPattern: "from-teal-50 to-cyan-50" },
                { title: "Sholak", age: "Ages 7-15", gradient: "from-indigo-400 to-purple-500", icon: "🎯", bgPattern: "from-indigo-50 to-purple-50" },
                { title: "Computers", age: "Ages 8-16", gradient: "from-cyan-400 to-blue-500", icon: "💻", bgPattern: "from-cyan-50 to-blue-50" },
                { title: "Rubiks Cube", age: "Ages 6-14", gradient: "from-rose-400 to-pink-500", icon: "🧩", bgPattern: "from-rose-50 to-pink-50" }
              ].map((course, i) => (
                <div key={i} className={`group relative bg-gradient-to-br ${course.bgPattern} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50`}>
                  {/* Gradient Border Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-5 sm:p-6 md:p-7">
                    <div className="flex items-start gap-4">
                      {/* Icon with Gradient Background */}
                      <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${course.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0`}>
                        <span className="text-3xl sm:text-4xl filter drop-shadow-lg">{course.icon}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg md:text-xl leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${course.gradient} text-white text-xs sm:text-sm font-semibold rounded-full shadow-md`}>
                          <Users className="w-3 h-3" />
                          {course.age}
                        </div>
                        <div className="mt-4">
                          <button className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${course.gradient} opacity-5 rounded-bl-full`}></div>
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

      {/* Testimonials Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-gray-50">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 px-2">
                Student Success Stories
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 px-3">
                See how our students are excelling in Art, Chess, Piano, Public Speaking, and more
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {[
                { name: "ANANYA", age: "10 YEARS OLD", location: "MUMBAI", achievement: "ART CHAMPION", handle: "GRADE 5", color: "bg-gradient-to-br from-red-400 to-red-600" },
                { name: "ROHAN", age: "12 YEARS OLD", location: "DELHI", achievement: "CHESS MASTER", handle: "GRADE 7", color: "bg-gradient-to-br from-blue-400 to-blue-600" },
                { name: "PRIYA", age: "9 YEARS OLD", location: "BANGALORE", achievement: "PIANO PRODIGY", handle: "GRADE 4", color: "bg-gradient-to-br from-purple-400 to-purple-600" }
              ].map((student, i) => (
                <div key={i} className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 ${student.color} rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl flex-shrink-0`}>
                      👤
                    </div>
                    <div className="flex-1 space-y-1 sm:space-y-1.5 md:space-y-2 min-w-0">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base truncate">{student.name}</h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">{student.age}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">{student.location}</p>
                      </div>
                      <div>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight">{student.achievement}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">{student.handle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Free Trial - Mobile Optimized */}
      <section id="trial" className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white safe-bottom">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                  Start Your Child's Learning Journey
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
                  Book a free trial class in Art, Chess, Piano, Public Speaking, Abacus, or any course of your choice
                </p>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 md:p-8 text-center">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-green-600 mx-auto mb-2 sm:mb-3 md:mb-4" />
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Trial Requested Successfully!</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Thanks for reaching out. We'll contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target"
                      placeholder="Enter your phone"
                    />
                  </div>

                  <div>
                    <label htmlFor="grade" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Child's Age / Grade *
                    </label>
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target"
                      placeholder="e.g., 8 years / Grade 3"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="course" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Interested Course (Optional)
                  </label>
                  <select
                    id="course"
                    name="course"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-target"
                  >
                    <option value="">Select a course</option>
                    <option value="art">Art & Drawing</option>
                    <option value="chess">Chess</option>
                    <option value="piano">Piano</option>
                    <option value="phonics">Phonics</option>
                    <option value="speaking">Public Speaking</option>
                    <option value="abacus">Abacus</option>
                    <option value="readers">Reader's Club</option>
                    <option value="toastmaster">Toastmaster</option>
                    <option value="sholak">Sholak</option>
                    <option value="computers">Computers</option>
                    <option value="rubiks">Rubiks Cube</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                >
                  {loading ? 'Submitting...' : 'Book Free Trial Class'}
                </button>

                <p className="text-center text-[10px] sm:text-xs md:text-sm text-gray-500 px-2">
                  No payment required. Start with a completely free trial class.
                </p>
              </form>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-dark-900 text-white py-8 sm:py-10 md:py-12 lg:py-16 safe-bottom">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
              {/* Brand Section */}
              <div>
                <Link href="/" className="inline-block mb-3 sm:mb-4">
                  <img
                    src="/images/playfit-logo.jpg"
                    alt="Playfit"
                    className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                  />
                </Link>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Empowering children with creative and skill-building courses in Art, Chess, Piano, Public Speaking, Abacus, and more.
                </p>
              </div>

              {/* Courses Section */}
              <div>
                <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Popular Courses</h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Art & Drawing</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Chess</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Piano</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Public Speaking</a></li>
                  <li><a href="#courses" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Abacus</a></li>
                </ul>
              </div>

              {/* Quick Links Section */}
              <div>
                <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><Link href="#about" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">About Us</Link></li>
                  <li><Link href="#trial" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Free Trial</Link></li>
                  <li><Link href="/login" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Student Login</Link></li>
                  <li><a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">FAQs</a></li>
                  <li><a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors block py-1">Help Center</a></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div>
                <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="break-all">support@playfit.com</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>+1 (234) 567-890</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-400">
                © {new Date().getFullYear()} Playfit. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
