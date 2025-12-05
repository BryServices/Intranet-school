
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    User, Theme, Language, AppNotification, Announcement, 
    Student, Teacher, Department, Program, Course, Payment, Absence, Result,
    Grade, ScheduleDay
} from '../types';

interface AppContextType {
  // Auth
  user: User | null; // Current logged in user (Admin or Student)
  login: (username: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  // --- DATA MODULES ---
  
  // 1. Departments
  departments: Department[];
  addDepartment: (data: Omit<Department, 'id'>) => void;
  deleteDepartment: (id: string) => void;

  // 2. Programs
  programs: Program[];
  addProgram: (data: Omit<Program, 'id'>) => void;
  deleteProgram: (id: string) => void;

  // 3. Teachers
  teachers: Teacher[];
  addTeacher: (data: Omit<Teacher, 'id'>) => void;
  deleteTeacher: (id: string) => void;

  // 4. Students
  students: Student[];
  addStudent: (data: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // 5. Courses
  courses: Course[];
  addCourse: (data: Omit<Course, 'id'>) => void;
  deleteCourse: (id: string) => void;

  // 6. Payments
  payments: Payment[];
  addPayment: (data: Omit<Payment, 'id'>) => void;
  updatePaymentStatus: (id: string, status: Payment['status']) => void;

  // 7. Results & Absences (Legacy/Simplified)
  results: Result[];
  absences: Absence[];
  updateAbsenceStatus: (id: string, status: Absence['status']) => void;
  
  // 8. Grades & Schedule (UI Specific Mocks)
  grades: { S1: Grade[], S2: Grade[] };
  schedule: ScheduleDay[];

  // Utils
  announcements: Announcement[];
  addAnnouncement: (data: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  
  notifications: AppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;

  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- INITIAL MOCK DATA (Relational Consistency) ---

const DEPARTMENTS: Department[] = [
    { id: 'd1', name: 'Informatique & Numérique', description: 'Développement, Réseaux et IA', headOfDepartmentId: 't1' },
    { id: 'd2', name: 'Droit & Sciences Po', description: 'Juridique et politique', headOfDepartmentId: 't2' },
    { id: 'd3', name: 'Gestion & Commerce', description: 'Marketing, Finance et Management' }
];

const PROGRAMS: Program[] = [
    { id: 'p1', name: 'Génie Logiciel', departmentId: 'd1', durationYears: 5, tuitionFee: 4500 },
    { id: 'p2', name: 'Cybersécurité', departmentId: 'd1', durationYears: 3, tuitionFee: 5000 },
    { id: 'p3', name: 'Droit des Affaires', departmentId: 'd2', durationYears: 4, tuitionFee: 3000 }
];

const TEACHERS: Teacher[] = [
    { id: 't1', firstName: 'Alan', lastName: 'Turing', email: 'alan.t@univ.com', phone: '0600000001', specialty: 'Algorithmique', departmentId: 'd1', avatarUrl: 'https://ui-avatars.com/api/?name=Alan+Turing&background=random', joinDate: '2020-09-01' },
    { id: 't2', firstName: 'Simone', lastName: 'Veil', email: 'simone.v@univ.com', phone: '0600000002', specialty: 'Droit Constitutionnel', departmentId: 'd2', avatarUrl: 'https://ui-avatars.com/api/?name=Simone+Veil&background=random', joinDate: '2019-09-01' },
    { id: 't3', firstName: 'Ada', lastName: 'Lovelace', email: 'ada.l@univ.com', phone: '0600000003', specialty: 'Programmation', departmentId: 'd1', avatarUrl: 'https://ui-avatars.com/api/?name=Ada+Lovelace&background=random', joinDate: '2021-09-01' }
];

const STUDENTS: Student[] = [
    { 
        id: 's1', matricule: '2025-GL-001', firstName: 'Alexandre', lastName: 'Dupont', email: 'alex@student.com', phone: '0700000001', address: '12 Rue de la Paix', 
        birthDate: '2001-05-15', gender: 'M', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
        departmentId: 'd1', programId: 'p1', level: 'M1', status: 'ACTIVE', registrationDate: '2024-09-01', gpa: 16.5
    },
    { 
        id: 's2', matricule: '2025-DA-042', firstName: 'Sarah', lastName: 'Lambert', email: 'sarah@student.com', phone: '0700000002', address: '5 Avenue Foch', 
        birthDate: '2002-08-22', gender: 'F', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        departmentId: 'd2', programId: 'p3', level: 'L3', status: 'ACTIVE', registrationDate: '2024-09-01', gpa: 15.2
    }
];

const COURSES: Course[] = [
    { id: 'c1', title: 'Algorithmique Avancée', code: 'INFO401', credits: 4, semester: 'S1', programId: 'p1', teacherId: 't1', day: 'Lundi', startTime: '08:30', endTime: '10:30', room: 'Amphi A', color: 'blue' },
    { id: 'c2', title: 'Droit Civil', code: 'DRT201', credits: 3, semester: 'S1', programId: 'p3', teacherId: 't2', day: 'Mardi', startTime: '14:00', endTime: '16:00', room: 'Amphi B', color: 'red' },
    { id: 'c3', title: 'Web Development', code: 'WEB305', credits: 5, semester: 'S1', programId: 'p1', teacherId: 't3', day: 'Jeudi', startTime: '10:00', endTime: '13:00', room: 'Salle 204', color: 'green' }
];

const PAYMENTS: Payment[] = [
    { id: 'pay1', studentId: 's1', amount: 1500, type: 'TUITION', date: '2024-09-15', status: 'PAID', reference: 'REF-998877' },
    { id: 'pay2', studentId: 's1', amount: 1500, type: 'TUITION', date: '2025-01-15', status: 'PENDING', reference: 'REF-998878' },
    { id: 'pay3', studentId: 's2', amount: 3000, type: 'TUITION', date: '2024-09-10', status: 'PAID', reference: 'REF-112233' }
];

const ABSENCES: Absence[] = [
    { id: 'a1', studentId: 's1', date: '14 Oct', courseId: 'c1', type: 'CM', duration: '2h', status: 'UNJUSTIFIED', subject: 'Algorithmique Avancée' }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
      { id: '1', title: 'Nouvelle note disponible', message: 'Votre note en Algorithmique Avancée a été publiée : 16.5/20', date: 'Il y a 10 min', type: 'GRADE', read: false },
      { id: '2', title: 'Changement de salle', message: 'Le cours de Droit du Numérique de 14h aura lieu en Salle 204.', date: 'Il y a 1h', type: 'CALENDAR', read: false }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Remise des diplômes 2024',
    description: 'La cérémonie aura lieu le 15 Juillet au grand amphithéâtre.',
    content: 'Détails complets...',
    date: '15 Juil',
    important: true,
    category: 'Événements',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
  }
];

// Mock Grades for UI
const MOCK_GRADES = {
    S1: [
        { subject: 'Algorithmique Avancée', code: 'INFO-401', value: 16.5, coef: 4, average: 12 },
        { subject: 'Bases de Données', code: 'INFO-402', value: 14.0, coef: 3, average: 11.5 },
        { subject: 'Droit du Numérique', code: 'DRT-202', value: 12.5, coef: 2, average: 13 },
        { subject: 'Anglais Technique', code: 'LNG-101', value: 18.0, coef: 2, average: 14 },
        { subject: 'Gestion de Projet', code: 'MGT-301', value: 15.0, coef: 3, average: 13.5 }
    ],
    S2: [
        { subject: 'Architecture Logicielle', code: 'INFO-405', value: 15.0, coef: 4, average: 11 },
        { subject: 'Intelligence Artificielle', code: 'INFO-410', value: 17.5, coef: 4, average: 12.5 },
        { subject: 'Sécurité Réseaux', code: 'SEC-305', value: 13.0, coef: 3, average: 10.5 }
    ]
};

// Mock Schedule for UI
const MOCK_SCHEDULE: ScheduleDay[] = [
    {
        date: '14', day: 'LUN', fullDate: 'Lundi 14 Octobre',
        courses: [
            { id: '1', title: 'Algorithmique', type: 'CM', startTime: '08:30', endTime: '10:30', room: 'Amphi A', professor: 'A. Turing' },
            { id: '2', title: 'Algorithmique', type: 'TD', startTime: '10:45', endTime: '12:45', room: 'Salle 204', professor: 'A. Turing' }
        ]
    },
    {
        date: '15', day: 'MAR', fullDate: 'Mardi 15 Octobre',
        courses: [
            { id: '3', title: 'Anglais', type: 'TD', startTime: '14:00', endTime: '16:00', room: 'Labo Langues', professor: 'J. Smith' }
        ]
    },
    {
        date: '16', day: 'MER', fullDate: 'Mercredi 16 Octobre',
        courses: []
    },
    {
        date: '17', day: 'JEU', fullDate: 'Jeudi 17 Octobre',
        courses: [
            { id: '4', title: 'Base de Données', type: 'CM', startTime: '09:00', endTime: '12:00', room: 'Amphi B', professor: 'E. Codd' },
            { id: '5', title: 'Projet Web', type: 'TP', startTime: '13:30', endTime: '17:30', room: 'Salle Info 3', professor: 'T. Berners-Lee' }
        ]
    },
    {
        date: '18', day: 'VEN', fullDate: 'Vendredi 18 Octobre',
        courses: [
             { id: '6', title: 'Droit Numérique', type: 'CM', startTime: '10:00', endTime: '12:00', room: 'Amphi C', professor: 'L. Lessig' }
        ]
    }
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('fr');
  
  // Data State
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [programs, setPrograms] = useState<Program[]>(PROGRAMS);
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [absences, setAbsences] = useState<Absence[]>(ABSENCES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [results] = useState<Result[]>([]); // simplified

  // --- EFFECTS ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // --- ACTIONS ---

  const login = (username: string) => {
    // Mock login logic
    if (username === 'admin') {
        setUser({ id: 'admin', username: 'admin', fullName: 'Administrateur', avatarUrl: '', role: 'admin' });
    } else {
        // Find student
        const student = students.find(s => s.matricule === username);
        if (student) {
            const program = programs.find(p => p.id === student.programId);
            setUser({ 
                id: student.id, 
                username: student.matricule, 
                matricule: student.matricule,
                fullName: `${student.firstName} ${student.lastName}`,
                firstName: student.firstName,
                lastName: student.lastName,
                avatarUrl: student.avatarUrl, 
                role: 'student', 
                linkedStudentId: student.id,
                // Mock UI fields
                bio: 'Passionné de technologie et de design.',
                gpa: student.gpa,
                rank: 12,
                level: student.level,
                major: program?.name || 'Non défini',
                isClassRep: Math.random() > 0.8
            });
        } else {
            // Default fallback
            setUser({ 
                id: 'u1', username: 'demo', fullName: 'Demo Student', avatarUrl: '', role: 'student',
                gpa: 14.5, rank: 5, level: 'M1', major: 'Informatique', bio: 'Etudiant Démo', isClassRep: true, matricule: '2025-DEMO'
            });
        }
    }
  };

  const logout = () => setUser(null);

  const updateUser = (data: Partial<User>) => {
      if (user) {
          setUser({ ...user, ...data });
      }
  };

  // Departments
  const addDepartment = (data: Omit<Department, 'id'>) => {
      setDepartments([...departments, { ...data, id: Date.now().toString() }]);
  };
  const deleteDepartment = (id: string) => setDepartments(prev => prev.filter(d => d.id !== id));

  // Programs
  const addProgram = (data: Omit<Program, 'id'>) => {
      setPrograms([...programs, { ...data, id: Date.now().toString() }]);
  };
  const deleteProgram = (id: string) => setPrograms(prev => prev.filter(p => p.id !== id));

  // Teachers
  const addTeacher = (data: Omit<Teacher, 'id'>) => {
      setTeachers([...teachers, { ...data, id: Date.now().toString(), avatarUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}` }]);
  };
  const deleteTeacher = (id: string) => setTeachers(prev => prev.filter(t => t.id !== id));

  // Students
  const addStudent = (data: Omit<Student, 'id'>) => {
      setStudents([...students, { ...data, id: Date.now().toString(), avatarUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}`, gpa: 0 }]);
  };
  const updateStudent = (id: string, data: Partial<Student>) => {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };
  const deleteStudent = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));

  // Courses
  const addCourse = (data: Omit<Course, 'id'>) => {
      setCourses([...courses, { ...data, id: Date.now().toString() }]);
  };
  const deleteCourse = (id: string) => setCourses(prev => prev.filter(c => c.id !== id));

  // Payments
  const addPayment = (data: Omit<Payment, 'id'>) => {
      setPayments([...payments, { ...data, id: Date.now().toString() }]);
  };
  const updatePaymentStatus = (id: string, status: Payment['status']) => {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  // Utils
  const addAnnouncement = (data: Omit<Announcement, 'id'>) => setAnnouncements(prev => [{...data, id: Date.now().toString()}, ...prev]);
  const deleteAnnouncement = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));
  
  const updateAbsenceStatus = (id: string, status: Absence['status']) => {
      setAbsences(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const setLanguage = (lang: Language) => setLanguageState(lang);
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <AppContext.Provider value={{ 
      user, login, logout, updateUser,
      departments, addDepartment, deleteDepartment,
      programs, addPrograms: addProgram, deleteProgram, addProgram,
      teachers, addTeacher, deleteTeacher,
      students, addStudent, updateStudent, deleteStudent,
      courses, addCourse, deleteCourse,
      payments, addPayment, updatePaymentStatus,
      announcements, addAnnouncement, deleteAnnouncement,
      notifications, unreadCount: notifications.filter(n => !n.read).length, markAllAsRead, deleteNotification,
      results, absences, updateAbsenceStatus,
      grades: MOCK_GRADES,
      schedule: MOCK_SCHEDULE,
      theme, toggleTheme, language, setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
