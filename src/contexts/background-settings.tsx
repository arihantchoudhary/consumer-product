"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BackgroundColors {
  red: string;
  blue: string;
  purple: string;
  pink: string;
  indigo: string;
}

interface BackgroundSettingsContextType {
  colors: BackgroundColors;
  updateColor: (colorName: keyof BackgroundColors, value: string) => void;
  resetColors: () => void;
}

const defaultColors: BackgroundColors = {
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#9333ea',
  pink: '#ec4899',
  indigo: '#6366f1'
};

const BackgroundSettingsContext = createContext<BackgroundSettingsContextType | undefined>(undefined);

export function BackgroundSettingsProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<BackgroundColors>(defaultColors);

  // Load saved colors from localStorage on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('backgroundColors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);

  const updateColor = (colorName: keyof BackgroundColors, value: string) => {
    const newColors = { ...colors, [colorName]: value };
    setColors(newColors);
    localStorage.setItem('backgroundColors', JSON.stringify(newColors));
  };

  const resetColors = () => {
    setColors(defaultColors);
    localStorage.removeItem('backgroundColors');
  };

  return (
    <BackgroundSettingsContext.Provider value={{ colors, updateColor, resetColors }}>
      {children}
    </BackgroundSettingsContext.Provider>
  );
}

export function useBackgroundSettings() {
  const context = useContext(BackgroundSettingsContext);
  if (context === undefined) {
    throw new Error('useBackgroundSettings must be used within a BackgroundSettingsProvider');
  }
  return context;
}