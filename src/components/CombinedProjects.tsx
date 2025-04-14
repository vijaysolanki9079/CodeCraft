import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, MessageSquare, X, Plus, Trash2 } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'completed' | 'rejected';
  comments: Comment[];
  dueDate: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface TeamProject {
  id: string;
  title: string;
  description: string;
  image: string;
  members: TeamMember[];
  tasks: Task[];
  progress: number;
}

const mockTeamProjects: TeamProject[] = [
  {
    id: '1',
    title: 'Marketing Website Redesign',
    description: 'Collaborative project to redesign the company marketing website',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    members: [
      { id: '1', name: 'Ajay', avatar: 'A', role: 'Project Lead' },
      { id: '2', name: 'Tejinder', avatar: 'T', role: 'Designer' },
      { id: '3', name: 'Dhruv', avatar: 'S', role: 'Developer' }
    ],
    tasks: [
      {
        id: '1',
        title: 'Create wireframes',
        description: 'Design initial wireframes for homepage and product pages',
        assignedTo: '2',
        status: 'completed',
        comments: [
          { id: '1', author: '1', text: 'Looking good! Can you add more details to the hero section?', timestamp: '2025-03-30T14:30:00' }
        ],
        dueDate: '2025-04-02'
      },
      {
        id: '2',
        title: 'Implement responsive design',
        description: 'Make sure the website works well on all devices',
        assignedTo: '3',
        status: 'pending',
        comments: [],
        dueDate: '2025-04-10'
      }
    ],
    progress: 35
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Team project to build an e-commerce platform with inventory management',
    image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?q=80&w=2070&auto=format&fit=crop',
    members: [
      { id: '1', name: 'Beer', avatar: 'A', role: 'Backend Developer' },
      { id: '4', name: 'Harshvir', avatar: 'J', role: 'Frontend Developer' },
      { id: '5', name: 'Uday', avatar: 'M', role: 'UX Designer' }
    ],
    tasks: [
      {
        id: '3',
        title: 'Set up payment gateway',
        description: 'Integrate Stripe for payment processing',
        assignedTo: '1',
        status: 'pending',
        comments: [],
        dueDate: '2025-04-15'
      },
      {
        id: '4',
        title: 'Design checkout flow',
        description: 'Create a seamless checkout experience',
        assignedTo: '5',
        status: 'rejected',
        comments: [
          { id: '2', author: '4', text: 'This needs more work, the user flow is confusing', timestamp: '2025-04-01T09:15:00' }
        ],
        dueDate: '2025-04-05'
      }
    ],
    progress: 42
  }
];

