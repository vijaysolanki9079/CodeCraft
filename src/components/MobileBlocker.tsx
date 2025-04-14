
import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

const MobileBlocker = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50 p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Smartphone size={64} className="text-muted-foreground" />
          <div className="relative mx-2">
            <div className="absolute top-1/2 w-12 h-0.5 bg-destructive"></div>
            <div className="absolute top-1/2 w-12 h-0.5 bg-destructive rotate-45"></div>
            <div className="absolute top-1/2 w-12 h-0.5 bg-destructive -rotate-45"></div>
          </div>
          <Monitor size={64} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Desktop Only Application</h1>
        <p className="text-muted-foreground">
          This application is optimized for desktop use only. Please access it from a desktop or laptop computer for the best experience.
        </p>
      </div>
    </div>
  );
};

export default MobileBlocker;
