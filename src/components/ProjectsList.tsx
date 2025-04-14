import React, { useState } from 'react';
import ProjectCard, { Project, categoryColors } from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import { PlusSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectsListProps {
  onNewProject: () => void;
  onProjectClick: (project: Project) => void;
  userProjects: Project[];
  onDeleteProject: (projectId: string) => void;
  onLikeProject: (projectId: string) => void;
  onViewProject: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
}

// Sample project data to show alongside user projects
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with admin panel',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2080&auto=format&fit=crop',
    category: 'Web Development',
    techStack: ['React', 'Node.js', 'MongoDB'],
    likes: 47,
    views: 320,
    featured: true,
    link: 'https://elitewear-e-commerce.netlify.app/'
  },
  {
    id: '2',
    title: 'Image Processing Tool',
    description: 'Advanced image processing and manipulation tool',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    category: 'Web Development',
    techStack: ['Python', 'OpenCV', 'React'],
    likes: 89,
    views: 423
  },
  {
    id: '3',
    title: 'Food Delivery App',
    description: 'Mobile app for food ordering and delivery',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
    category: 'App Development',
    techStack: ['React Native', 'Firebase'],
    likes: 36,
    views: 215
  },
  {
    id: '4',
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for data analysis',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    category: 'Data Science',
    techStack: ['D3.js', 'React', 'Node.js'],
    likes: 28,
    views: 175
  },
  {
    id: '5',
    title: 'Smart Home IoT System',
    description: 'Control your home with voice commands and automation',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop',
    category: 'DevOps',
    techStack: ['Python', 'Arduino', 'MQTT'],
    likes: 52,
    views: 286
  },
  {
    id: '6',
    title: 'Cryptocurrency Tracker',
    description: 'Track and analyze cryptocurrency prices',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2071&auto=format&fit=crop',
    category: 'Blockchain',
    techStack: ['Vue.js', 'Node.js', 'Express'],
    likes: 47,
    views: 198,
    featured: true
  },
];

const categoryData = [
  { name: 'Web Dev', count: 12 },
  { name: 'Mobile', count: 6 },
  { name: 'Data', count: 5 },
  { name: 'DevOps', count: 3 },
  { name: 'Blockchain', count: 2 },
  { name: 'Other', count: 2 },
];

const ProjectsList = ({
  onNewProject,
  onProjectClick,
  userProjects,
  onDeleteProject,
  onLikeProject,
  onViewProject,
  onToggleFavorite
}: ProjectsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([...mockProjects]);
  
  // Combine user projects with mock projects
  const allProjects = [...userProjects, ...projects];
  
  // Filter projects based on search term and category
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, likes: project.likes + 1 }
          : project
      )
    );
  };

  const handleView = (projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, views: project.views + 1 }
          : project
      )
    );
  };

  const handleToggleFavorite = (projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, featured: !project.featured }
          : project
      )
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Projects</h1>
          <p className="text-muted-foreground">Browse and manage your projects</p>
        </div>
        <button 
          onClick={onNewProject}
          className="flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 bg-codepurple hover:bg-codepurple-dark text-white rounded-lg transition-colors"
        >
          <PlusSquare size={18} />
          <span>New Project</span>
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background"
          />
        </div>
        <div className="flex gap-2">
          {Object.keys(categoryColors).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === category
                  ? categoryColors[category]
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project)}
            onDelete={onDeleteProject}
            onLike={(id) => {
              if (userProjects.some(p => p.id === id)) {
                onLikeProject(id);
              } else {
                handleLike(id);
              }
            }}
            onView={(id) => {
              if (userProjects.some(p => p.id === id)) {
                onViewProject(id);
              } else {
                handleView(id);
              }
            }}
            onToggleFavorite={(id) => {
              if (userProjects.some(p => p.id === id)) {
                onToggleFavorite(id);
              } else {
                handleToggleFavorite(id);
              }
            }}
            showDelete={userProjects.some(p => p.id === project.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
