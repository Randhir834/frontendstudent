// Blog Post Types
// These types map to the existing review table structure

export interface BlogPost {
  id: number;
  title: string; // Mapped from course_name
  content: string; // Mapped from message
  author: string; // Mapped from name
  authorRole: string; // Mapped from role
  featuredPriority: number; // Mapped from rating (1-5)
  status: 'pending' | 'approved' | 'rejected';
  email?: string;
  phone?: string;
  adminNotes?: string;
  publishedBy?: number;
  publishedByName?: string;
  publishedAt?: string; // Mapped from reviewed_at
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostSubmission {
  title: string;
  content: string;
  author: string;
  authorRole?: string;
  featuredPriority?: number;
  email?: string;
  phone?: string;
}

export interface BlogStats {
  pendingCount: number;
  publishedCount: number;
  rejectedCount: number;
  totalCount: number;
}

export interface BlogListResponse {
  blogs: BlogPost[];
  total: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
