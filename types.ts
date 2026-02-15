// Added React import to resolve 'Cannot find namespace React' for React.ReactNode
import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  // Fix: React namespace is now available via import
  icon: React.ReactNode;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Benefit {
  title: string;
  description: string;
  // Fix: React namespace is now available via import
  icon: React.ReactNode;
}