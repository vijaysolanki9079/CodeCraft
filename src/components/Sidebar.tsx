
import React, { useState, useEffect } from 'react';
import { Home, FolderKanban, PlusSquare, Settings, Users, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import { getUserData } from '@/pages/SettingsPage';

const MenuItem = ({ 
  icon: Icon, 
  label, 
  active = false,
  onClick,
  expanded
}: { 
  icon: React.ElementType, 
  label: string, 
  active?: boolean,
  onClick?: () => void,
  expanded?: boolean
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
        !expanded && "justify-center"
      )}
    >
      <Icon size={20} />
      {expanded && <span className="font-medium">{label}</span>}
    </div>
  );
};

const Sidebar = ({ 
  activePage, 
  onPageChange 
}: { 
  activePage: string,
  onPageChange: (page: string) => void 
}) => {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState(getUserData());
  
  // Update userData when settings are changed
  useEffect(() => {
    const updateUserData = () => {
      setUserData(getUserData());
    };
    
    // Check for user data changes every time the component renders
    updateUserData();
    
    // Also update when user returns to the page
    window.addEventListener('focus', updateUserData);
    return () => {
      window.removeEventListener('focus', updateUserData);
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'combined', label: 'Combined Projects', icon: Users },
    { id: 'newProject', label: 'New Project', icon: PlusSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
      expanded ? "w-64" : "w-20"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2", !expanded && "justify-center w-full")}>
          <div className="w-8 h-8 bg-codepurple rounded-md flex items-center justify-center">
            <FolderKanban size={20} className="text-white" />
          </div>
          {expanded && <h1 className="font-bold text-xl">CodeCraft</h1>}
        </div>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <div className="flex flex-col gap-1 p-3 mt-2">
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id}
            icon={item.icon} 
            label={item.label} 
            active={activePage === item.id}
            onClick={() => onPageChange(item.id)}
            expanded={expanded}
          />
        ))}
      </div>
      
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <ThemeToggle />
          {expanded && <span className="text-sm text-sidebar-foreground">Toggle Theme</span>}
        </div>
        
        {expanded ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-codeblue flex items-center justify-center text-white font-bold">
              {userData.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{userData.username}</p>
              <p className="text-xs text-muted-foreground">{userData.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-codeblue flex items-center justify-center text-white font-bold">
              {userData.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
