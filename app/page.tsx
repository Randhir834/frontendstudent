'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Play, Award, TrendingUp, Clock, Shield, Mail, Phone } from 'lucide-react';
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
      
      let activeBoxes = new Set(); // Track currently active boxes
      
      // Function to maintain 7-8 active boxes at all times
      const maintainActiveBoxes = () => {
        const targetCount = 7 + Math.floor(Math.random() * 2); // 7 or 8 boxes
        
        // Remove some boxes randomly to make room for new ones
        if (activeBoxes.size > 0) {
          const boxesToRemove = Math.floor(Math.random() * 3) + 1; // Remove 1-3 boxes
          const activeArray = Array.from(activeBoxes);
          
          for (let i = 0; i < Math.min(boxesToRemove, activeArray.length); i++) {
            const randomActiveIndex = Math.floor(Math.random() * activeArray.length);
            const boxIndex = activeArray.splice(randomActiveIndex, 1)[0];
            
            // Remove animation from box
            animations.forEach(anim => boxes[boxIndex].classList.remove(anim));
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
              const box = boxes[index];
              return animations.find(anim => box.classList.contains(anim));
            }).filter(Boolean);
            
            const availableAnimations = animations.filter(anim => !usedAnimations.includes(anim));
            const animationToUse = availableAnimations.length > 0 
              ? availableAnimations[Math.floor(Math.random() * availableAnimations.length)]
              : animations[Math.floor(Math.random() * animations.length)];
            
            boxes[randomIndex].classList.add(animationToUse);
            activeBoxes.add(randomIndex);
            
            // Schedule removal of this animation
            setTimeout(() => {
              boxes[randomIndex].classList.remove(animationToUse);
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
    <div className="min-h-screen bg-white">
      {/* Clean Professional Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <Link href="/" className="flex items-center">
              <img
                src="/images/playfit-logo.jpg"
                alt="Playfit"
                className="h-12 md:h-16 lg:h-20 w-auto object-contain"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#courses" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Courses
              </Link>
              <Link href="#about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="#trial" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Free Trial
              </Link>
              <Link href="/login" className="ml-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors">
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-6 py-4 space-y-4">
              <Link href="#courses" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">
                Courses
              </Link>
              <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">
                About
              </Link>
              <Link href="#trial" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">
                Free Trial
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-md text-center">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Clean & Professional */}
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Unlock Your Child's Potential
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Discover engaging <span className="font-semibold text-white">live online classes</span> in <span className="font-semibold text-white">Art & Drawing</span>, <span className="font-semibold text-white">Chess</span>, <span className="font-semibold text-white">Piano</span>, <span className="font-semibold text-white">Public Speaking</span>, <span className="font-semibold text-white">Abacus</span>, <span className="font-semibold text-white">Computers</span> and more. Build skills, confidence, and creativity.
              </p>
              <div>
                <Link 
                  href="#trial"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                >
                  START YOUR FREE TRIAL
                </Link>
              </div>
            </div>

            {/* Right Visual - Abstract Shapes */}
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean Numbers */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Happy Students" },
              { number: "50+", label: "Expert Instructors" },
              { number: "11+", label: "Skill Courses" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Best Courses Section */}
      <CourseRecommendationSection />

      {/* Course Section - Minimal Cards */}
      <section id="courses" className="py-20 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Skill Development Courses
            </h2>
            <p className="text-lg text-gray-600">
              Live online classes designed to nurture creativity, confidence, and critical thinking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Art & Drawing", age: "Ages 5-15", color: "bg-red-50 border-red-200", icon: "🎨" },
              { title: "Chess", age: "Ages 6-16", color: "bg-pink-50 border-pink-200", icon: "♟️" },
              { title: "Piano", age: "Ages 5-15", color: "bg-purple-50 border-purple-200", icon: "🎹" },
              { title: "Phonics", age: "Ages 4-8", color: "bg-blue-50 border-blue-200", icon: "🅰️" },
              { title: "Public Speaking", age: "Ages 7-17", color: "bg-green-50 border-green-200", icon: "🎤" },
              { title: "Abacus", age: "Ages 5-12", color: "bg-yellow-50 border-yellow-200", icon: "🧮" },
              { title: "Reader's Club", age: "Ages 6-14", color: "bg-orange-50 border-orange-200", icon: "📚" },
              { title: "Toastmaster", age: "Ages 10-17", color: "bg-teal-50 border-teal-200", icon: "🗣️" },
              { title: "Sholak", age: "Ages 7-15", color: "bg-indigo-50 border-indigo-200", icon: "🎯" },
              { title: "Computers", age: "Ages 8-16", color: "bg-cyan-50 border-cyan-200", icon: "💻" },
              { title: "Rubiks Cube", age: "Ages 6-14", color: "bg-rose-50 border-rose-200", icon: "🧩" }
            ].map((course, i) => (
              <div key={i} className={`${course.color} border-2 rounded-lg p-6 hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{course.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.age}</p>
                    <button className="text-sm font-medium text-red-600 hover:text-red-700">
                      VIEW MORE →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Clean Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center p-12">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Expert Learning</h3>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Discover Unique Learning Experiences
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                From artistic expression through Art & Drawing to strategic thinking with Chess, from musical mastery with Piano to mental math with Abacus - we offer diverse courses that spark curiosity and build lifelong skills.
              </p>
              <Link 
                href="#trial"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                START YOUR FREE TRIAL
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Development Section - Dark Navy Background */}
      <section className="py-20 bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="aspect-square bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Star className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Build Skills Beyond Academics
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our courses help children develop creativity through Art, strategic thinking with Chess, musical talent via Piano, public confidence through Speaking, and computational speed with Abacus - essential skills for the 21st century.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="px-4 py-2 bg-white/10 rounded">Creative Arts</span>
                <span className="px-4 py-2 bg-white/10 rounded">Strategic Thinking</span>
                <span className="px-4 py-2 bg-white/10 rounded">Music & Performance</span>
              </div>
              <Link 
                href="#trial"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                EXPLORE PROGRAMS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Community Section */}
      <section className="py-20 bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual (Abstract Pattern) */}
            <div className="space-y-8">
              <div ref={gridRef} className="grid grid-cols-8 gap-1 max-w-sm">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded community-grid-item"
                  />
                ))}
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Join Thousands of Young Learners
              </h2>
              <p className="text-lg text-gray-300">
                Students from across India are mastering Art, Chess, Piano, Public Speaking, Abacus, and more through our live online classes
              </p>
              <Link 
                href="#trial"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                START YOUR FREE TRIAL
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-32 lg:py-40 bg-gradient-to-b from-yellow-500 to-yellow-600 w-full min-h-screen flex items-center">
        <div className="w-full px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Curriculum Icons */}
              <div className="grid grid-cols-4 gap-6">
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
                  <div key={i} className="bg-white rounded-lg p-6 text-center space-y-3 hover:shadow-md transition-shadow">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="text-sm font-semibold text-gray-900 leading-tight">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right - Content */}
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  Expert-Led Courses by Certified Instructors
                </h2>
                <p className="text-xl text-yellow-100 leading-relaxed">
                  Our carefully crafted curriculum spans creative arts, strategic games, music, communication, and cognitive development
                </p>
                <p className="text-lg text-yellow-100 leading-relaxed">
                  Each course is designed to build confidence, creativity, and critical thinking in a fun, engaging online environment
                </p>
                <Link 
                  href="#trial"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-yellow-700 font-semibold rounded-md hover:bg-gray-50 transition-colors text-lg"
                >
                  START YOUR FREE TRIAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-blue-200 mb-4">
              EXPLORE OUR DIVERSE SKILL CATEGORIES
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { icon: "🎨", label: "ART STUDIO" },
              { icon: "♟️", label: "CHESS ACADEMY" },
              { icon: "🎹", label: "MUSIC ROOM" },
              { icon: "🎤", label: "SPEAKING LAB" },
              { icon: "🧮", label: "MATH HUB" },
              { icon: "💻", label: "TECH ZONE" }
            ].map((activity, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center text-3xl border-4 border-white/20">
                  {activity.icon}
                </div>
                <div className="text-xs font-semibold uppercase">
                  {activity.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              See how our students are excelling in Art, Chess, Piano, Public Speaking, and more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "ANANYA", age: "10 YEARS OLD", location: "MUMBAI", achievement: "ART CHAMPION", handle: "GRADE 5", color: "bg-gradient-to-br from-red-400 to-red-600" },
              { name: "ROHAN", age: "12 YEARS OLD", location: "DELHI", achievement: "CHESS MASTER", handle: "GRADE 7", color: "bg-gradient-to-br from-blue-400 to-blue-600" },
              { name: "PRIYA", age: "9 YEARS OLD", location: "BANGALORE", achievement: "PIANO PRODIGY", handle: "GRADE 4", color: "bg-gradient-to-br from-purple-400 to-purple-600" }
            ].map((student, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-20 h-20 ${student.color} rounded-full flex items-center justify-center text-3xl flex-shrink-0`}>
                    👤
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.age}</p>
                      <p className="text-sm text-gray-600">{student.location}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{student.achievement}</p>
                      <p className="text-sm text-gray-600">{student.handle}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Book Free Trial */}
      <section id="trial" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Start Your Child's Learning Journey
              </h2>
              <p className="text-lg text-gray-600">
                Book a free trial class in Art, Chess, Piano, Public Speaking, Abacus, or any course of your choice
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Trial Requested Successfully!</h3>
                <p className="text-gray-600">Thanks for reaching out. We'll contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your phone"
                    />
                  </div>

                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                      Child's Age / Grade *
                    </label>
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 8 years / Grade 3"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Interested Course (Optional)
                  </label>
                  <select
                    id="course"
                    name="course"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Book Free Trial Class'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  No payment required. Start with a completely free trial class.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <Link href="/" className="inline-block mb-4">
                <img
                  src="/images/playfit-logo.jpg"
                  alt="Playfit"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                Empowering children with creative and skill-building courses in Art, Chess, Piano, Public Speaking, Abacus, and more.
              </p>
            </div>

            {/* Courses Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Popular Courses</h4>
              <ul className="space-y-2">
                <li><a href="#courses" className="text-sm text-gray-400 hover:text-white transition-colors">Art & Drawing</a></li>
                <li><a href="#courses" className="text-sm text-gray-400 hover:text-white transition-colors">Chess</a></li>
                <li><a href="#courses" className="text-sm text-gray-400 hover:text-white transition-colors">Piano</a></li>
                <li><a href="#courses" className="text-sm text-gray-400 hover:text-white transition-colors">Public Speaking</a></li>
                <li><a href="#courses" className="text-sm text-gray-400 hover:text-white transition-colors">Abacus</a></li>
              </ul>
            </div>

            {/* Quick Links Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#trial" className="text-sm text-gray-400 hover:text-white transition-colors">Free Trial</Link></li>
                <li><Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Student Login</Link></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>support@playfit.com</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+1 (234) 567-890</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Playfit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
