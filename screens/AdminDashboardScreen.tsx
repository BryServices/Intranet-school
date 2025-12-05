
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Search, Plus, Trash2, LogOut, 
    GraduationCap, Settings, Home,
    BookOpen, Layers, Briefcase, DollarSign,
    Menu, X, CheckCircle2, AlertCircle, ChevronRight, School, UserCheck,
    Moon, Sun, Globe, Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Department, Program, Teacher, Student, Course, Payment } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

// Types pour les onglets
type TabType = 'overview' | 'departments' | 'programs' | 'courses' | 'teachers' | 'students' | 'finance';

interface AdminDashboardScreenProps {
  onLogout: () => void;
}

// --- REUSABLE COMPONENTS FOR DASHBOARD ---

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
    <div className="bg-white dark:bg-surfaceDark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color} shadow-lg z-10`}>
            <Icon size={26} />
        </div>
        <div className="z-10">
            <p className="text-textSecLight dark:text-textSecDark text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-bold text-textMainLight dark:text-textMainDark">{value}</p>
        </div>
        {/* Decorative background element */}
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${color}`} />
    </div>
);

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed bottom-6 right-6 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100]">
        <CheckCircle2 size={20} className="text-green-400 dark:text-green-600" />
        <span className="font-bold text-sm">{message}</span>
    </motion.div>
);

const SectionHeader = ({ title, onAdd, buttonLabel }: { title: string, onAdd?: () => void, buttonLabel?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
             <h2 className="text-3xl font-bold text-textMainLight dark:text-textMainDark tracking-tight">{title}</h2>
             <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
        </div>
        {onAdd && (
            <Button onClick={onAdd} className="!h-11 !px-5 !text-sm shadow-lg shadow-primary/20 !rounded-xl">
                <Plus size={18} className="mr-2" />
                {buttonLabel || 'Ajouter'}
            </Button>
        )}
    </div>
);

// --- MAIN SCREEN ---

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onLogout }) => {
  const { 
      // Data
      departments, programs, teachers, students, courses, payments,
      // Actions
      addDepartment, deleteDepartment,
      addProgram, deleteProgram,
      addTeacher, deleteTeacher,
      addStudent, deleteStudent,
      addCourse, deleteCourse,
      addPayment, updatePaymentStatus,
      // System
      theme, toggleTheme, language, setLanguage
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Modal States
  const [modalType, setModalType] = useState<TabType | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');

  // --- FORMS STATES ---
  const [deptForm, setDeptForm] = useState<Partial<Department>>({ name: '', description: '' });
  const [progForm, setProgForm] = useState<Partial<Program>>({ name: '', durationYears: 3, tuitionFee: 0, departmentId: '' });
  const [teachForm, setTeachForm] = useState<Partial<Teacher>>({ firstName: '', lastName: '', email: '', specialty: '', departmentId: '' });
  const [studForm, setStudForm] = useState<Partial<Student>>({ firstName: '', lastName: '', email: '', matricule: '', departmentId: '', programId: '' });
  const [courseForm, setCourseForm] = useState<Partial<Course>>({ title: '', code: '', credits: 3, semester: 'S1', programId: '', teacherId: '' });
  const [payForm, setPayForm] = useState<Partial<Payment>>({ studentId: '', amount: 0, type: 'TUITION', status: 'PAID' });

  // --- HANDLERS ---
  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCloseModal = () => setModalType(null);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      switch (modalType) {
          case 'departments':
              if (deptForm.name) {
                  addDepartment(deptForm as any);
                  setDeptForm({ name: '', description: '' });
                  showToast('Département ajouté');
              }
              break;
          case 'programs':
              if (progForm.name && progForm.departmentId) {
                  addProgram(progForm as any);
                  setProgForm({ name: '', durationYears: 3, tuitionFee: 0, departmentId: '' });
                  showToast('Filière ajoutée');
              }
              break;
          case 'teachers':
              if (teachForm.firstName && teachForm.departmentId) {
                  addTeacher(teachForm as any);
                  setTeachForm({ firstName: '', lastName: '', email: '', specialty: '', departmentId: '' });
                  showToast('Enseignant ajouté');
              }
              break;
          case 'students':
              if (studForm.firstName && studForm.programId) {
                  addStudent(studForm as any);
                  setStudForm({ firstName: '', lastName: '', email: '', matricule: '', departmentId: '', programId: '' });
                  showToast('Étudiant inscrit');
              }
              break;
          case 'courses':
              if (courseForm.title && courseForm.programId && courseForm.teacherId) {
                  addCourse(courseForm as any);
                  setCourseForm({ title: '', code: '', credits: 3, semester: 'S1', programId: '', teacherId: '' });
                  showToast('Cours créé');
              }
              break;
          case 'finance':
              if (payForm.studentId && payForm.amount) {
                  addPayment({ ...payForm, date: new Date().toISOString().split('T')[0], reference: `REF-${Date.now()}` } as any);
                  showToast('Paiement enregistré');
              }
              break;
      }
      handleCloseModal();
  };

  // --- RENDERERS FOR EACH MODULE ---

  const renderOverview = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Étudiants" value={students.length} icon={Users} color="bg-blue-500" />
              <StatCard title="Enseignants" value={teachers.length} icon={GraduationCap} color="bg-purple-500" />
              <StatCard title="Cours Actifs" value={courses.length} icon={BookOpen} color="bg-orange-500" />
              <StatCard title="Revenus (Mois)" value={`${payments.reduce((acc, p) => acc + p.amount, 0)} €`} icon={DollarSign} color="bg-green-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Payments Widget */}
              <div className="bg-white dark:bg-surfaceDark p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-textMainLight dark:text-textMainDark">Derniers Paiements</h3>
                      <button onClick={() => setActiveTab('finance')} className="text-xs font-bold text-primary hover:underline">Voir tout</button>
                  </div>
                  <div className="space-y-4">
                      {payments.length === 0 ? (
                          <div className="text-center py-10 text-gray-400 text-sm">Aucun paiement récent</div>
                      ) : payments.slice(0, 4).map(p => {
                          const s = students.find(std => std.id === p.studentId);
                          return (
                              <div key={p.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center font-bold">$</div>
                                      <div>
                                          <p className="font-bold text-sm text-textMainLight dark:text-textMainDark">{s?.firstName} {s?.lastName}</p>
                                          <p className="text-xs text-textSecLight">{p.type} • {p.date}</p>
                                      </div>
                                  </div>
                                  <span className="font-bold text-green-600">+{p.amount} €</span>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* Department Distribution Widget */}
              <div className="bg-white dark:bg-surfaceDark p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-textMainLight dark:text-textMainDark">Répartition / Dpt</h3>
                      <button onClick={() => setActiveTab('departments')} className="text-xs font-bold text-primary hover:underline">Gérer</button>
                  </div>
                  <div className="space-y-6">
                      {departments.length === 0 ? (
                           <div className="text-center py-10 text-gray-400 text-sm">Aucun département configuré</div>
                      ) : departments.map(dept => {
                          const count = students.filter(s => s.departmentId === dept.id).length;
                          const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
                          return (
                            <div key={dept.id}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-bold text-textMainLight dark:text-textMainDark">{dept.name}</span>
                                    <span className="text-textSecLight dark:text-textSecDark font-medium">{count} étudiants</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-primary" 
                                    />
                                </div>
                            </div>
                          )
                      })}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderDepartments = () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader title="Départements" onAdd={() => setModalType('departments')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map(dept => {
                  const head = teachers.find(t => t.id === dept.headOfDepartmentId);
                  const progCount = programs.filter(p => p.departmentId === dept.id).length;
                  const studCount = students.filter(s => s.departmentId === dept.id).length;
                  
                  return (
                      <div key={dept.id} className="bg-white dark:bg-surfaceDark p-6 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                                  <Layers size={24} />
                              </div>
                              <button onClick={() => deleteDepartment(dept.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                  <Trash2 size={18} />
                              </button>
                          </div>
                          <h3 className="text-lg font-bold text-textMainLight dark:text-textMainDark mb-1">{dept.name}</h3>
                          <p className="text-sm text-textSecLight dark:text-textSecDark mb-6 line-clamp-2 min-h-[40px]">{dept.description}</p>
                          
                          <div className="flex items-center gap-3 text-sm text-textSecLight dark:text-textSecDark bg-gray-50 dark:bg-white/5 p-3 rounded-xl mb-4">
                              <UserCheck size={16} className="flex-shrink-0" />
                              <span className="truncate font-medium">{head ? `${head.firstName} ${head.lastName}` : 'Aucun responsable'}</span>
                          </div>

                          <div className="flex gap-2">
                              <span className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-xs font-bold text-textSecLight dark:text-textSecDark">{progCount} Filières</span>
                              <span className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-xs font-bold text-textSecLight dark:text-textSecDark">{studCount} Étudiants</span>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
  );

  const renderPrograms = () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader title="Filières (Programmes)" onAdd={() => setModalType('programs')} />
          <div className="space-y-4">
              {programs.map(prog => {
                  const dept = departments.find(d => d.id === prog.departmentId);
                  return (
                      <div key={prog.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-surfaceDark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm gap-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                                  <BookOpen size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg text-textMainLight dark:text-textMainDark">{prog.name}</h3>
                                  <p className="text-sm text-textSecLight dark:text-textSecDark font-medium flex items-center gap-1.5 mt-0.5">
                                      <Layers size={14} />
                                      {dept?.name || 'Département inconnu'}
                                  </p>
                              </div>
                          </div>
                          <div className="flex items-center gap-6 sm:gap-10 pl-16 sm:pl-0">
                              <div className="flex flex-col items-start sm:items-center">
                                  <span className="font-bold text-lg text-textMainLight dark:text-textMainDark">{prog.durationYears} ans</span>
                                  <span className="text-[10px] text-textSecLight dark:text-textSecDark uppercase font-bold tracking-wide">Durée</span>
                              </div>
                              <div className="flex flex-col items-start sm:items-center">
                                  <span className="font-bold text-lg text-textMainLight dark:text-textMainDark">{prog.tuitionFee} €</span>
                                  <span className="text-[10px] text-textSecLight dark:text-textSecDark uppercase font-bold tracking-wide">Coût/An</span>
                              </div>
                              <button onClick={() => deleteProgram(prog.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors ml-auto sm:ml-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
                                  <Trash2 size={20} />
                              </button>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
  );

  const renderTeachers = () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader title="Enseignants" onAdd={() => setModalType('teachers')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map(t => {
                  const dept = departments.find(d => d.id === t.departmentId);
                  return (
                      <div key={t.id} className="bg-white dark:bg-surfaceDark p-6 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-5 relative group hover:-translate-y-1 transition-transform duration-300">
                          <img src={t.avatarUrl} alt="" className="w-16 h-16 rounded-2xl object-cover bg-gray-100 dark:bg-white/10" />
                          <div>
                              <h3 className="font-bold text-lg text-textMainLight dark:text-textMainDark leading-tight">{t.firstName} {t.lastName}</h3>
                              <p className="text-xs text-primary font-bold uppercase tracking-wide mt-1">{t.specialty}</p>
                              <p className="text-xs text-textSecLight dark:text-textSecDark mt-1">{dept?.name}</p>
                          </div>
                          <button onClick={() => deleteTeacher(t.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg">
                              <Trash2 size={16} />
                          </button>
                      </div>
                  )
              })}
          </div>
      </div>
  );

  const renderStudents = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-textMainLight dark:text-textMainDark">Étudiants</h2>
            <div className="flex gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 pl-10 pr-4 bg-white dark:bg-surfaceDark border border-gray-100 dark:border-white/10 rounded-xl text-sm outline-none focus:border-primary w-full md:w-64"
                    />
                 </div>
                 <Button onClick={() => setModalType('students')} className="!h-11 !px-4 !text-sm !rounded-xl">
                    <Plus size={18} className="mr-2" />
                    Inscrire
                 </Button>
            </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm bg-white dark:bg-surfaceDark">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-xs text-textSecLight dark:text-textSecDark uppercase tracking-wider font-bold">
                        <th className="p-5">Étudiant</th>
                        <th className="p-5">Matricule</th>
                        <th className="p-5">Filière</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {students.filter(s => 
                        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(s => {
                        const prog = programs.find(p => p.id === s.programId);
                        return (
                            <tr key={s.id} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <img src={s.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                        <span className="font-bold text-textMainLight dark:text-textMainDark text-base">{s.firstName} {s.lastName}</span>
                                    </div>
                                </td>
                                <td className="p-5 font-mono text-textSecLight dark:text-textSecDark font-medium">{s.matricule}</td>
                                <td className="p-5">
                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-bold text-textSecLight dark:text-textSecDark">
                                        {prog?.name || 'Non assigné'}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <button onClick={() => deleteStudent(s.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderCourses = () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader title="Cours (Matières)" onAdd={() => setModalType('courses')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(c => {
                  const teacher = teachers.find(t => t.id === c.teacherId);
                  const prog = programs.find(p => p.id === c.programId);
                  return (
                      <div key={c.id} className="bg-white dark:bg-surfaceDark p-6 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-textSecLight mb-2 inline-block uppercase tracking-wider">{c.code}</span>
                                  <h3 className="font-bold text-textMainLight dark:text-textMainDark text-xl leading-tight">{c.title}</h3>
                              </div>
                              <button onClick={() => deleteCourse(c.id)} className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                              <div className="flex items-center gap-3 text-sm text-textSecLight dark:text-textSecDark bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                                  <School size={16} /> 
                                  <span className="font-medium">{prog?.name}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-textSecLight dark:text-textSecDark bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                                  <UserCheck size={16} /> 
                                  <span className="font-medium">{teacher?.firstName} {teacher?.lastName}</span>
                              </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{c.semester}</span>
                                <span className="text-xs font-bold text-textMainLight dark:text-textMainDark">{c.credits} Crédits ECTS</span>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
  );

  const renderFinance = () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader title="Finances & Paiements" onAdd={() => setModalType('finance')} buttonLabel="Nouveau Paiement" />
          <div className="space-y-4">
              {payments.map(p => {
                  const student = students.find(s => s.id === p.studentId);
                  return (
                      <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-surfaceDark p-5 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm gap-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-5">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.status === 'PAID' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'}`}>
                                  <DollarSign size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-xl text-textMainLight dark:text-textMainDark">{p.amount} €</h3>
                                  <p className="text-sm text-textSecLight dark:text-textSecDark font-medium mt-0.5">{student?.firstName} {student?.lastName} • {p.reference}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-gray-100 dark:border-white/5 pt-4 md:pt-0">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${p.status === 'PAID' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>
                                  {p.status === 'PAID' ? 'PAYÉ' : 'EN ATTENTE'}
                              </span>
                              {p.status === 'PENDING' && (
                                  <button onClick={() => { updatePaymentStatus(p.id, 'PAID'); showToast('Marqué comme payé'); }} className="text-xs font-bold text-primary hover:underline">
                                      Valider
                                  </button>
                              )}
                              <span className="text-xs font-bold text-textSecLight dark:text-textSecDark">{p.date}</span>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
  );

  // --- TAB CONFIG ---
  const TABS = [
      { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
      { id: 'departments', label: 'Départements', icon: Layers },
      { id: 'programs', label: 'Filières', icon: BookOpen },
      { id: 'courses', label: 'Cours', icon: School },
      { id: 'teachers', label: 'Enseignants', icon: GraduationCap },
      { id: 'students', label: 'Étudiants', icon: Users },
      { id: 'finance', label: 'Finances', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#050505] flex text-textMainLight dark:text-textMainDark font-sans overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
         {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
          {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              />
          )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`
            fixed top-4 bottom-4 left-4 z-50 w-72 bg-white dark:bg-[#121212] rounded-[32px] shadow-2xl lg:shadow-none lg:rounded-none lg:bg-transparent lg:dark:bg-transparent border-r border-gray-200 lg:border-none dark:border-white/5 p-6 flex flex-col justify-between
            lg:relative lg:translate-x-0 transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
          <div>
              <div className="flex items-center gap-3 mb-10 px-2">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                      U
                  </div>
                  <div>
                      <h1 className="font-bold text-lg leading-none">UnivAdmin</h1>
                      <p className="text-xs text-textSecLight dark:text-textSecDark mt-1 font-medium">ERP v2.0</p>
                  </div>
              </div>

              <nav className="space-y-1">
                  {TABS.map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                          <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as TabType); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                                isActive 
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold' 
                                : 'text-textSecLight dark:text-textSecDark hover:bg-white dark:hover:bg-white/5 hover:text-textMainLight dark:hover:text-textMainDark'
                            }`}
                          >
                              <Icon size={20} className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary dark:group-hover:text-white transition-colors'}`} />
                              <span className="relative z-10">{tab.label}</span>
                              {isActive && <ChevronRight size={16} className="ml-auto opacity-50 relative z-10" />}
                          </button>
                      )
                  })}
              </nav>
          </div>

          <div className="space-y-2 pt-6 border-t border-gray-200 dark:border-white/5">
                <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-textSecLight dark:text-textSecDark hover:bg-white dark:hover:bg-white/5 transition-colors">
                    <Settings size={20} />
                    <span>Paramètres</span>
                </button>
          </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto scroll-smooth">
          <div className="p-4 lg:p-10 max-w-[1600px] mx-auto pb-24">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'departments' && renderDepartments()}
              {activeTab === 'programs' && renderPrograms()}
              {activeTab === 'teachers' && renderTeachers()}
              {activeTab === 'students' && renderStudents()}
              {activeTab === 'courses' && renderCourses()}
              {activeTab === 'finance' && renderFinance()}
          </div>
      </main>

      {/* --- MODALS --- */}
      
      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setIsSettingsOpen(false)}
             >
                 <motion.div 
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-surfaceDark w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative"
                 >
                     <h2 className="text-xl font-bold mb-6 text-textMainLight dark:text-textMainDark">Paramètres</h2>
                     <div className="space-y-4">
                        <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                                </div>
                                <span className="font-medium text-textMainLight dark:text-textMainDark">Thème {theme === 'dark' ? 'Sombre' : 'Clair'}</span>
                            </div>
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                    <Globe size={16} />
                                </div>
                                <span className="font-medium text-textMainLight dark:text-textMainDark">Langue: {language === 'fr' ? 'Français' : 'English'}</span>
                            </div>
                        </button>

                        <div className="h-px bg-gray-100 dark:bg-white/5 my-2" />

                        <button onClick={onLogout} className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                                    <LogOut size={16} />
                                </div>
                                <span className="font-medium text-red-600 group-hover:text-red-700">Déconnexion</span>
                            </div>
                        </button>
                     </div>
                 </motion.div>
             </motion.div>
        )}
      </AnimatePresence>

      {/* CRUD Modal */}
      <AnimatePresence>
        {modalType && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-surfaceDark w-full max-w-lg rounded-[32px] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                >
                    <button onClick={handleCloseModal} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <X size={24} />
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6 text-textMainLight dark:text-textMainDark">
                        {modalType === 'departments' && 'Nouveau Département'}
                        {modalType === 'programs' && 'Nouvelle Filière'}
                        {modalType === 'teachers' && 'Nouvel Enseignant'}
                        {modalType === 'students' && 'Nouvel Étudiant'}
                        {modalType === 'courses' && 'Nouveau Cours'}
                        {modalType === 'finance' && 'Enregistrer Paiement'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Dynamic Fields based on Modal Type */}
                        
                        {modalType === 'departments' && (
                            <>
                                <Input label="Nom du département" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} placeholder="Ex: Sciences Juridiques" required />
                                <Input label="Description" value={deptForm.description} onChange={e => setDeptForm({...deptForm, description: e.target.value})} placeholder="Court descriptif..." />
                            </>
                        )}

                        {modalType === 'programs' && (
                            <>
                                <Input label="Nom de la filière" value={progForm.name} onChange={e => setProgForm({...progForm, name: e.target.value})} placeholder="Ex: Master Droit Public" required />
                                <div className="flex gap-4">
                                    <Input label="Durée (années)" type="number" value={progForm.durationYears} onChange={e => setProgForm({...progForm, durationYears: parseInt(e.target.value)})} />
                                    <Input label="Coût annuel (€)" type="number" value={progForm.tuitionFee} onChange={e => setProgForm({...progForm, tuitionFee: parseInt(e.target.value)})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Département</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={progForm.departmentId}
                                        onChange={e => setProgForm({...progForm, departmentId: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {modalType === 'teachers' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Prénom" value={teachForm.firstName} onChange={e => setTeachForm({...teachForm, firstName: e.target.value})} required />
                                    <Input label="Nom" value={teachForm.lastName} onChange={e => setTeachForm({...teachForm, lastName: e.target.value})} required />
                                </div>
                                <Input label="Email" type="email" value={teachForm.email} onChange={e => setTeachForm({...teachForm, email: e.target.value})} required />
                                <Input label="Spécialité" value={teachForm.specialty} onChange={e => setTeachForm({...teachForm, specialty: e.target.value})} />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Département</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={teachForm.departmentId}
                                        onChange={e => setTeachForm({...teachForm, departmentId: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {modalType === 'students' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Prénom" value={studForm.firstName} onChange={e => setStudForm({...studForm, firstName: e.target.value})} required />
                                    <Input label="Nom" value={studForm.lastName} onChange={e => setStudForm({...studForm, lastName: e.target.value})} required />
                                </div>
                                <Input label="Email" type="email" value={studForm.email} onChange={e => setStudForm({...studForm, email: e.target.value})} required />
                                <Input label="Matricule" value={studForm.matricule} onChange={e => setStudForm({...studForm, matricule: e.target.value})} placeholder="Ex: 2025-XXX-000" required />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Département</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={studForm.departmentId}
                                        onChange={e => setStudForm({...studForm, departmentId: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Filière</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={studForm.programId}
                                        onChange={e => setStudForm({...studForm, programId: e.target.value})}
                                        disabled={!studForm.departmentId}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {programs.filter(p => p.departmentId === studForm.departmentId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {modalType === 'courses' && (
                             <>
                                <Input label="Intitulé du cours" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Code" value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value})} placeholder="Ex: INFO101" required />
                                    <Input label="Crédits" type="number" value={courseForm.credits} onChange={e => setCourseForm({...courseForm, credits: parseInt(e.target.value)})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Filière (Programme)</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={courseForm.programId}
                                        onChange={e => setCourseForm({...courseForm, programId: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Enseignant</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={courseForm.teacherId}
                                        onChange={e => setCourseForm({...courseForm, teacherId: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                                    </select>
                                </div>
                             </>
                        )}

                        {modalType === 'finance' && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Étudiant</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={payForm.studentId}
                                        onChange={e => setPayForm({...payForm, studentId: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.matricule})</option>)}
                                    </select>
                                </div>
                                <Input label="Montant (€)" type="number" value={payForm.amount} onChange={e => setPayForm({...payForm, amount: parseInt(e.target.value)})} required />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type</label>
                                    <select 
                                        className="w-full h-[52px] bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border border-transparent focus:border-primary outline-none"
                                        value={payForm.type}
                                        onChange={e => setPayForm({...payForm, type: e.target.value as any})}
                                    >
                                        <option value="TUITION">Frais de scolarité</option>
                                        <option value="REGISTRATION">Inscription</option>
                                        <option value="LIBRARY">Bibliothèque</option>
                                        <option value="OTHER">Autre</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="pt-4">
                            <Button type="submit" fullWidth className="!rounded-xl shadow-xl shadow-primary/20">
                                {modalType === 'departments' && 'Ajouter le département'}
                                {modalType === 'programs' && 'Créer la filière'}
                                {modalType === 'teachers' && 'Ajouter l\'enseignant'}
                                {modalType === 'students' && 'Inscrire l\'étudiant'}
                                {modalType === 'courses' && 'Créer le cours'}
                                {modalType === 'finance' && 'Enregistrer le paiement'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardScreen;
