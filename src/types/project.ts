export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  techStack: string[];
  likes: number;
  views: number;
  featured?: boolean;
  link?: string;
} 