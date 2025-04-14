import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ProjectForm from '@/components/ProjectForm';
import CombinedProjects from '@/components/CombinedProjects';
import ProjectDetails from '@/components/ProjectDetails';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Project } from '@/types/project';
import ProjectsList from '@/components/ProjectsList';

const Index = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    try {
      if (location.state?.returnTo) {
        setActivePage(location.state.returnTo);
      }
      
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load saved projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [location, toast]);
  
  useEffect(() => {
    try {
      if (projects.length > 0) {
        localStorage.setItem('projects', JSON.stringify(projects));
      }
    } catch (error) {
      console.error('Error saving projects:', error);
      toast({
        title: "Error",
        description: "Failed to save projects.",
        variant: "destructive",
      });
    }
  }, [projects, toast]);

  const handleNewProject = useCallback(() => {
    setShowNewProjectForm(true);
    setActivePage('newProject');
  }, []);

  const handleCloseForm = useCallback((newProject?: Project) => {
    setShowNewProjectForm(false);
    
    if (newProject) {
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      
      toast({
        title: "Project Created!",
        description: "Your new project has been successfully added.",
        className: "border-green-500 border-2 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-500/20",
        duration: 3000,
      });
      
      setActivePage('dashboard');
    } else {
      toast({
        title: "Cancelled",
        description: "Project creation was cancelled.",
        className: "border-yellow-500 border-2 bg-yellow-50 dark:bg-yellow-950/30 shadow-lg shadow-yellow-500/20",
        duration: 3000,
      });
    }
  }, [projects, toast]);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setActivePage('projectDetails');
  }, []);

  const handleBackToProjects = useCallback(() => {
    setSelectedProject(null);
    setActivePage('dashboard');
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    try {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setActivePage('dashboard');
      }
      
      toast({
        title: "Project Deleted",
        description: "The project has been removed from your list.",
        className: "border-red-500 border-2 bg-red-50 dark:bg-red-950/30 shadow-lg shadow-red-500/20",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  }, [projects, selectedProject, toast]);

  const handleLikeProject = useCallback((projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, likes: project.likes + 1 }
          : project
      )
    );
  }, []);

  const handleViewProject = useCallback((projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, views: project.views + 1 }
          : project
      )
    );
  }, []);

  const handleToggleFavorite = useCallback((projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, featured: !project.featured }
          : project
      )
    );
  }, []);

  const handlePageChange = useCallback((page: string) => {
    if (page === 'newProject') {
      handleNewProject();
    } else if (page === 'settings') {
      navigate('/settings', { state: { returnTo: activePage } });
    } else {
      setActivePage(page);
      setShowNewProjectForm(false);
      setSelectedProject(null);
    }
  }, [activePage, handleNewProject, navigate]);

  const renderContent = useCallback((
    page: string, 
    onNewProject: () => void, 
    onProjectClick: (project: Project) => void,
    userProjects: Project[],
    onDeleteProject: (projectId: string) => void,
    onLikeProject: (projectId: string) => void,
    onViewProject: (projectId: string) => void,
    onToggleFavorite: (projectId: string) => void,
    onPageChange: (page: string) => void
  ) => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    switch (page) {
      case 'dashboard':
        return <Dashboard 
          onNewProject={onNewProject} 
          onProjectClick={onProjectClick} 
          userProjects={userProjects} 
          onDeleteProject={onDeleteProject}
          onLikeProject={onLikeProject}
          onViewProject={onViewProject}
          onToggleFavorite={onToggleFavorite}
          onPageChange={onPageChange}
        />;
      case 'projects':
        return <ProjectsList
          onNewProject={onNewProject} 
          onProjectClick={onProjectClick} 
          userProjects={userProjects} 
          onDeleteProject={onDeleteProject}
          onLikeProject={onLikeProject}
          onViewProject={onViewProject}
          onToggleFavorite={onToggleFavorite}
        />;
      case 'combined':
        return <CombinedProjects />;
      default:
        return <Dashboard 
          onNewProject={onNewProject} 
          onProjectClick={onProjectClick} 
          userProjects={userProjects} 
          onDeleteProject={onDeleteProject}
          onLikeProject={onLikeProject}
          onViewProject={onViewProject}
          onToggleFavorite={onToggleFavorite}
          onPageChange={onPageChange}
        />;
    }
  }, [isLoading]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />
      
      <div className="flex-1 overflow-y-auto">
        {showNewProjectForm ? (
          <ProjectForm onClose={handleCloseForm} />
        ) : selectedProject ? (
          <ProjectDetails 
            project={selectedProject} 
            onBack={handleBackToProjects} 
            onDelete={handleDeleteProject}
            onLike={handleLikeProject}
            onView={handleViewProject}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          renderContent(
            activePage, 
            handleNewProject, 
            handleProjectClick, 
            projects, 
            handleDeleteProject,
            handleLikeProject,
            handleViewProject,
            handleToggleFavorite,
            handlePageChange
          )
        )}
      </div>
    </div>
  );
};

export default Index;
