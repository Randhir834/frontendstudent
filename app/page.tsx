'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Quote, Zap, Target, Award, PlayCircle, Clock, TrendingUp, Shield, Lightbulb, Rocket, Heart, Globe, GraduationCap, Award as AwardIcon, Brain, Puzzle, GamepadIcon as Gamepad2, UserCheck } from 'lucide-react';
import { trialService } from '@/services/trialService';
import CourseRecommendationSection from '@/components/CourseRecommendation/CourseRecommendationSection';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', grade: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      {/* 🎯 NEW: Premium PlayFit Hero Section - Professional Design */}
      <main className="flex-1 flex flex-col">
        <section className="relative w-full px-6 py-20 md:py-24 lg:py-32 flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-green-50/30">
          {/* Clean Premium Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-green-50/30"></div>
          </div>
          
          {/* Content Container with proper spacing */}
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            
            {/* Left Side - Hero Content */}
            <div className="flex flex-col gap-8 max-w-2xl">
              {/* Main Headline - Clean Typography */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-dark-900 leading-[1.1]">
                Where Kids
                <span className="block mt-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">Learn</span>
                  <span className="mx-3 text-dark-400">•</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-accent-orange">Play</span>
                  <span className="mx-3 text-dark-400">•</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-secondary-600">Grow</span>
                </span>
              </h1>
              
              {/* Kid-Friendly Subheading */}
              <p className="text-xl md:text-2xl text-dark-600 leading-relaxed font-medium">
                Interactive courses, live classes, quizzes, achievements and fun learning experiences designed for <span className="font-bold text-primary-600">children aged 8-18</span>.
              </p>
              
              {/* CTA Buttons with proper spacing */}
              <div className="flex flex-wrap gap-4 mt-6">
                <a href="#trial" className="group relative bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </a>
                <a href="#features" className="group bg-white border-2 border-primary-300 hover:border-primary-600 hover:bg-primary-50 text-dark-800 hover:text-primary-700 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  Explore Courses
                </a>
              </div>
              
              {/* Trusted by Students Section */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t-2 border-gray-200">
                <div className="flex -space-x-3">
                  {[
                    { gradient: 'from-blue-400 to-blue-600', icon: GraduationCap },
                    { gradient: 'from-purple-400 to-purple-600', icon: Trophy },
                    { gradient: 'from-pink-400 to-pink-600', icon: Star },
                    { gradient: 'from-green-400 to-green-600', icon: BookOpen }
                  ].map(({ gradient, icon: Icon }, i) => (
                    <div key={i} className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} border-3 border-white flex items-center justify-center text-white shadow-lg transform hover:scale-110 hover:z-10 transition-all cursor-pointer`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-dark-800">
                    <span className="text-primary-600 text-base">10,000+</span> Happy Students
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Professional Illustration Card */}
            <div className="relative flex justify-center items-center w-full">
              {/* Main Card Container - Clean Design */}
              <div className="relative w-full max-w-2xl">
                {/* Subtle glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-200/20 via-secondary-200/20 to-primary-200/20 rounded-[4rem] blur-3xl"></div>
                
                {/* Main Content Card - All badges must be INSIDE this container */}
                <div className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border-4 border-white/80 overflow-visible">
                  
                  {/* Central Circle with Student Avatar */}
                  <div className="flex flex-col items-center justify-center mb-8 relative z-10">
                    <div className="relative mb-8">
                      {/* Gradient Circle Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-secondary-400 to-primary-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                      
                      {/* Main Circle */}
                      <div className="relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-primary-500 via-teal-400 to-secondary-500 rounded-full flex items-center justify-center shadow-2xl">
                        {/* Student Emoji */}
                        <div className="text-7xl md:text-8xl">🧒</div>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-black text-dark-900 mb-3 text-center">Happy Learning!</h3>
                    <p className="text-xl font-bold text-dark-600 mb-6 text-center">Join the Fun</p>
                    
                    {/* 5 Star Rating */}
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Floating Badge Elements - ALL INSIDE THE CARD */}
                  {/* Top Left - Puzzle */}
                  <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-white rounded-2xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl border-2 border-orange-100 transform hover:scale-110 transition-all duration-300 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <Puzzle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-bold text-dark-900 hidden md:block">Puzzle</span>
                    </div>
                  </div>
                  
                  {/* Top Right - Trophy */}
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 bg-white rounded-2xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl border-2 border-yellow-100 transform hover:scale-110 transition-all duration-300 z-20">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-dark-900 hidden md:block">Trophy</span>
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Left - Graduation */}
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white rounded-2xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl border-2 border-purple-100 transform hover:scale-110 transition-all duration-300 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-bold text-dark-900 hidden md:block">Graduate</span>
                    </div>
                  </div>
                  
                  {/* Bottom Right - Star */}
                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-white rounded-2xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl border-2 border-pink-100 transform hover:scale-110 transition-all duration-300 z-20">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-dark-900 hidden md:block">Star</span>
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle Right - Rocket (INSIDE) */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 bg-white rounded-2xl px-3 py-2.5 shadow-xl border-2 border-teal-100 transform hover:scale-110 transition-all duration-300 z-20">
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle Left - Book (INSIDE) */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6 bg-white rounded-2xl px-3 py-2.5 shadow-xl border-2 border-green-100 transform hover:scale-110 transition-all duration-300 z-20">
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🎨 Enhanced Features Section - Colorful Cards */}
        <section id="features" data-animate="features" className="py-28 px-6 bg-gradient-to-b from-white via-primary-50/20 to-white flex flex-col items-center relative overflow-hidden">
          <div className="max-w-7xl w-full relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-primary-200/50">
                <Rocket className="w-5 h-5 text-accent-orange" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Everything You Need to
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Excel in Learning
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Our comprehensive platform provides cutting-edge tools and features designed to accelerate your educational journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  icon: BookOpen, 
                  title: "Premium Content", 
                  desc: "Access an extensive collection of expertly curated courses, videos, and interactive materials.", 
                  color: "primary",
                  topBorder: "border-t-8 border-primary-500",
                  iconBg: "from-primary-400 to-primary-600"
                },
                { 
                  icon: Users, 
                  title: "Live Classes", 
                  desc: "Learn directly from certified professionals through interactive live sessions with real-time Q&A.", 
                  color: "purple",
                  topBorder: "border-t-8 border-accent-purple",
                  iconBg: "from-accent-purple to-purple-600"
                },
                { 
                  icon: Trophy, 
                  title: "Progress Tracking", 
                  desc: "Monitor your growth with analytics, milestone tracking, and achievement badges.", 
                  color: "green",
                  topBorder: "border-t-8 border-secondary-500",
                  iconBg: "from-secondary-400 to-secondary-600"
                },
                { 
                  icon: Target, 
                  title: "Personalized Learning", 
                  desc: "AI-powered recommendations create customized learning journeys tailored to your goals.", 
                  color: "orange",
                  topBorder: "border-t-8 border-accent-orange",
                  iconBg: "from-accent-orange to-accent-yellow"
                },
                { 
                  icon: Gamepad2, 
                  title: "Interactive Quiz", 
                  desc: "Test your knowledge with engaging assessments and instant feedback to reinforce learning.", 
                  color: "pink",
                  topBorder: "border-t-8 border-accent-pink",
                  iconBg: "from-accent-pink to-pink-600"
                },
                { 
                  icon: Shield, 
                  title: "Secure Platform", 
                  desc: "Your data is protected with enterprise-grade security. Learn with complete confidence.", 
                  color: "teal",
                  topBorder: "border-t-8 border-accent-teal",
                  iconBg: "from-accent-teal to-teal-600"
                }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className={`group bg-white rounded-[32px] p-8 ${feature.topBorder} hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative z-10">
                    {/* Icon with bounce animation */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.iconBg} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:animate-bounce transition-all duration-500`}>
                      <feature.icon size={36} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-dark-900 mb-4 group-hover:text-primary-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-dark-600 leading-relaxed mb-6 font-medium">
                      {feature.desc}
                    </p>
                    
                    {/* CTA with arrow */}
                    <div className="pt-6 border-t-2 border-gray-100 group-hover:border-primary-200 transition-colors">
                      <a href="#trial" className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.iconBg} font-bold flex items-center gap-2 group-hover:gap-3 transition-all`}>
                        Learn More
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 💝 New Section: Why Parents Love PlayFit */}
        <section id="why-choose" data-animate="why-choose" className="py-28 px-6 bg-white relative overflow-hidden">
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary-100 to-accent-yellow-light text-secondary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-secondary-200/50">
                <Heart className="w-5 h-5 text-accent-pink" />
                Why Parents Love PlayFit
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Why Parents Love PlayFit
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Join thousands of families who trust PlayFit to provide safe, engaging, and effective learning experiences for their children.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  icon: Brain,
                  title: "Smart Learning",
                  desc: "AI-powered personalized learning paths adapt to each child's unique pace and learning style for maximum growth.",
                  color: "from-primary-400 to-primary-600"
                },
                {
                  icon: Target,
                  title: "Personalized Growth", 
                  desc: "Every child gets a customized learning journey with goals, achievements, and progress tracking tailored to their needs.",
                  color: "from-secondary-400 to-secondary-600"
                },
                {
                  icon: Trophy,
                  title: "Achievement Badges",
                  desc: "Motivating reward system with digital badges, certificates, and achievements that celebrate every milestone.",
                  color: "from-accent-yellow to-accent-orange"
                },
                {
                  icon: UserCheck,
                  title: "Expert Mentors",
                  desc: "Certified educators and subject matter experts provide guidance, support, and personalized attention.",
                  color: "from-accent-purple to-accent-pink"
                }
              ].map((item, i) => (
                <div key={i} className="group bg-white border-2 border-gray-100 hover:border-primary-200 rounded-[32px] p-8 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 flex-shrink-0`}>
                      <item.icon size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-dark-900 mb-3">{item.title}</h3>
                      <p className="text-dark-600 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* 🚀 Enhanced CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-br from-primary-600 via-secondary-500 to-primary-600 relative overflow-hidden flex justify-center">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 opacity-10">
              <Rocket className="w-32 h-32 text-white animate-float-slow" />
            </div>
            <div className="absolute bottom-16 left-16 opacity-10">
              <Trophy className="w-28 h-28 text-white animate-float" />
            </div>
            <div className="absolute top-32 left-1/4 opacity-5">
              <Star className="w-24 h-24 text-white animate-float-slower" />
            </div>
            <div className="absolute bottom-32 right-1/3 opacity-5">
              <Star className="w-20 h-20 text-white animate-float" />
            </div>
          </div>
          
          <div className="max-w-6xl w-full relative z-10 text-center">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Ready To Start Your Child's
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow via-accent-orange to-accent-yellow">
                  Learning Journey?
                </span>
              </h2>
              <p className="text-white/90 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium">
                Join thousands of families worldwide and give your child the gift of engaging, effective learning.
              </p>
            </div>
            
            <a href="#trial" className="group relative inline-flex bg-white hover:bg-gray-50 text-primary-700 hover:text-primary-800 px-12 py-6 rounded-full font-bold text-xl transition-all shadow-2xl hover:shadow-[0_25px_80px_-20px_rgba(255,255,255,0.6)] hover:-translate-y-2 items-center gap-4 overflow-hidden">
              <Rocket className="w-8 h-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
              <span className="relative z-10">Start Free Trial</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform relative z-10" />
            </a>
            
            <p className="text-white/70 text-sm mt-6 max-w-md mx-auto">
              No credit card required • 7-day free access • Cancel anytime
            </p>
          </div>
        </section>

        {/* 🌟 Enhanced Testimonials Section - Student Focused */}
        <section id="testimonials" data-animate="testimonials" className="py-28 px-6 bg-gradient-to-b from-white via-secondary-50/30 to-white flex flex-col items-center relative overflow-hidden">
          
          <div className="max-w-7xl w-full relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary-100 to-accent-yellow-light text-secondary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-secondary-200/50">
                <Star className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                Student Success Stories
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Loved By Students
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-primary-600">
                  Around The World
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Hear from students whose learning journeys have been transformed through PlayFit's engaging platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Sarah Johnson",
                  role: "High School Student", 
                  grade: "Grade 11",
                  content: "PlayFit made learning so much fun! The interactive lessons and live sessions helped me boost my grades from B to A+. I actually look forward to studying now!",
                  rating: 5,
                  avatar: "👩‍🎓",
                  color: "from-blue-400 to-blue-600",
                  improvement: "+2 Grades",
                  badge: "📈 Top Performer"
                },
                {
                  name: "Michael Chen", 
                  role: "Middle School Student",
                  grade: "Grade 8",
                  content: "The progress tracking is amazing! I can see exactly what I need to work on. The teachers are super helpful and make everything easy to understand.",
                  rating: 5,
                  avatar: "👨‍🎓", 
                  color: "from-purple-400 to-purple-600",
                  improvement: "4.0 GPA",
                  badge: "🏆 Coding Champion"
                },
                {
                  name: "Emily Rodriguez",
                  role: "High School Student", 
                  grade: "Grade 10", 
                  content: "I've tried other learning apps, but PlayFit is different! The courses are fun, the quizzes are challenging, and I love earning achievement badges!",
                  rating: 5,
                  avatar: "👩‍💻",
                  color: "from-pink-400 to-pink-600", 
                  improvement: "Star Student",
                  badge: "⭐ All-Star Learner"
                }
              ].map((testimonial, i) => (
                <div key={i} className="group bg-white rounded-[32px] p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-700 transform hover:-translate-y-3 relative overflow-hidden">
                  
                  <div className="relative z-10">
                    {/* Student Avatar - Circular */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        {testimonial.avatar}
                      </div>
                      {/* Achievement Badge */}
                      <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {testimonial.badge}
                      </span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-dark-700 leading-relaxed mb-8 font-medium text-lg">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author Info */}
                    <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100 group-hover:border-primary-200 transition-colors">
                      <div>
                        <h4 className="font-bold text-dark-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-dark-600 font-semibold">{testimonial.role}</p>
                        <p className="text-xs text-primary-600 font-bold mt-1">{testimonial.grade}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-primary-600">{testimonial.improvement}</span>
                        <p className="text-xs text-dark-500 font-semibold">Improvement</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 📊 Individual Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  number: "10,000+", 
                  label: "Students", 
                  icon: Users,
                  color: "from-primary-500 to-primary-600",
                  bgColor: "from-primary-50 to-primary-100"
                },
                { 
                  number: "98%", 
                  label: "Success Rate", 
                  icon: Trophy,
                  color: "from-secondary-500 to-secondary-600", 
                  bgColor: "from-secondary-50 to-secondary-100"
                },
                { 
                  number: "1,000+", 
                  label: "Courses", 
                  icon: BookOpen,
                  color: "from-accent-orange to-accent-yellow",
                  bgColor: "from-orange-50 to-yellow-100"
                },
                { 
                  number: "500+", 
                  label: "Mentors", 
                  icon: GraduationCap,
                  color: "from-accent-purple to-accent-pink",
                  bgColor: "from-purple-50 to-pink-100"
                }
              ].map((stat, i) => (
                <div key={i} className={`group bg-gradient-to-br ${stat.bgColor} rounded-[32px] p-8 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 hover:scale-105 text-center`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <stat.icon size={32} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black mb-2 text-dark-900 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-dark-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Recommendation Section */}
        <CourseRecommendationSection />

        {/* 📝 Enhanced Form Section - Split Layout */}
        <section id="trial" className="py-24 px-6 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 relative overflow-hidden flex justify-center">
          
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 relative z-10 items-center">
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <Clock className="w-4 h-4" />
                  30 Seconds Only
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-dark-900 leading-tight mb-6">
                  Get Your Child's Learning Started Today
                </h2>
                <p className="text-dark-600 text-lg md:text-xl leading-relaxed mb-8">
                  Book a free trial and discover how PlayFit makes learning fun, engaging, and effective for children aged 8-18.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: CheckCircle, text: "Personalized Assessment", desc: "Understand your child's strengths and learning style" },
                  { icon: CheckCircle, text: "Live Demo Class", desc: "Experience our interactive teaching methods firsthand" },
                  { icon: CheckCircle, text: "Expert Guidance", desc: "Get personalized recommendations from certified educators" },
                  { icon: CheckCircle, text: "Course Recommendations", desc: "Discover the perfect learning path for your child" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 text-lg mb-1">{item.text}</h4>
                      <p className="text-dark-600 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-6 mt-8">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <span className="font-bold text-dark-900">100% Safe & Secure</span>
                </div>
                <p className="text-dark-600 text-sm font-medium">
                  Your information is protected with enterprise-grade security. No spam, no unwanted calls.
                </p>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-10 border-2 border-gray-100 transform hover:scale-105 transition-transform duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-2">Book Your Free Trial</h3>
                <p className="text-sm text-dark-500">Fill out the form below and we&apos;ll be in touch within 24 hours.</p>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-bold text-primary-600">30 seconds only</span>
                  </div>
                </div>
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

      {/* 🔗 Enhanced Footer */}
      <footer className="bg-dark-900 text-gray-300 py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="relative flex items-center justify-center shrink-0 transition-all duration-300 h-12 w-auto hover:scale-105">
                <img
                  src="/images/playfit-logo.jpg"
                  alt="PlayFit LMS"
                  className="w-full h-full object-contain max-w-full max-h-full"
                />
              </Link>
            </div>
            <p className="max-w-md text-gray-400 leading-relaxed mb-6">Where kids learn through play! Empowering children aged 8-18 with interactive courses and fun learning experiences.</p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-accent-pink rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Learn Section */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Learn</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Courses</a></li>
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Categories</a></li>
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Certifications</a></li>
            </ul>
          </div>
          
          {/* Company Section */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Careers</a></li>
            </ul>
          </div>
          
          {/* Resources Section */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />FAQs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Help</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PlayFit - Where Kids Learn Through Play! Made with ❤️ for young learners worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
