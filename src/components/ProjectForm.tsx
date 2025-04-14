import React, { useState } from 'react';
import { Upload, X, Save } from 'lucide-react';
import { Project } from './ProjectCard';

interface ProjectFormProps {
  onClose: (newProject?: Project) => void;
}

const ProjectForm = ({ onClose }: ProjectFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  
  const categories = [
    'Web Development',
    'App Development',
    'AI/ML',
    'Data Science',
    'DevOps',
    'Blockchain'
  ];
  
  const techOptions = [
    'React',
    'Angular',
    'Vue.js',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Laravel',
    'Spring Boot',
    'ASP.NET',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Firebase',
    'AWS',
    'Docker',
    'Kubernetes',
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'C#',
    'PHP',
    'Go',
    'Rust',
    'TensorFlow',
    'PyTorch',
    'React Native',
    'Flutter',
    'Swift',
    'Kotlin'
  ];
  
  const handleTechStackChange = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileUpload(file);
  };
  
  const handleFileUpload = (file: File | undefined) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    handleFileUpload(file);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title || !description || !category || techStack.length === 0) {
      return;
    }
    
    // Create new project object
    const newProject: Project = {
      id: Date.now().toString(), // Generate a unique ID
      title,
      description,
      category,
      techStack,
      likes: 0,
      views: 0,
      image: image || 'https://images.unsplash.com/photo-1608306448197-e83633f1261c?q=80&w=2072&auto=format&fit=crop',
    };
    
    if (link) {
      newProject.link = link;
    }
    
    // Close form and pass the new project back
    onClose(newProject);
  };
  
  return (
    <div className="p-6 bg-background rounded-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <button
          onClick={() => onClose()}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter project description"
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Tech Stack (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {techOptions.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechStackChange(tech)}
                className={`px-3 py-1 rounded-full text-sm ${
                  techStack.includes(tech)
                    ? 'bg-codepurple text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
          {techStack.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select at least one technology
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="link" className="block text-sm font-medium">
            Project Link (optional)
          </label>
          <input
            id="link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://example.com/your-project"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Project Image
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragging
                ? 'border-codepurple bg-codepurple/10'
                : 'border-input'
            } transition-colors`}
          >
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Project preview"
                  className="h-48 mx-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-sm">
                  Drag and drop an image, or{' '}
                  <label className="text-codepurple hover:text-codepurple-dark cursor-pointer">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x630px (16:9)
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-4 py-2 border border-input rounded-md hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-codepurple hover:bg-codepurple-dark text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <Save size={18} />
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
