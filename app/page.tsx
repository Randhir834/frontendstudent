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
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="block text-white drop-shadow-lg">Unlock Your Child's</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 drop-shadow-lg">
                    Creative Potential
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-50 leading-relaxed">
                  Discover engaging <span className="font-semibold text-white bg-white/20 px-3 py-1.5 rounded-lg">live online classes</span> in <span className="font-bold text-yellow-300">Art & Drawing</span>, <span className="font-bold text-green-300">Chess</span>, <span className="font-bold text-purple-300">Piano</span>, <span className="font-bold text-pink-300">Public Speaking</span>, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="#trial"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-base font-bold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all hover:scale-105 hover:shadow-2xl shadow-yellow-500/50 touch-target"
                  >
                    START YOUR FREE TRIAL
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="#courses"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white text-base font-bold rounded-full hover:bg-white/20 transition-all hover:scale-105 border-2 border-white/50 hover:border-white touch-target"
                  >
                    <Play className="w-5 h-5" />
                    Explore Courses
                  </Link>
                </div>
              </div>

              {/* Right Visual - Enhanced 3D Elements with Icons Inside */}
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px] animate-in slide-in-from-right">
                {/* Large Card 1 - Yellow/Orange (Top Right) with Art & Drawing icons */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 opacity-80 animate-float shadow-2xl shadow-yellow-500/50 rotate-12 overflow-hidden">
                  {/* Small cards inside - consistent 48px size */}
                  <div className="absolute top-3 right-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">🖌️</span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
                
                {/* Large Card 2 - Blue/Cyan (Bottom Left) with Chess & Logic icons */}
                <div className="absolute bottom-10 left-0 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-500 opacity-80 animate-float-slow shadow-2xl shadow-blue-500/50 -rotate-12 overflow-hidden">
                  {/* Small cards inside - consistent 48px size */}
                  <div className="absolute top-3 left-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">♟️</span>
                  </div>
                  <div className="absolute top-3 right-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">🧩</span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">💻</span>
                  </div>
                </div>
                
                {/* Large Card 3 - Purple/Pink/Rose (Center) with Music & Speaking icons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-3xl bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 opacity-90 animate-float-slower shadow-2xl shadow-purple-500/50 overflow-hidden">
                  {/* Small cards inside - consistent 48px size */}
                  <div className="absolute top-3 left-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">🎹</span>
                  </div>
                  <div className="absolute top-3 right-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">🎤</span>
                  </div>
                  <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">�</span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">🗣️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced with More Color */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Join The Learning Revolution
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Thousands of students are already mastering new skills with us
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[
                { number: "10,000+", label: "Happy Students", subtext: "Learning Daily", gradient: "from-cyan-400 to-blue-500", icon: "👨‍🎓", bgGlow: "bg-cyan-400/20" },
                { number: "50+", label: "Expert Instructors", subtext: "Certified & Trained", gradient: "from-pink-400 to-rose-500", icon: "👩‍🏫", bgGlow: "bg-pink-400/20" },
                { number: "11+", label: "Skill Courses", subtext: "And Growing", gradient: "from-amber-400 to-orange-500", icon: "📚", bgGlow: "bg-amber-400/20" },
                { number: "98%", label: "Satisfaction Rate", subtext: "Parent Approved", gradient: "from-emerald-400 to-green-500", icon: "⭐", bgGlow: "bg-emerald-400/20" }
              ].map((stat, i) => (
                <div key={i} className="group relative">
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 ${stat.bgGlow} rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  
                  {/* Card */}
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-7 md:p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-3 border border-white/50 overflow-hidden">
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full`}></div>
                    
                    {/* Icon */}
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                    
                    {/* Number */}
                    <div className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      {stat.number}
                    </div>
                    
                    {/* Label */}
                    <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight mb-1">
                      {stat.label}
                    </div>
                    
                    {/* Subtext */}
                    <div className="text-xs sm:text-sm text-gray-600">
                      {stat.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Find Your Best Courses Section */}
      <CourseRecommendationSection />

      {/* How It Works - New Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold">Simple Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Getting Started Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Super Easy</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Join thousands of students in just 3 simple steps
              </p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 relative">
              {/* Connection Lines - Desktop Only */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30" style={{width: 'calc(100% - 8rem)', left: '4rem'}}></div>

              {[
                {
                  step: "01",
                  title: "Choose Your Course",
                  description: "Browse our 11+ courses and pick what excites your child the most",
                  icon: <BookOpen className="w-8 h-8" />,
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "bg-blue-500/10"
                },
                {
                  step: "02",
                  title: "Book Free Trial",
                  description: "Try a live class absolutely free—no credit card, no commitment",
                  icon: <Target className="w-8 h-8" />,
                  color: "from-purple-500 to-pink-500",
                  bgColor: "bg-purple-500/10"
                },
                {
                  step: "03",
                  title: "Start Learning",
                  description: "Join small interactive classes and watch your child grow",
                  icon: <Zap className="w-8 h-8" />,
                  color: "from-orange-500 to-pink-500",
                  bgColor: "bg-orange-500/10"
                }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {/* Card */}
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all group hover:bg-white/10">
                    {/* Step Number */}
                    <div className={`absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>

                    {/* Icon Circle */}
                    <div className={`w-20 h-20 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 mt-8 group-hover:scale-110 transition-transform`}>
                      <div className={`text-white bg-gradient-to-br ${item.color} w-16 h-16 rounded-xl flex items-center justify-center`}>
                        {item.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12 md:mt-16">
              <Link href="#trial" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105">
                Start Your Free Trial Now
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {[
                { title: "Art & Drawing", age: "Ages 5-15", gradient: "from-rose-500 to-pink-600", icon: "🎨", bgPattern: "from-rose-50 via-pink-50 to-rose-100", description: "Unleash creativity on canvas" },
                { title: "Chess", age: "Ages 6-16", gradient: "from-slate-700 to-gray-900", icon: "♟️", bgPattern: "from-slate-50 via-gray-50 to-slate-100", description: "Master strategic thinking" },
                { title: "Piano", age: "Ages 5-15", gradient: "from-violet-500 to-purple-600", icon: "🎹", bgPattern: "from-violet-50 via-purple-50 to-violet-100", description: "Create beautiful melodies" },
                { title: "Phonics", age: "Ages 4-8", gradient: "from-sky-500 to-blue-600", icon: "🅰️", bgPattern: "from-sky-50 via-blue-50 to-sky-100", description: "Build reading confidence" },
                { title: "Public Speaking", age: "Ages 7-17", gradient: "from-emerald-500 to-green-600", icon: "🎤", bgPattern: "from-emerald-50 via-green-50 to-emerald-100", description: "Speak with confidence" },
                { title: "Abacus", age: "Ages 5-12", gradient: "from-amber-500 to-orange-600", icon: "🧮", bgPattern: "from-amber-50 via-orange-50 to-amber-100", description: "Lightning-fast mental math" },
                { title: "Reader's Club", age: "Ages 6-14", gradient: "from-orange-500 to-red-600", icon: "📚", bgPattern: "from-orange-50 via-red-50 to-orange-100", description: "Discover reading joy" },
                { title: "Toastmaster", age: "Ages 10-17", gradient: "from-teal-500 to-cyan-600", icon: "🗣️", bgPattern: "from-teal-50 via-cyan-50 to-teal-100", description: "Lead and inspire others" },
                { title: "Sholak", age: "Ages 7-15", gradient: "from-indigo-500 to-purple-600", icon: "🎯", bgPattern: "from-indigo-50 via-purple-50 to-indigo-100", description: "Ancient wisdom meets modern" },
                { title: "Computers", age: "Ages 8-16", gradient: "from-blue-500 to-cyan-600", icon: "💻", bgPattern: "from-blue-50 via-cyan-50 to-blue-100", description: "Code the future" },
                { title: "Rubiks Cube", age: "Ages 6-14", gradient: "from-fuchsia-500 to-pink-600", icon: "🧩", bgPattern: "from-fuchsia-50 via-pink-50 to-fuchsia-100", description: "Puzzle-solving genius" }
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
                        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${course.gradient} text-white text-sm font-bold rounded-full shadow-lg`}>
                          <Users className="w-4 h-4" />
                          {course.age}
                        </div>
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
                  age: "10 years", 
                  location: "Mumbai", 
                  course: "Art Champion", 
                  quote: "I never imagined I could draw like this! My teacher helped me discover my artistic side, and now I love creating art every day.",
                  gradient: "from-rose-500 to-pink-600",
                  rating: 5,
                  image: "👧"
                },
                { 
                  name: "Rohan Patel", 
                  age: "12 years", 
                  location: "Delhi", 
                  course: "Chess Master", 
                  quote: "Chess taught me to think ahead and solve problems. Now I'm winning tournaments and even teaching my friends!",
                  gradient: "from-blue-500 to-cyan-600",
                  rating: 5,
                  image: "🧑"
                },
                { 
                  name: "Priya Reddy", 
                  age: "9 years", 
                  location: "Bangalore", 
                  course: "Piano Prodigy", 
                  quote: "Playing piano brings me so much joy! I performed at my school's annual function and everyone loved it.",
                  gradient: "from-purple-500 to-indigo-600",
                  rating: 5,
                  image: "👧"
                },
                {
                  name: "Mrs. Kapoor",
                  age: "Parent",
                  location: "Pune",
                  course: "Public Speaking Student",
                  quote: "My son was extremely shy. After joining the Public Speaking course, his confidence has skyrocketed. Thank you Playfit!",
                  gradient: "from-green-500 to-emerald-600",
                  rating: 5,
                  image: "👩"
                },
                {
                  name: "Aarav Kumar",
                  age: "11 years",
                  location: "Hyderabad",
                  course: "Abacus Champion",
                  quote: "Mental math is now my superpower! I can calculate faster than calculators and it's so much fun.",
                  gradient: "from-amber-500 to-orange-600",
                  rating: 5,
                  image: "👦"
                },
                {
                  name: "Mr. & Mrs. Singh",
                  age: "Parents",
                  location: "Kolkata",
                  course: "Piano Students",
                  quote: "Both our daughters take piano lessons. The teachers are patient, skilled, and genuinely care about their progress.",
                  gradient: "from-teal-500 to-cyan-600",
                  rating: 5,
                  image: "👨‍👩"
                }
              ].map((testimonial, i) => (
                <div key={i} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-white hover:border-purple-200">
                  {/* Quote Mark */}
                  <div className="text-6xl text-purple-200 leading-none mb-4">"</div>
                  
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
                      <p className="text-sm text-gray-600">{testimonial.age} • {testimonial.location}</p>
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

      {/* Why Parents Trust Us - Benefits Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why 10,000+ Parents Choose Us
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                We're committed to providing the best online learning experience for your child
              </p>
            </div>

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
                <div key={i} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`}></div>
                  <div className="relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-gray-200 transition-all hover:shadow-lg">
                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Guarantee Badge */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-gray-900">100% Satisfaction Guarantee</div>
                  <div className="text-sm text-gray-600">Not happy? Get a full refund within first 7 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced Book Free Trial */}
      <section id="trial" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden safe-bottom">
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
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                        Parent's Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="Enter your full name"
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

                    <div>
                      <label htmlFor="grade" className="block text-sm font-semibold text-gray-900 mb-2">
                        Child's Age / Grade *
                      </label>
                      <input
                        type="text"
                        id="grade"
                        name="grade"
                        required
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="e.g., 10 years / Grade 5"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="course" className="block text-sm font-semibold text-gray-900 mb-2">
                      Which course interests you? (Optional)
                    </label>
                    <select
                      id="course"
                      name="course"
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
                    </select>
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
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-white font-semibold">4.9/5 from 500+ reviews</span>
              </div>
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
                    src="/images/playfit-logo.jpg"
                    alt="Playfit"
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                  />
                </Link>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  Empowering children with creative and skill-building courses in Art, Chess, Piano, Public Speaking, Abacus, and more.
                </p>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">4.9/5 from 500+ reviews</p>
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
                  <li><Link href="#trial" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Free Trial</Link></li>
                  <li><Link href="/login" className="text-xs sm:text-sm text-gray-300 hover:text-pink-400 transition-colors block py-1 hover:translate-x-1 transition-transform">Student Login</Link></li>
                  <li><a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-green-400 transition-colors block py-1 hover:translate-x-1 transition-transform">FAQs</a></li>
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
                    <span className="break-all group-hover:text-blue-400 transition-colors">support@playfit.com</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 group">
                    <Phone className="w-4 h-4 flex-shrink-0 group-hover:text-green-400 transition-colors" />
                    <span className="group-hover:text-green-400 transition-colors">+1 (234) 567-890</span>
                  </li>
                </ul>
                
                {/* CTA Button */}
                <div className="mt-6">
                  <Link href="#trial" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Start Free Trial
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