const CombinedProjects = () => {
  const [projects, setProjects] = useState<TeamProject[]>(mockTeamProjects);
  const [selectedProject, setSelectedProject] = useState<TeamProject | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  
  // New state for team members
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [teamRoles, setTeamRoles] = useState<string[]>(['']);
  
  const { toast } = useToast();

  const handleProjectSelect = (project: TeamProject) => {
    setSelectedProject(project);
    setSelectedTask(null);
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleStatusChange = (taskId: string, status: 'pending' | 'completed' | 'rejected') => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        const updatedTasks = project.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status };
          }
          return task;
        });
        
        const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
        const totalTasks = updatedTasks.length;
        const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        return { 
          ...project, 
          tasks: updatedTasks,
          progress: newProgress
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    
    const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
    if (updatedProject) {
      setSelectedProject(updatedProject);
      setSelectedTask(updatedProject.tasks.find(t => t.id === taskId) || null);
    }
    
    toast({
      title: "Task Updated",
      description: `Task status has been changed to ${status}`,
      className: `border-2 bg-opacity-20 shadow-lg ${
        status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-950/30 shadow-green-500/20' :
        status === 'rejected' ? 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-red-500/20' :
        'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-amber-500/20'
      }`,
      duration: 3000,
    });
  };
  
  const handleAddComment = () => {
    if (!selectedProject || !selectedTask || !commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: '1',
      text: commentText,
      timestamp: new Date().toISOString()
    };
    
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        const updatedTasks = project.tasks.map(task => {
          if (task.id === selectedTask.id) {
            return { 
              ...task, 
              comments: [...task.comments, newComment] 
            };
          }
          return task;
        });
        return { ...project, tasks: updatedTasks };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    
    const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
    if (updatedProject) {
      setSelectedProject(updatedProject);
      setSelectedTask(updatedProject.tasks.find(t => t.id === selectedTask.id) || null);
      setCommentText('');
    }
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the task",
      className: "border-codeblue border-2 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/20",
      duration: 3000,
    });
  };
  
  const handleAddTask = () => {
    if (!selectedProject || !newTaskTitle || !newTaskDescription || !newTaskDueDate || !newTaskAssignee) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      assignedTo: newTaskAssignee,
      status: 'pending',
      comments: [],
      dueDate: newTaskDueDate
    };
    
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        const updatedTasks = [...project.tasks, newTask];
        
        const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
        const totalTasks = updatedTasks.length;
        const newProgress = Math.round((completedTasks / totalTasks) * 100);
        
        return { 
          ...project, 
          tasks: updatedTasks,
          progress: newProgress
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    
    const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
    if (updatedProject) {
      setSelectedProject(updatedProject);
    }
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDueDate('');
    setNewTaskAssignee('');
    setIsAddingTask(false);
    
    toast({
      title: "Task Added",
      description: "New task has been added to the project",
      className: "border-green-500 border-2 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-500/20",
      duration: 3000,
    });
  };
  
  const handleDeleteProject = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
      setSelectedTask(null);
    }
    
    toast({
      title: "Project Deleted",
      description: "The project has been removed from your list",
      className: "border-red-500 border-2 bg-red-50 dark:bg-red-950/30 shadow-lg shadow-red-500/20",
      duration: 3000,
    });
  };

  const addTeamMemberField = () => {
    setTeamMembers([...teamMembers, '']);
    setTeamRoles([...teamRoles, '']);
  };

  const removeTeamMemberField = (index: number) => {
    const updatedMembers = [...teamMembers];
    const updatedRoles = [...teamRoles];
    updatedMembers.splice(index, 1);
    updatedRoles.splice(index, 1);
    setTeamMembers(updatedMembers);
    setTeamRoles(updatedRoles);
  };

  const handleTeamMemberChange = (index: number, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = value;
    setTeamMembers(updatedMembers);
  };

  const handleTeamRoleChange = (index: number, value: string) => {
    const updatedRoles = [...teamRoles];
    updatedRoles[index] = value;
    setTeamRoles(updatedRoles);
  };

  const handleAddProject = () => {
    if (!newProjectTitle || !newProjectDescription) return;
    
    // Create team members from inputs
    const members: TeamMember[] = teamMembers
      .map((name, index) => {
        if (!name.trim()) return null;
        
        return {
          id: `member-${Date.now()}-${index}`,
          name: name,
          avatar: name.charAt(0).toUpperCase(),
          role: teamRoles[index] || 'Team Member'
        };
      })
      .filter((member): member is TeamMember => member !== null);
    
    // Add at least the creator if no members were specified
    if (members.length === 0) {
      members.push({
        id: `member-${Date.now()}`,
        name: 'Project Owner',
        avatar: 'P',
        role: 'Project Owner'
      });
    }
    
    const newProject: TeamProject = {
      id: Date.now().toString(),
      title: newProjectTitle,
      description: newProjectDescription,
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop',
      members: members,
      tasks: [],
      progress: 0
    };
    
    setProjects([newProject, ...projects]);
    setNewProjectTitle('');
    setNewProjectDescription('');
    setTeamMembers(['']);
    setTeamRoles(['']);
    setIsAddingProject(false);
    
    toast({
      title: "Project Added",
      description: "New team project has been created",
      className: "border-green-500 border-2 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-500/20",
      duration: 3000,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Combined Projects</h1>
          <p className="text-muted-foreground">Collaborate with team members on shared projects</p>
        </div>
        <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 bg-codepurple hover:bg-codepurple-dark">
              <Plus size={18} className="mr-1" /> Add Team Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Team Project</DialogTitle>
              <DialogDescription>
                Add project details and team members
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-title">Project Title</Label>
                <Input 
                  id="project-title" 
                  value={newProjectTitle} 
                  onChange={(e) => setNewProjectTitle(e.target.value)} 
                  placeholder="Enter project title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea 
                  id="project-description" 
                  value={newProjectDescription} 
                  onChange={(e) => setNewProjectDescription(e.target.value)} 
                  placeholder="Enter project description"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Team Members</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addTeamMemberField}
                    className="h-8"
                  >
                    <Plus size={16} className="mr-1" /> Add Member
                  </Button>
                </div>
                
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`member-name-${index}`}>Name</Label>
                      <Input
                        id={`member-name-${index}`}
                        value={member}
                        onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                        placeholder="Team member name"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`member-role-${index}`}>Role</Label>
                      <Input
                        id={`member-role-${index}`}
                        value={teamRoles[index]}
                        onChange={(e) => handleTeamRoleChange(index, e.target.value)}
                        placeholder="e.g. Developer, Designer"
                      />
                    </div>
                    {teamMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeTeamMemberField(index)}
                        className="h-10 w-10"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingProject(false)}>Cancel</Button>
              <Button 
                onClick={handleAddProject}
                disabled={!newProjectTitle || !newProjectDescription}
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Team Projects</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingProject(true)}
              className="h-8"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
          
          {projects.length > 0 ? (
            projects.map(project => (
              <Card 
                key={project.id} 
                className={`mb-4 cursor-pointer transition-all hover:shadow-md ${selectedProject?.id === project.id ? 'ring-2 ring-codepurple' : ''}`}
                onClick={() => handleProjectSelect(project)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="relative h-32 -mx-6 -mt-6 mb-2 overflow-hidden rounded-t-lg">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {selectedProject?.id === project.id && (
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div 
                        className="bg-codepurple h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{project.progress}%</span>
                  </div>
                  <div className="flex -space-x-2 overflow-hidden mt-3">
                    {project.members.map(member => (
                      <div 
                        key={member.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-codeblue text-white font-medium"
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No team projects yet</p>
              <Button onClick={() => setIsAddingProject(true)}>
                <Plus size={16} className="mr-1" /> Create Your First Project
              </Button>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedProject ? (
            <Tabs defaultValue="tasks">
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="members">Team Members</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium flex items-center">
                        <Clock size={16} className="mr-1" /> Pending
                      </h3>
                      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8">
                            <Plus size={16} className="mr-1" /> Add Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="task-title">Task Title</Label>
                              <Input 
                                id="task-title" 
                                value={newTaskTitle} 
                                onChange={(e) => setNewTaskTitle(e.target.value)} 
                                placeholder="Enter task title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-description">Description</Label>
                              <Textarea 
                                id="task-description" 
                                value={newTaskDescription} 
                                onChange={(e) => setNewTaskDescription(e.target.value)} 
                                placeholder="Enter task description"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-due-date">Due Date</Label>
                              <Input 
                                id="task-due-date" 
                                type="date" 
                                value={newTaskDueDate} 
                                onChange={(e) => setNewTaskDueDate(e.target.value)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-assignee">Assign To</Label>
                              <select 
                                id="task-assignee"
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                value={newTaskAssignee}
                                onChange={(e) => setNewTaskAssignee(e.target.value)}
                              >
                                <option value="">Select Team Member</option>
                                {selectedProject.members.map(member => (
                                  <option key={member.id} value={member.id}>
                                    {member.name} ({member.role})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                            <Button 
                              onClick={handleAddTask}
                              disabled={!newTaskTitle || !newTaskDescription || !newTaskDueDate || !newTaskAssignee}
                            >
                              Add Task
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {selectedProject.tasks
                      .filter(task => task.status === 'pending')
                      .map(task => (
                        <Card 
                          key={task.id} 
                          className={`mb-3 cursor-pointer ${selectedTask?.id === task.id ? 'ring-2 ring-codepurple' : ''}`}
                          onClick={() => handleTaskSelect(task)}
                        >
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-1 pb-0">
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </CardContent>
                          <CardFooter className="p-3 flex justify-between items-center text-xs text-muted-foreground">
                            <div>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex">
                              <MessageSquare size={14} className="mr-1" />
                              {task.comments.length}
                            </div>
                          </CardFooter>
                        </Card>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <Check size={16} className="mr-1" /> Completed
                    </h3>
                    {selectedProject.tasks
                      .filter(task => task.status === 'completed')
                      .map(task => (
                        <Card 
                          key={task.id} 
                          className={`mb-3 cursor-pointer ${selectedTask?.id === task.id ? 'ring-2 ring-codepurple' : ''}`}
                          onClick={() => handleTaskSelect(task)}
                        >
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-1 pb-0">
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </CardContent>
                          <CardFooter className="p-3 flex justify-between items-center text-xs text-muted-foreground">
                            <div>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex">
                              <MessageSquare size={14} className="mr-1" />
                              {task.comments.length}
                            </div>
                          </CardFooter>
                        </Card>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <X size={16} className="mr-1" /> Rejected
                    </h3>
                    {selectedProject.tasks
                      .filter(task => task.status === 'rejected')
                      .map(task => (
                        <Card 
                          key={task.id} 
                          className={`mb-3 cursor-pointer ${selectedTask?.id === task.id ? 'ring-2 ring-codepurple' : ''}`}
                          onClick={() => handleTaskSelect(task)}
                        >
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-1 pb-0">
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </CardContent>
                          <CardFooter className="p-3 flex justify-between items-center text-xs text-muted-foreground">
                            <div>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex">
                              <MessageSquare size={14} className="mr-1" />
                              {task.comments.length}
                            </div>
                          </CardFooter>
                        </Card>
                    ))}
                  </div>
                </div>
                
                {selectedTask && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>{selectedTask.title}</CardTitle>
                      <CardDescription>{selectedTask.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Assigned To</p>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const member = selectedProject.members.find(m => m.id === selectedTask.assignedTo);
                              return member ? (
                                <>
                                  <div className="w-8 h-8 rounded-full bg-codeblue flex items-center justify-center text-white font-medium">
                                    {member.avatar}
                                  </div>
                                  <span>{member.name}</span>
                                </>
                              ) : <span>Unassigned</span>;
                            })()}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Due Date</p>
                          <p>{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Status</p>
                          <div className="flex gap-2">
                            <button 
                              className={`px-3 py-1 text-sm rounded-full ${selectedTask.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-secondary text-secondary-foreground'}`}
                              onClick={() => handleStatusChange(selectedTask.id, 'pending')}
                            >
                              Pending
                            </button>
                            <button 
                              className={`px-3 py-1 text-sm rounded-full ${selectedTask.status === 'completed' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}`}
                              onClick={() => handleStatusChange(selectedTask.id, 'completed')}
                            >
                              Completed
                            </button>
                            <button 
                              className={`px-3 py-1 text-sm rounded-full ${selectedTask.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-secondary text-secondary-foreground'}`}
                              onClick={() => handleStatusChange(selectedTask.id, 'rejected')}
                            >
                              Rejected
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Comments ({selectedTask.comments.length})</p>
                          <div className="space-y-3 mt-2">
                            {selectedTask.comments.map(comment => {
                              const author = selectedProject.members.find(m => m.id === comment.author);
                              return (
                                <div key={comment.id} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-codeblue flex items-center justify-center text-white font-medium shrink-0">
                                    {author?.avatar || '?'}
                                  </div>
                                  <div className="bg-secondary p-3 rounded-lg w-full">
                                    <div className="flex justify-between mb-1">
                                      <span className="font-medium">{author?.name || 'Unknown'}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(comment.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                  </div>
                                </div>
                              );
                            })}
                            
                            <div className="flex gap-3 mt-4">
                              <div className="w-8 h-8 rounded-full bg-codeblue flex items-center justify-center text-white font-medium shrink-0">
                                {selectedProject.members[0].avatar}
                              </div>
                              <div className="w-full">
                                <Textarea 
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Add a comment..."
                                  className="mb-2"
                                />
                                <button 
                                  onClick={handleAddComment}
                                  className="px-4 py-2 bg-codepurple hover:bg-codepurple-dark text-white rounded-md transition-colors"
                                  disabled={!commentText.trim()}
                                >
                                  Add Comment
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="members">
                <h3 className="text-xl font-semibold mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.members.map(member => (
                    <Card key={member.id} className="flex items-center p-4">
                      <div className="w-12 h-12 rounded-full bg-codeblue flex items-center justify-center text-white font-medium mr-4">
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">Select a project to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedProjects;
