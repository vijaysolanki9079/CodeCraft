
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, User, Bell, Shield, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// Create a simple context for user data that will be available across components
interface UserData {
  username: string;
  email: string;
  bio: string;
  website: string;
  darkModeNotifications: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
}

// Create a global variable for user data (in a real app, this would use Context or Redux)
let globalUserData: UserData = {
  username: 'Vijay',
  email: 'vijaysolanki9079@gmail.com',
  bio: 'Frontend developer passionate about creating beautiful user interfaces',
  website: 'https://example.com',
  darkModeNotifications: true,
  emailNotifications: false,
  twoFactorAuth: false,
};

// Export the function to get user data from other components
export const getUserData = (): UserData => {
  return globalUserData;
};

// Export function to update user data
export const updateUserData = (data: Partial<UserData>) => {
  globalUserData = { ...globalUserData, ...data };
};

const SettingsPage = () => {
  const [formData, setFormData] = useState<UserData>({...globalUserData});
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || 'dashboard';

  useEffect(() => {
    // Update form data when global user data changes
    setFormData({...globalUserData});
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update global user data
    updateUserData(formData);
    
    // Show success toast with green styling
    toast({
      title: "Settings saved",
      description: "Your profile has been updated successfully.",
      className: "border-green-500 border-2 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-500/20",
      duration: 3000,
    });

    // Navigate back to the previous page
    navigate('/', { state: { returnTo } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar activePage="settings" onPageChange={(page) => navigate('/', { state: { returnTo: page } })} />
      
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="max-w-4xl">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={18} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={18} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={18} />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette size={18} />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={24} />
                Personal Information
              </h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-background dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full bg-background dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      className="w-full bg-background dark:bg-gray-800 resize-none h-24"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full bg-background dark:bg-gray-800"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-codepurple hover:bg-codepurple-dark text-white rounded-md flex items-center gap-2 transition-colors border-2 border-transparent hover:border-green-400 shadow-md hover:shadow-green-500/30"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive project updates via email</p>
                    </div>
                    <Switch 
                      checked={formData.emailNotifications} 
                      onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode Notifications</p>
                      <p className="text-sm text-muted-foreground">Use dark themed notifications</p>
                    </div>
                    <Switch 
                      checked={formData.darkModeNotifications} 
                      onCheckedChange={(checked) => handleSwitchChange('darkModeNotifications', checked)} 
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-codepurple hover:bg-codepurple-dark text-white rounded-md flex items-center gap-2 transition-colors border-2 border-transparent hover:border-green-400 shadow-md hover:shadow-green-500/30"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={formData.twoFactorAuth} 
                      onCheckedChange={(checked) => handleSwitchChange('twoFactorAuth', checked)} 
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-codepurple hover:bg-codepurple-dark text-white rounded-md flex items-center gap-2 transition-colors border-2 border-transparent hover:border-green-400 shadow-md hover:shadow-green-500/30"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
              <p className="text-muted-foreground mb-4">Manage how the application looks and feels.</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Theme</h3>
                <p className="text-sm text-muted-foreground mb-4">Toggle between light and dark mode using the theme toggle in the sidebar.</p>
              </div>
              
              <form onSubmit={handleSaveSettings}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-codepurple hover:bg-codepurple-dark text-white rounded-md flex items-center gap-2 transition-colors border-2 border-transparent hover:border-green-400 shadow-md hover:shadow-green-500/30"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
