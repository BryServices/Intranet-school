
export interface User {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  level: string;
  major: string;
  option: string;
  isClassRep: boolean;
  gpa: number;
  rank: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  important: boolean;
  imageUrl?: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isMe: boolean;
  avatarUrl?: string;
}

export interface Absence {
  id: string;
  date: string;
  subject: string;
  type: 'CM' | 'TD' | 'TP';
  duration: string; // "2h"
  status: 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING';
  justificationUrl?: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'fr' | 'en' | 'es' | 'de';
