export type Locale = "en" | "tl-ph";

export interface Category {
  slug: string;
  label: string;
  description: string;
  position: number;
}

export interface Lesson {
  slug: string;
  title: string;
  category: string;
  position: number;
}

export interface LessonContent extends Lesson {
  source: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface BlogPostContent extends BlogPost {
  source: string;
}
