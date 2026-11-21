import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  category: string;
  relatedCourses: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  content: string;
  readingTime: string;
  published: boolean;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  category: string;
  relatedCourses: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  readingTime: string;
  published: boolean;
}

/**
 * Get all blog posts (including drafts)
 */
export function getAllBlogPosts(): BlogPost[] {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        author: data.author || 'PlayFit Team',
        image: data.image || '/images/blog/default.jpg',
        category: data.category || 'Education',
        relatedCourses: data.relatedCourses || [],
        content,
        readingTime: stats.text,
        published: data.published !== false, // Default to true if not specified
      };
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return allPostsData;
}

/**
 * Get only published blog posts
 */
export function getPublishedBlogPosts(): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.published);
}

/**
 * Get published blog post metadata (without content)
 */
export function getPublishedBlogPostsMetadata(): BlogPostMetadata[] {
  return getPublishedBlogPosts().map(({ content, ...metadata }) => metadata);
}

/**
 * Get all blog post slugs for static generation
 */
export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.mdx?$/, ''));
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    let fileContents: string;

    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } else {
      // Try .md extension
      const mdPath = path.join(postsDirectory, `${slug}.md`);
      if (fs.existsSync(mdPath)) {
        fileContents = fs.readFileSync(mdPath, 'utf8');
      } else {
        return null;
      }
    }

    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author || 'PlayFit Team',
      image: data.image || '/images/blog/default.jpg',
      category: data.category || 'Education',
      relatedCourses: data.relatedCourses || [],
      content,
      readingTime: stats.text,
      published: data.published !== false,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get related blog posts based on category
 */
export function getRelatedBlogPosts(currentSlug: string, category: string, limit: number = 3): BlogPostMetadata[] {
  return getPublishedBlogPostsMetadata()
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}
