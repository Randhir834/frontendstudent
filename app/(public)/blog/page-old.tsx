import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Education Blog for Parents – Tips for Kids\' Learning',
  description: 'Expert advice on online learning, child development, and skill-building. Get parenting tips, activity ideas, and education insights for kids aged 4–10.',
  path: '/blog',
});

// Server-side rendered blog page
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with H1 */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
                Educational Blog
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Expert articles on child education, online learning tips, and skill development strategies for kids aged 4-10.
            </p>
          </div>
          
          {/* Coming Soon Section */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              Blog Coming Soon
            </h2>
            <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
              We're working on bringing you valuable content about child education, online learning, and skill development. Check back soon!
            </p>
          </div>

          {/* Suggested Topics Grid */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              Upcoming Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2"><span aria-hidden="true">✍️</span> 10 Benefits of Online Learning for Kids</h3>
                <p className="text-sm text-gray-600">Discover how digital education enhances learning outcomes and flexibility for children.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2"><span aria-hidden="true">🎹</span> Best Age to Start Piano Lessons</h3>
                <p className="text-sm text-gray-600">Learn the optimal age and developmental readiness for beginning piano instruction.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">♟️ How Chess Improves Problem-Solving Skills</h3>
                <p className="text-sm text-gray-600">Explore the cognitive benefits of chess for children's critical thinking development.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">🎨 Creative Art Activities for Kids at Home</h3>
                <p className="text-sm text-gray-600">Fun, educational art projects parents can do with children to boost creativity.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">👨‍👩‍👧 Parent's Guide to Choosing Online Classes</h3>
                <p className="text-sm text-gray-600">Tips for selecting the right online courses based on your child's interests and age.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">🗣️ Building Confidence Through Public Speaking</h3>
                <p className="text-sm text-gray-600">How public speaking courses help children develop self-assurance and communication.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">🧮 Abacus Math: Ancient Tool for Modern Learning</h3>
                <p className="text-sm text-gray-600">Understanding how abacus training enhances mental math and concentration skills.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Phonics vs Traditional Reading Methods</h3>
                <p className="text-sm text-gray-600">Comparing different approaches to teaching children how to read effectively.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">💻 Essential Computer Skills Every Child Should Learn</h3>
                <p className="text-sm text-gray-600">The digital literacy skills that prepare children for the future.</p>
              </article>
              
              <article className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">🏆 Student Success Stories</h3>
                <p className="text-sm text-gray-600">Real stories of how online classes have transformed children's learning journeys.</p>
              </article>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
