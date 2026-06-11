'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Target, Clock, Shield, Rocket, Heart, GraduationCap, Brain, Puzzle, GamepadIcon as Gamepad2, UserCheck, Video, MessageCircle, Award, Sparkles, BarChart3, TrendingUp, Zap, PlayCircle, ChevronRight, Calendar, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { trialService } from '@/services/trialService';
import CourseRecommendationSection from '@/components/CourseRecommendation/CourseRecommendationSection';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', grade: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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

        {/* 🎓 How It Works - Step by Step Process */}
        <section className="py-28 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-primary-200/50">
                <Sparkles className="w-5 h-5 text-accent-yellow" />
                Simple Process
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Your Child's Learning Journey
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  In 4 Simple Steps
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                From signup to success, we've made learning simple, fun, and effective for every child.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  icon: Rocket,
                  title: "Sign Up & Profile",
                  desc: "Create your child's account in 2 minutes. Choose interests and learning goals.",
                  color: "from-blue-400 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100"
                },
                {
                  step: "02",
                  icon: Target,
                  title: "Personalized Path",
                  desc: "AI recommends the perfect courses based on age, interests, and skill level.",
                  color: "from-purple-400 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100"
                },
                {
                  step: "03",
                  icon: PlayCircle,
                  title: "Interactive Learning",
                  desc: "Engage with videos, quizzes, live classes, and hands-on projects.",
                  color: "from-pink-400 to-pink-600",
                  bgColor: "from-pink-50 to-pink-100"
                },
                {
                  step: "04",
                  icon: Trophy,
                  title: "Track & Celebrate",
                  desc: "Monitor progress, earn badges, and celebrate achievements together!",
                  color: "from-green-400 to-green-600",
                  bgColor: "from-green-50 to-green-100"
                }
              ].map((item, i) => (
                <div key={i} className="group relative">
                  {/* Connecting Line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-24 left-[60%] w-[80%] h-1 bg-gradient-to-r from-primary-200 to-secondary-200 z-0"></div>
                  )}
                  
                  <div className={`relative bg-gradient-to-br ${item.bgColor} rounded-[32px] p-8 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 border-2 border-white z-10`}>
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white">
                      <span className={`text-2xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                        {item.step}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <item.icon size={36} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-dark-900 mb-3">{item.title}</h3>
                    <p className="text-dark-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <a href="#trial" className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <Rocket className="w-6 h-6" />
                Get Started Now
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* 📊 Learning Analytics & Insights Section */}
        <section className="py-28 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left - Visual Representation */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-200/30 via-purple-200/30 to-pink-200/30 rounded-[4rem] blur-3xl"></div>
                
                <div className="relative bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-white/80">
                  <h3 className="text-3xl font-black text-dark-900 mb-6">Real-Time Dashboard</h3>
                  
                  {/* Mock Dashboard Elements */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-dark-600">Overall Progress</p>
                            <p className="text-2xl font-black text-dark-900">87%</p>
                          </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                      <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                        <div className="h-full w-[87%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border-2 border-green-200">
                        <Trophy className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-3xl font-black text-dark-900">24</p>
                        <p className="text-sm font-bold text-dark-600">Badges Earned</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border-2 border-purple-200">
                        <Star className="w-8 h-8 text-purple-600 mb-2 fill-purple-600" />
                        <p className="text-3xl font-black text-dark-900">156</p>
                        <p className="text-sm font-bold text-dark-600">Stars Collected</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 border-2 border-pink-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-6 h-6 text-pink-600" />
                        <p className="font-bold text-dark-900">Learning Streak</p>
                      </div>
                      <p className="text-3xl font-black text-dark-900">12 Days 🔥</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-purple-200/50">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Advanced Analytics
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 leading-tight">
                    Track Every
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      Achievement & Milestone
                    </span>
                  </h2>
                  <p className="text-dark-600 text-xl leading-relaxed font-medium">
                    Our comprehensive dashboard gives parents and students real-time insights into learning progress, strengths, and areas for improvement.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: BarChart3,
                      title: "Detailed Progress Reports",
                      desc: "Weekly and monthly reports showing course completion, quiz scores, and time spent learning.",
                      color: "from-blue-400 to-blue-600"
                    },
                    {
                      icon: Trophy,
                      title: "Achievement Tracking",
                      desc: "Visual representation of badges, certificates, and milestones earned throughout the journey.",
                      color: "from-green-400 to-green-600"
                    },
                    {
                      icon: TrendingUp,
                      title: "Skill Development Insights",
                      desc: "Identify strengths and growth areas with AI-powered learning analytics and recommendations.",
                      color: "from-purple-400 to-purple-600"
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <item.icon className="text-white w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-bold text-dark-900 text-xl mb-2">{item.title}</h4>
                        <p className="text-dark-600 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 💬 Live Support & Community Section */}
        <section className="py-28 px-6 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left - Content */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-teal-200/50">
                    <MessageCircle className="w-5 h-5 text-teal-600" />
                    24/7 Support
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 leading-tight">
                    Never Learn
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                      Alone Again
                    </span>
                  </h2>
                  <p className="text-dark-600 text-xl leading-relaxed font-medium">
                    Get instant help from our expert mentors, connect with peers worldwide, and be part of a thriving learning community.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: MessageCircle,
                      title: "24/7 Live Chat Support",
                      desc: "Get instant answers to questions anytime, anywhere. Our support team is always ready to help.",
                      stat: "< 2 min",
                      statLabel: "Response Time"
                    },
                    {
                      icon: Video,
                      title: "One-on-One Mentoring",
                      desc: "Schedule personalized sessions with certified mentors for focused guidance and support.",
                      stat: "500+",
                      statLabel: "Expert Mentors"
                    },
                    {
                      icon: Users,
                      title: "Student Community",
                      desc: "Join study groups, participate in discussions, and collaborate with peers on projects.",
                      stat: "10K+",
                      statLabel: "Active Students"
                    }
                  ].map((item, i) => (
                    <div key={i} className="group bg-gradient-to-br from-white to-teal-50/30 rounded-[2rem] p-6 border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-500">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <item.icon className="text-white w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-dark-900 text-xl mb-2">{item.title}</h4>
                          <p className="text-dark-600 font-medium leading-relaxed mb-3">{item.desc}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-teal-600">{item.stat}</span>
                            <span className="text-sm font-bold text-dark-500">{item.statLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Visual */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-teal-200/30 via-blue-200/30 to-teal-200/30 rounded-[4rem] blur-3xl"></div>
                
                <div className="relative bg-gradient-to-br from-white to-teal-50/50 rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-white/80">
                  <div className="space-y-6">
                    {/* Chat Messages */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl">
                          👨‍🏫
                        </div>
                        <div>
                          <p className="font-bold text-dark-900">Mr. Johnson</p>
                          <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Online
                          </p>
                        </div>
                      </div>
                      <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                        <p className="text-dark-700 font-medium">"Great question! Let me explain the concept with an example..."</p>
                      </div>
                    </div>

                    {/* Community Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-4 border-2 border-teal-200 text-center">
                        <p className="text-3xl font-black text-dark-900 mb-1">98%</p>
                        <p className="text-sm font-bold text-dark-600">Satisfaction</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border-2 border-blue-200 text-center">
                        <p className="text-3xl font-black text-dark-900 mb-1">50K+</p>
                        <p className="text-sm font-bold text-dark-600">Messages/Day</p>
                      </div>
                    </div>

                    {/* Active Now */}
                    <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-6 border-2 border-teal-200">
                      <p className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        Active Students Now
                      </p>
                      <div className="flex -space-x-2">
                        {['👧', '👦', '👩', '👨', '👶', '👴'].map((emoji, i) => (
                          <div key={i} className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg border-3 border-white shadow-lg">
                            {emoji}
                          </div>
                        ))}
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-3 border-white shadow-lg">
                          +2.5K
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✨ Premium Features Showcase */}
        <section className="py-28 px-6 bg-gradient-to-b from-white via-yellow-50/30 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-yellow-200/50">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Premium Experience
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Designed For
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
                  Maximum Engagement
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Every feature is carefully crafted to keep children engaged, motivated, and excited about learning.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Gamepad2,
                  title: "Gamified Learning",
                  features: ["Points & Rewards", "Level Progression", "Daily Challenges", "Leaderboards"],
                  color: "from-purple-400 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100"
                },
                {
                  icon: Video,
                  title: "Interactive Content",
                  features: ["HD Video Lessons", "Animated Explanations", "Interactive Simulations", "Virtual Labs"],
                  color: "from-blue-400 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100"
                },
                {
                  icon: Award,
                  title: "Certifications",
                  features: ["Digital Certificates", "Skill Badges", "Course Completion", "Portfolio Building"],
                  color: "from-green-400 to-green-600",
                  bgColor: "from-green-50 to-green-100"
                }
              ].map((item, i) => (
                <div key={i} className={`group bg-gradient-to-br ${item.bgColor} rounded-[32px] p-8 border-2 border-white hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-3`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <item.icon size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-6">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-dark-700 font-medium">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
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

        {/* 🎯 Age-Specific Learning Paths Section */}
        <section className="py-28 px-6 bg-gradient-to-b from-white via-green-50/30 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-green-200/50">
                <Target className="w-5 h-5 text-green-600" />
                Age-Appropriate Content
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Perfect Content For
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                  Every Age Group
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Carefully curated learning paths designed specifically for different age groups and skill levels.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  ageRange: "8-10 Years",
                  emoji: "🧒",
                  title: "Young Explorers",
                  desc: "Foundation building with fun, interactive lessons that spark curiosity and creativity.",
                  subjects: ["Basic Math", "Science Fun", "Creative Writing", "Art & Craft"],
                  color: "from-blue-400 to-blue-600",
                  bgColor: "bg-blue-50"
                },
                {
                  ageRange: "11-14 Years",
                  emoji: "👦",
                  title: "Growing Learners",
                  desc: "Comprehensive courses building critical thinking and problem-solving skills.",
                  subjects: ["Advanced Math", "Coding Basics", "Sciences", "Languages"],
                  color: "from-purple-400 to-purple-600",
                  bgColor: "bg-purple-50"
                },
                {
                  ageRange: "15-18 Years",
                  emoji: "👨‍🎓",
                  title: "Young Achievers",
                  desc: "Advanced curriculum preparing for higher education and career readiness.",
                  subjects: ["AP Courses", "Advanced Coding", "Test Prep", "College Prep"],
                  color: "from-green-400 to-green-600",
                  bgColor: "bg-green-50"
                }
              ].map((group, i) => (
                <div key={i} className={`group ${group.bgColor} rounded-[32px] p-8 border-2 border-white hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-3`}>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{group.emoji}</div>
                    <div className={`inline-flex px-4 py-2 bg-gradient-to-r ${group.color} rounded-full text-white font-bold text-sm shadow-lg mb-3`}>
                      {group.ageRange}
                    </div>
                    <h3 className="text-2xl font-bold text-dark-900 mb-3">{group.title}</h3>
                    <p className="text-dark-600 font-medium leading-relaxed">{group.desc}</p>
                  </div>

                  <div className="space-y-3 pt-6 border-t-2 border-white">
                    {group.subjects.map((subject, j) => (
                      <div key={j} className="flex items-center gap-3 text-dark-700 font-semibold">
                        <div className={`w-8 h-8 bg-gradient-to-br ${group.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        {subject}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t-2 border-white text-center">
                    <a href="#trial" className={`group inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r ${group.color} font-bold text-lg hover:gap-3 transition-all`}>
                      Explore Courses
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ❓ FAQ Section */}
        <section className="py-28 px-6 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-primary-200/50">
                <Zap className="w-5 h-5 text-primary-600" />
                Common Questions
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Frequently Asked
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Questions
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Have questions? We've got answers! Find everything you need to know about PlayFit.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "What age group is PlayFit designed for?",
                  answer: "PlayFit is specifically designed for children aged 8-18 years. We offer age-appropriate content and learning paths tailored to different developmental stages."
                },
                {
                  question: "How does the free trial work?",
                  answer: "Sign up for a 7-day free trial with full access to all courses, live classes, and features. No credit card required! You can cancel anytime during the trial period."
                },
                {
                  question: "Can my child learn at their own pace?",
                  answer: "Absolutely! PlayFit is designed for self-paced learning. Students can watch lessons, complete assignments, and take quizzes whenever it's convenient for them."
                },
                {
                  question: "Are the instructors certified?",
                  answer: "Yes! All our instructors are certified educators with years of teaching experience. They undergo rigorous training to deliver engaging, effective online lessons."
                },
                {
                  question: "What devices can we use to access PlayFit?",
                  answer: "PlayFit works on any device with an internet connection - computers, tablets, and smartphones. Our platform is fully responsive and optimized for all screen sizes."
                },
                {
                  question: "How do you track my child's progress?",
                  answer: "Our comprehensive dashboard provides real-time insights into course completion, quiz scores, time spent learning, badges earned, and areas that need attention."
                },
                {
                  question: "Is there a money-back guarantee?",
                  answer: "Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied with PlayFit, we'll refund your payment - no questions asked."
                },
                {
                  question: "Can I get help if my child is stuck?",
                  answer: "Of course! We offer 24/7 live chat support, one-on-one mentoring sessions, and access to a community of peers and experts ready to help."
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-[2rem] p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                  <summary className="flex items-start justify-between cursor-pointer list-none">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white font-black text-lg">{i + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-dark-900 group-hover:text-primary-600 transition-colors flex-1">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronRight className="w-6 h-6 text-primary-600 flex-shrink-0 ml-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="mt-6 ml-14 text-dark-600 text-lg leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-16 text-center bg-gradient-to-br from-primary-50 to-secondary-50 rounded-[2rem] p-8 border-2 border-primary-200">
              <h3 className="text-2xl font-bold text-dark-900 mb-4">Still have questions?</h3>
              <p className="text-dark-600 font-medium mb-6">Our friendly support team is here to help you!</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="mailto:support@playfit.com" className="group inline-flex items-center gap-2 bg-white hover:bg-primary-50 text-primary-700 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
                <a href="tel:+1234567890" className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 🛡️ Trust & Guarantee Section */}
        <section className="py-28 px-6 bg-gradient-to-br from-blue-50 via-white to-green-50/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-green-200/50">
                <Shield className="w-5 h-5 text-green-600" />
                Our Promise
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Learn With
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Complete Confidence
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Your child's success and your satisfaction are our top priorities. Here's our commitment to you.
              </p>
            </div>

            {/* Main Guarantee Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Shield,
                  title: "30-Day Money Back",
                  desc: "Not satisfied? Get a full refund within 30 days, no questions asked.",
                  highlight: "100% Risk-Free",
                  color: "from-green-400 to-green-600",
                  bgColor: "from-green-50 to-green-100"
                },
                {
                  icon: Trophy,
                  title: "Results Guarantee",
                  desc: "See measurable improvement in your child's learning or your money back.",
                  highlight: "Proven Results",
                  color: "from-blue-400 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100"
                },
                {
                  icon: Heart,
                  title: "Lifetime Support",
                  desc: "Continuous access to our support team, resources, and community.",
                  highlight: "Always Here",
                  color: "from-purple-400 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100"
                }
              ].map((item, i) => (
                <div key={i} className={`group bg-gradient-to-br ${item.bgColor} rounded-[32px] p-8 border-2 border-white hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-3 text-center`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <item.icon size={36} />
                  </div>
                  <div className={`inline-flex px-4 py-2 bg-gradient-to-r ${item.color} rounded-full text-white font-bold text-sm shadow-lg mb-4`}>
                    {item.highlight}
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-3">{item.title}</h3>
                  <p className="text-dark-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl border-2 border-gray-100">
              <h3 className="text-3xl font-black text-dark-900 mb-12 text-center">Trusted & Certified</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                {[
                  { icon: Shield, label: "SSL Secured", sublabel: "Bank-level encryption" },
                  { icon: Award, label: "Certified Teachers", sublabel: "100% qualified" },
                  { icon: Users, label: "10K+ Families", sublabel: "Trust PlayFit" },
                  { icon: Star, label: "4.9/5 Rating", sublabel: "2,500+ reviews" }
                ].map((badge, i) => (
                  <div key={i} className="group text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl shadow-xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <badge.icon size={36} />
                    </div>
                    <p className="font-bold text-dark-900 text-lg">{badge.label}</p>
                    <p className="text-sm text-dark-600 font-medium">{badge.sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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

      {/* 🔗 Simple Footer */}
      <footer className="bg-dark-900 text-gray-300 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center mb-4">
                <img
                  src="/images/playfit-logo.jpg"
                  alt="PlayFit LMS"
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Where kids learn through play! Empowering children aged 8-18 with interactive learning experiences.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Courses</a></li>
                <li><a href="#why-choose" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonials</a></li>
                <li><a href="#trial" className="text-gray-400 hover:text-white transition-colors text-sm">Free Trial</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Kolkata, India</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@playfit.com" className="text-gray-400 hover:text-white transition-colors">support@playfit.com</a>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors">+91 123 456 7890</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} PlayFit LMS. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
