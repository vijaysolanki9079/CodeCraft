import React, { useState } from 'react';
import { Heart, Eye, ExternalLink, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type Project = {
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
};

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onDelete?: (projectId: string) => void;
  onLike?: (projectId: string) => void;
  onView?: (projectId: string) => void;
  onToggleFavorite?: (projectId: string) => void;
  isSelected?: boolean;
  showDelete?: boolean;
}

const ProjectCard = ({ 
  project,
  onClick,
  onDelete,
  onLike,
  onView,
  onToggleFavorite,
  isSelected = false,
  showDelete = false
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(project.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(project.id);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView?.(project.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(project.id);
  };

  return (
    <div 
      className={cn(
        "bg-card rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer hover:translate-y-[-5px] animate-fade-in relative",
        isSelected && "ring-2 ring-codepurple"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        {project.featured && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Star size={12} />
              Featured
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-bold text-lg">{project.title}</h3>
          <p className="text-white/80 text-sm truncate">{project.description}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            categoryColors[project.category] || "bg-gray-200 text-gray-800"
          )}>
            {project.category}
          </span>
          {project.techStack.slice(0, 2).map((tech) => (
            <span key={tech} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
              {tech}
            </span>
          ))}
          {project.techStack.length > 2 && (
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
              +{project.techStack.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-muted-foreground text-xs hover:text-rose-500 transition-colors"
            >
              <Heart size={14} />
              <span>{project.likes}</span>
            </button>
            <button 
              onClick={handleView}
              className="flex items-center gap-1 text-muted-foreground text-xs hover:text-codeblue transition-colors"
            >
              <Eye size={14} />
              <span>{project.views}</span>
            </button>
            <button 
              onClick={handleToggleFavorite}
              className="flex items-center gap-1 text-muted-foreground text-xs hover:text-amber-500 transition-colors"
            >
              <Star size={14} />
            </button>
          </div>
          
          {project.link && (
            <a 
              href={project.link}
              onClick={(e) => e.stopPropagation()}
              className="text-codeblue hover:text-codeblue-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {showDelete && onDelete && (
        <Button
          variant="destructive"
          size="icon"
          className={cn(
            "absolute top-2 right-2 transition-all duration-300",
            isSelected || isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2"
          )}
          onClick={handleDelete}
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  );
};

// Colors for different categories
export const categoryColors = {
  'Web Development': 'bg-codeblue text-white',
  'App Development': 'bg-codepurple text-white',
  'AI/ML': 'bg-codeindigo text-white',
  'Data Science': 'bg-emerald-500 text-white',
  'DevOps': 'bg-amber-500 text-white',
  'Blockchain': 'bg-rose-500 text-white',
};

export default ProjectCard;
