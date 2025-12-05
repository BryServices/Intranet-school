
// --- CORE ENTITIES (UML BASED) ---

export type Role = 'admin' | 'teacher' | 'student' | 'finance';

export interface User {
  id: string;
  username: string; // matricule for students, email for others
  fullName: string;
  avatarUrl: string;
  role: Role;
  // Linked entities IDs
  linkedStudentId?: string;
  linkedTeacherId?: string;
  
  // Extended properties for UI
  bio?: string;
  gpa?: number;
  rank?: number;
  level?: string;
  major?: string;
  isClassRep?: boolean;
  matricule?: string;
  firstName?: string;
  lastName?: string;
}

// 1. Department
export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartmentId?: string; // Teacher ID
}

// 2. Program (Filière)
export interface Program {
  id: string;
  name: string;
  departmentId: string;
  durationYears: number;
  tuitionFee: number; // Coût annuel
}

// 3. Teacher
export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  departmentId: string;
  avatarUrl: string;
  joinDate: string;
}

// 4. Student (Extension of previous User logic but specific to academic data)
export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  gender: 'M' | 'F';
  avatarUrl: string;
  
  // Academic Relations
  departmentId: string;
  programId: string;
  level: string; // L1, L2, M1...
  status: 'ACTIVE' | 'ALUMNI' | 'SUSPENDED';
  registrationDate: string;
  
  // Calculated
  gpa: number;
}

// 5. Course (Matière/UE)
export type CourseType = 'CM' | 'TD' | 'TP' | 'EXAMEN';

export interface Course {
  id: string;
  title: string;
  code: string;
  credits: number;
  semester: 'S1' | 'S2';
  
  // Relations
  programId: string;
  teacherId: string;
  
  // Scheduling info (simplified for UI)
  day?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  color?: string;
}

// 6. Enrollment (Inscription matière - Simplified for MVP)
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  academicYear: string;
  dateEnrolled: string;
}

// 7. Result (Notes)
export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  type: 'CC' | 'EXAMEN';
  score: number;
  maxScore: number;
  academicYear: string;
}

// 8. Payment (Finances)
export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: 'TUITION' | 'REGISTRATION' | 'LIBRARY' | 'OTHER';
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  reference: string;
}

// --- APP UTILS & UI TYPES ---

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isMe: boolean;
  avatarUrl?: string;
}

export interface Grade {
  subject: string;
  code: string;
  value: number;
  coef: number;
  average: number; // class average
}

export interface ScheduleCourse {
    id: string;
    title: string;
    type: CourseType;
    startTime: string;
    endTime: string;
    room: string;
    professor: string;
}

export interface ScheduleDay {
    date: string;
    day: string;
    fullDate: string;
    courses: ScheduleCourse[];
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  important: boolean;
  category: string;
  imageUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'GRADE' | 'ADMIN' | 'EVENT' | 'CHAT' | 'CALENDAR';
  read: boolean;
}

export interface Absence {
  id: string;
  studentId: string;
  date: string;
  courseId: string; // Linked to Course
  type: CourseType; // Using CourseType from Course
  subject?: string; // UI convenience
  duration: string;
  status: 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING';
  justificationUrl?: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'fr' | 'en' | 'es' | 'de';
