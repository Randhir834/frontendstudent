import { MetadataRoute } from 'next'
import { getPublishedBlogPostsMetadata } from '@/lib/blog'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

async function getCourses() {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.courses || []
  } catch (error) {
    console.error('Error fetching courses for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://playfitclasses.com'
  
  // Fetch courses for dynamic pages
  const courses = await getCourses()
  
  // Get published blog posts
  const blogPosts = getPublishedBlogPostsMetadata()
  
  // Static public pages (only indexable pages)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/course-finder`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
  
  // Add blog listing only if there are 3+ published posts
  if (blogPosts.length >= 3) {
    staticPages.push({
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }
  
  // Dynamic course pages - use /course/[id] (not /courses/[id])
  const coursePages: MetadataRoute.Sitemap = courses.map((course: any) => ({
    url: `${baseUrl}/course/${course.id}`,
    lastModified: course.updated_at ? new Date(course.updated_at) : new Date(course.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Blog post pages (only published posts)
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [...staticPages, ...coursePages, ...blogPages]
}
