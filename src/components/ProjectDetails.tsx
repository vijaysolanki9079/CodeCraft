import React from 'react';
import { ArrowLeft, Globe, ThumbsUp, Eye, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from './ProjectCard';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  onDelete: (projectId: string) => void;
  onLike: (projectId: string) => void;
  onView: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
}

const ProjectDetails = ({ 
  project, 
  onBack, 
  onDelete,
  onLike,
  onView,
  onToggleFavorite
}: ProjectDetailsProps) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Projects
        </button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onLike(project.id)}
          >
            <ThumbsUp size={16} />
            Like
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onView(project.id)}
          >
            <Eye size={16} />
            View
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onToggleFavorite(project.id)}
          >
            <Star size={16} />
            {project.featured ? 'Unfeature' : 'Feature'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 size={16} />
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(project.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-secondary rounded-full text-xs">
              {project.category}
            </span>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-codepurple/10 text-codepurple rounded-full text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground mb-6">{project.description}</p>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-codepurple hover:underline mb-6"
            >
              <Globe size={16} />
              View Project
            </a>
          )}

          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1">
              <ThumbsUp size={16} className="text-codeblue" />
              <span>{project.likes} Likes</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} className="text-codepurple" />
              <span>{project.views} Views</span>
            </div>
          </div>
        </div>

        <div>
          <Card className="overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Project Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <p>{project.category}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Tech Stack:</span>
                  <p>{project.techStack.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
