import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default function Root({children}) {
  if (ExecutionEnvironment.canUseDOM) {
    // Force dark theme on mount
    document.documentElement.setAttribute('data-theme', 'dark');
    // Also set it in localStorage to persist
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('theme-preference', 'dark');
  }
  return <>{children}</>;
}


