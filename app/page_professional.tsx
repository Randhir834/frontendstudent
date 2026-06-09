'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Zap, Rocket, Heart, GraduationCap, Award, Target, Lightbulb, Globe, Clock, TrendingUp, PlayCircle, Shield, Quote } from 'lucide-react';
import { trialService } from '@/services/trialService';
import CourseRecommendationSection from '@/components/CourseRecommendation/CourseRecommendationSection';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', grade: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await trialService.requestTrial(formData);
      setSubmitted(true);
      // Reset form after 5 seconds
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 text-foreground overflow-x-hidden">
      {/* Enhanced Header */}
      <header className={`w-full py-4 pr-6 md:pr-12 pl-2 md:pl-4 flex justify-between items-center bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'shadow-2xl py-3 bg-white/95' : ''}`}>
        <div className="flex items-center">
          <Link href="/" className="relative flex items-center justify-start shrink-0 transition-all duration-300 h-12 sm:h-14 md:h-16 w-auto hover:scale-105 group">
            <img
              src="/images/playfit-logo.jpg"
              alt="PlayFit LMS"
              className="w-auto h-full object-contain max-w-full max-h-full transform group-hover:rotate-2 transition-transform"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 font-semibold text-dark-700">
            <a href="#features" className="hover:text-primary-600 transition-all relative group py-2">
              Features
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
            <a href="#why-choose" className="hover:text-primary-600 transition-all relative group py-2">
              Why Choose Us
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
            <a href="#testimonials" className="hover:text-primary-600 transition-all relative group py-2">
              Testimonials
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
            <a href="#trial" className="hover:text-primary-600 transition-all relative group py-2">
              Free Trial
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
          </nav>
          <Link href="/login" className="hidden md:flex bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2 group">
            Login
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-primary-50 transition-all active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-primary-600" /> : <Menu className="w-6 h-6 text-dark-700" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Enhanced */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/98 backdrop-blur-xl animate-in fade-in slide-in-from-top duration-300">
          <nav className="flex flex-col items-center justify-center h-full gap-8 text-xl font-semibold p-6">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Features</a>
            <a href="#why-choose" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Why Choose Us</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Testimonials</a>
            <a href="#trial" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Free Trial</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-10 py-4 rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 mt-6">
              Login
              <ArrowRight className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      )}

      {/* Spectacular Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative w-full px-6 py-24 md:py-36 lg:py-44 flex flex-col md:flex-row items-center justify-center gap-16 bg-gradient-to-br from-white via-primary-50/40 to-secondary-50/50 overflow-hidden">
          {/* Ultra-Enhanced animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large gradient orbs */}
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary-300/40 to-primary-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-secondary-300/40 to-secondary-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-primary-400/30 to-secondary-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
            
            {/* Floating elements */}
            <div className="absolute top-1/4 left-[10%] animate-float-slow">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 rounded-2xl rotate-12 backdrop-blur-sm"></div>
            </div>
            <div className="absolute top-1/3 right-[15%] animate-float-slower">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full backdrop-blur-sm"></div>
            </div>
            <div className="absolute bottom-1/4 left-[15%] animate-float">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-teal/20 to-primary-300/20 rounded-xl -rotate-12 backdrop-blur-sm"></div>
            </div>
            
            {/* Decorative dots pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Hero Content - Left Side */}
          <div className="md:w-1/2 flex flex-col gap-8 max-w-2xl z-10 animate-in slide-in-from-left duration-1000">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-primary-100 via-secondary-100 to-primary-100 text-primary-900 px-6 py-3 rounded-full text-sm font-bold w-fit shadow-lg hover:shadow-xl transition-all cursor-default border border-primary-200/50 backdrop-blur-sm group">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600"></span>
              </span>
              <Zap className="w-4 h-4 text-accent-yellow group-hover:rotate-12 transition-transform" />
              <span className="bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent font-extrabold">New Interactive Courses Available!</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-dark-900 leading-[1.1]">
              Your Future Starts
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-size-200 animate-gradient drop-shadow-sm">
                With Learning
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-dark-600 leading-relaxed max-w-xl font-medium">
              Transform your potential into <span className="text-primary-600 font-bold">achievement</span> with world-class education, expert mentors, and a vibrant learning community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="#trial" className="group relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(30,136,229,0.5)] hover:-translate-y-1 flex items-center gap-3 overflow-hidden bg-size-200 hover:bg-right-bottom">
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </a>
              <a href="#features" className="group bg-white border-2 border-primary-300 hover:border-primary-600 hover:bg-primary-50 text-dark-800 hover:text-primary-700 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3">
                Explore Features
                <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-8 pt-8 border-t-2 border-gray-200">
              {/* Student Avatars */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    'from-blue-400 to-blue-600',
                    'from-purple-400 to-purple-600',
                    'from-pink-400 to-pink-600',
                    'from-green-400 to-green-600',
                    'from-yellow-400 to-yellow-600'
                  ].map((gradient, i) => (
                    <div key={i} className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg transform hover:scale-110 hover:z-10 transition-all cursor-pointer`}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-dark-800">
                    <span className="text-primary-600 text-lg">10,000+</span> Happy Students
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-teal to-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-dark-900">98%</p>
                    <p className="text-xs text-dark-600 font-semibold">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Visual - Right Side */}
          <div className="md:w-1/2 relative flex justify-center items-center z-10 w-full max-w-2xl animate-in slide-in-from-right duration-1000 delay-200">
            <div className="relative w-full aspect-square max-w-lg">
              {/* Glow effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-400/30 via-secondary-400/30 to-primary-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-8 bg-gradient-to-tr from-primary-300/40 via-secondary-300/40 to-primary-400/40 rounded-full blur-2xl animate-blob"></div>
              
              {/* Main visual card */}
              <div className="relative w-full h-full bg-gradient-to-br from-white via-primary-50/50 to-secondary-50/50 rounded-[3rem] border-[16px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col transform hover:scale-[1.02] hover:rotate-1 transition-all duration-700 group">
                {/* Top decorative bar */}
                <div className="w-full h-16 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 flex items-center justify-between px-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/80"></div>
                    <div className="w-3 h-3 rounded-full bg-white/80"></div>
                    <div className="w-3 h-3 rounded-full bg-white/80"></div>
                  </div>
                  <div className="text-white text-xs font-bold tracking-wider">PLAYFIT LMS</div>
                </div>
                
                {/* Content area */}
                <div className="flex-1 w-full bg-gradient-to-br from-primary-50/60 via-white to-secondary-50/60 flex items-center justify-center relative overflow-hidden p-12">
                  {/* Animated blobs */}
                  <div className="absolute top-8 left-8 w-56 h-56 bg-gradient-to-br from-secondary-200/50 to-secondary-300/50 rounded-full mix-blend-multiply opacity-60 animate-blob blur-xl"></div>
                  <div className="absolute top-8 right-8 w-56 h-56 bg-gradient-to-br from-primary-200/50 to-primary-300/50 rounded-full mix-blend-multiply opacity-60 animate-blob animation-delay-2000 blur-xl"></div>
                  <div className="absolute -bottom-20 left-1/2 w-64 h-64 bg-gradient-to-br from-accent-teal/30 to-primary-300/30 rounded-full mix-blend-multiply opacity-60 animate-blob animation-delay-4000 blur-xl"></div>
                  
                  {/* Central trophy card */}
                  <div className="z-20 bg-white/98 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.25)] border-2 border-white/90 flex flex-col gap-6 text-center transform group-hover:scale-105 group-hover:-translate-y-3 transition-all duration-700">
                    {/* Trophy icon with glow */}
                    <div className="relative mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow to-accent-orange rounded-[2rem] blur-2xl opacity-50 animate-pulse"></div>
                      <div className="relative w-28 h-28 bg-gradient-to-br from-accent-yellow via-accent-orange to-accent-pink rounded-[2rem] flex items-center justify-center shadow-2xl text-white transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                        <Trophy size={60} className="drop-shadow-2xl" />
                      </div>
                    </div>
                    
                    {/* Text content */}
                    <div>
                      <h3 className="font-black text-dark-900 text-4xl tracking-tight mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Top Rated</h3>
                      <p className="text-dark-700 text-xl font-bold mb-4">Learning Platform 2026</p>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-md animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-black text-dark-900">5.0</span>
                        <div className="h-6 w-[1px] bg-gray-300"></div>
                        <span className="text-sm font-bold text-dark-600">10,000+ Reviews</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating stats cards */}
                  <div className="absolute top-16 left-6 bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-white/80 transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-teal to-primary-500 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-dark-900">500+</p>
                        <p className="text-xs text-dark-600 font-semibold">Live Classes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-16 right-6 bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-white/80 transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-dark-900">1000+</p>
                        <p className="text-xs text-dark-600 font-semibold">Courses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Feature Highlights */}
        <section id="features" data-animate="features" className="py-28 px-6 bg-gradient-to-b from-white via-primary-50/20 to-white flex flex-col items-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-200/20 to-primary-200/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl w-full relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-primary-200/50">
                <Rocket className="w-5 h-5 text-accent-orange" />
                Powerful Features
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-dark-900 mb-6 tracking-tight">
                Everything You Need to
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Excel in Learning
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Our comprehensive platform provides cutting-edge tools and features designed to accelerate your educational journey and unlock your full potential.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  icon: BookOpen, 
                  title: "Premium Content Library", 
                  desc: "Access an extensive collection of expertly curated courses, videos, documents, and interactive materials across all subjects.", 
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100/50",
                  iconBg: "from-blue-400 to-blue-600"
                },
                { 
                  icon: Users, 
                  title: "Live Expert Instructors", 
                  desc: "Learn directly from industry-certified professionals through interactive live sessions with real-time Q&A and personalized guidance.", 
                  color: "from-purple-500 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100/50",
                  iconBg: "from-purple-400 to-purple-600"
                },
                { 
                  icon: Trophy, 
                  title: "Progress Tracking", 
                  desc: "Monitor your growth with comprehensive analytics, milestone tracking, achievement badges, and detailed performance insights.", 
                  color: "from-green-500 to-green-600",
                  bgColor: "from-green-50 to-green-100/50",
                  iconBg: "from-green-400 to-green-600"
                },
                { 
                  icon: Target, 
                  title: "Personalized Learning Path", 
                  desc: "AI-powered recommendations create customized learning journeys tailored to your goals, pace, and learning style.", 
                  color: "from-orange-500 to-orange-600",
                  bgColor: "from-orange-50 to-orange-100/50",
                  iconBg: "from-accent-orange to-accent-yellow"
                },
                { 
                  icon: Shield, 
                  title: "Secure & Private", 
                  desc: "Your data is protected with enterprise-grade security. Learn with confidence knowing your information is safe.", 
                  color: "from-teal-500 to-teal-600",
                  bgColor: "from-teal-50 to-teal-100/50",
                  iconBg: "from-accent-teal to-primary-500"
                },
                { 
                  icon: Lightbulb, 
                  title: "Interactive Quizzes", 
                  desc: "Test your knowledge with engaging assessments, instant feedback, and detailed explanations to reinforce learning.", 
                  color: "from-pink-500 to-pink-600",
                  bgColor: "from-pink-50 to-pink-100/50",
                  iconBg: "from-accent-pink to-accent-purple"
                }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="group bg-gradient-to-br from-white to-white rounded-3xl p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 transform hover:-translate-y-3 relative overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Hover gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`}></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.iconBg} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <feature.icon size={36} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-dark-900 mb-4 group-hover:text-primary-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-dark-600 leading-relaxed mb-6 font-medium">
                      {feature.desc}
                    </p>
                    
                    {/* CTA */}
                    <div className="pt-6 border-t-2 border-gray-100 group-hover:border-primary-200 transition-colors">
                      <a href="#trial" className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.color} font-bold flex items-center gap-2 group-hover:gap-3 transition-all`}>
                        Explore Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Section: Why Choose PlayFit */}
        <section id="why-choose" data-animate="why-choose" className="py-28 px-6 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-secondary-500/20 to-primary-500/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-bold mb-6 border border-white/20">
                <Heart className="w-5 h-5 text-accent-pink" />
                Why Students Love Us
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                The PlayFit <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow via-accent-orange to-accent-pink">Advantage</span>
              </h2>
              <p className="text-dark-100 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Join thousands of successful students who transformed their futures with our innovative learning platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  icon: Clock,
                  title: "Learn At Your Own Pace",
                  desc: "No pressure, no deadlines. Study when it suits you best with 24/7 access to all course materials.",
                  stat: "24/7 Access"
                },
                {
                  icon: TrendingUp,
                  title: "Proven Results",
                  desc: "98% of our students report significant improvement in their grades and understanding within 3 months.",
                  stat: "98% Success"
                },
                {
                  icon: Globe,
                  title: "Global Community",
                  desc: "Connect with fellow learners worldwide. Share insights, collaborate on projects, and grow together.",
                  stat: "50+ Countries"
                },
                {
                  icon: Award,
                  title: "Industry Recognition",
                  desc: "Our certifications are recognized by top universities and employers, giving you a competitive edge.",
                  stat: "Certified Courses"
                }
              ].map((item, i) => (
                <div key={i} className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/20 hover:scale-105 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-yellow to-accent-orange rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 flex-shrink-0">
                      <item.icon size={32} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                        <span className="text-accent-yellow font-black text-sm px-3 py-1 bg-white/10 rounded-full">{item.stat}</span>
                      </div>
                      <p className="text-dark-100 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outstanding Testimonials Section */}
        <section id="testimonials" data-animate="testimonials" className="py-28 px-6 bg-gradient-to-b from-white via-secondary-50/30 to-white flex flex-col items-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl w-full relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary-100 to-accent-yellow-light text-secondary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-secondary-200/50">
                <Star className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                Student Success Stories
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-dark-900 mb-6 tracking-tight">
                Loved By Students
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-primary-600">
                  Around The World
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Don't just take our word for it. Hear from thousands of students whose lives have been transformed through PlayFit.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Sarah Johnson",
                  role: "High School Student",
                  grade: "Grade 11",
                  content: "PlayFit completely transformed my study habits! The interactive lessons and live sessions with instructors helped me boost my grades from B to A+. I actually look forward to learning now!",
                  rating: 5,
                  avatar: "SJ",
                  color: "from-blue-400 to-blue-600",
                  improvement: "+2 Grades"
                },
                {
                  name: "Michael Chen",
                  role: "College Student",
                  grade: "Computer Science",
                  content: "The progress tracking feature is a game-changer. I can see exactly where I need to focus my efforts. The instructors are incredibly knowledgeable and always ready to help clarify complex concepts.",
                  rating: 5,
                  avatar: "MC",
                  color: "from-purple-400 to-purple-600",
                  improvement: "4.0 GPA"
                },
                {
                  name: "Emily Rodriguez",
                  role: "Professional Learner",
                  grade: "Career Development",
                  content: "I've tried countless online platforms, but PlayFit is in a league of its own. The quality of content, community support, and personalized learning paths are absolutely unmatched. Worth every penny!",
                  rating: 5,
                  avatar: "ER",
                  color: "from-pink-400 to-pink-600",
                  improvement: "Promoted"
                }
              ].map((testimonial, i) => (
                <div key={i} className="group bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-700 transform hover:-translate-y-3 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-secondary-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                        ))}
                      </div>
                      <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {testimonial.improvement}
                      </span>
                    </div>
                    
                    {/* Quote icon */}
                    <Quote className="w-10 h-10 text-primary-300 mb-4 group-hover:text-primary-500 transition-colors" />
                    
                    {/* Content */}
                    <p className="text-dark-700 leading-relaxed mb-8 font-medium text-lg">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100 group-hover:border-primary-200 transition-colors">
                      <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-dark-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-dark-600 font-semibold">{testimonial.role}</p>
                        <p className="text-xs text-primary-600 font-bold mt-1">{testimonial.grade}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Stats bar */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                {[
                  { number: "10,000+", label: "Active Students" },
                  { number: "98%", label: "Success Rate" },
                  { number: "1,000+", label: "Courses" },
                  { number: "500+", label: "Expert Instructors" }
                ].map((stat, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-primary-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Course Recommendation Section */}
        <CourseRecommendationSection />

        {/* Form Section */}
        <section id="trial" className="py-24 px-6 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 relative overflow-hidden flex justify-center">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-overlay blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-overlay blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400 rounded-full mix-blend-overlay blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 relative z-10 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Limited Time Offer
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to Transform Your Learning?</h2>
              <p className="text-dark-200 text-lg md:text-xl leading-relaxed">
                Book a free trial today and get 7 days of unlimited access to our premium course materials and instructor guidance. No credit card required.
              </p>
              <ul className="space-y-4 mt-8">
                {[
                  { icon: CheckCircle, text: "Personalized skill assessment" },
                  { icon: CheckCircle, text: "Access to beginner courses" },
                  { icon: CheckCircle, text: "1-on-1 instructor consultation" },
                  { icon: CheckCircle, text: "Progress tracking dashboard" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark-100 group">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                      <item.icon className="text-primary-400 w-5 h-5 flex-shrink-0" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 backdrop-blur-xl transform hover:scale-105 transition-transform duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-2">Book Your Free Trial</h3>
                <p className="text-sm text-dark-500">Fill out the form below and we&apos;ll be in touch shortly.</p>
              </div>
              
              {submitted ? (
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 text-primary-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Trial Requested! 🎉</h4>
                    <p className="text-primary-700">Thanks for reaching out. We'll contact you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center animate-in shake-in duration-300">
                      {error}
                    </div>
                  )}
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-semibold text-dark-900">Full Name</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-semibold text-dark-900">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </div>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-sm font-semibold text-dark-900">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Grade field */}
                  <div className="space-y-1.5">
                    <label htmlFor="grade" className="block text-sm font-semibold text-dark-900">Grade / Class</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      </div>
                      <input 
                        type="text" 
                        id="grade" 
                        name="grade"
                        required
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Claim My Free Trial
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-dark-500 mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="relative flex items-center justify-center shrink-0 transition-all duration-300 h-12 w-auto hover:scale-105">
                <img
                  src="/images/playfit-logo.jpg"
                  alt="PlayFit LMS"
                  className="w-full h-full object-contain max-w-full max-h-full"
                />
              </Link>
            </div>
            <p className="max-w-md text-gray-400 leading-relaxed mb-6">Empowering your learning journey through expert-led courses and a supportive community platform. Join thousands of students achieving their goals.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Features</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Testimonials</a></li>
              <li><a href="#trial" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Free Trial</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PlayFit. All rights reserved. Made with ❤️ for learners worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
