
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import GradesScreen from './screens/GradesScreen';
import CalendarScreen from './screens/CalendarScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import StudentCardScreen from './screens/StudentCardScreen';
import AbsencesScreen from './screens/AbsencesScreen';
import AlertsScreen from './screens/AlertsScreen';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
  const { user } = useApp();
  const [currentTab, setCurrentTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGradesOpen, setIsGradesOpen] = useState(false);
  const [isStudentCardOpen, setIsStudentCardOpen] = useState(false);
  const [isAbsencesOpen, setIsAbsencesOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
            <HomeScreen 
                onOpenChat={() => setIsChatOpen(true)} 
                onOpenSettings={() => setIsSettingsOpen(true)} 
                onOpenGrades={() => setIsGradesOpen(true)}
                onOpenCalendar={() => setCurrentTab('calendar')}
                onOpenAnnouncements={() => setCurrentTab('announcements')}
                onOpenStudentCard={() => setIsStudentCardOpen(true)}
                onOpenAbsences={() => setIsAbsencesOpen(true)}
                onOpenAlerts={() => setIsAlertsOpen(true)}
            />
        );
      case 'calendar':
        return <CalendarScreen />;
      case 'announcements':
         return <AnnouncementsScreen />;
      default:
        return (
            <HomeScreen 
                onOpenChat={() => setIsChatOpen(true)} 
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenGrades={() => setIsGradesOpen(true)}
                onOpenCalendar={() => setCurrentTab('calendar')}
                onOpenAnnouncements={() => setCurrentTab('announcements')}
                onOpenStudentCard={() => setIsStudentCardOpen(true)}
                onOpenAbsences={() => setIsAbsencesOpen(true)}
                onOpenAlerts={() => setIsAlertsOpen(true)}
            />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark transition-colors duration-300">
      
      {/* Main Content Area */}
      <main className={`min-h-screen ${!isSettingsOpen ? 'pb-24' : ''}`}>
         <AnimatePresence mode="wait">
             <motion.div
                key={currentTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="min-h-screen"
             >
                {renderContent()}
             </motion.div>
         </AnimatePresence>
      </main>

      {/* Navigation - Hidden when Settings is open */}
      {!isSettingsOpen && (
        <BottomNav 
            currentTab={currentTab} 
            onTabChange={setCurrentTab} 
        />
      )}

      {/* Modals/Drawers */}
      <AnimatePresence>
        {isChatOpen && <ChatScreen key="chat" onClose={() => setIsChatOpen(false)} />}
        {isSettingsOpen && <SettingsScreen key="settings" onBack={() => setIsSettingsOpen(false)} />}
        {isGradesOpen && <GradesScreen key="grades" onBack={() => setIsGradesOpen(false)} />}
        {isStudentCardOpen && <StudentCardScreen key="card" onClose={() => setIsStudentCardOpen(false)} />}
        {isAbsencesOpen && <AbsencesScreen key="absences" onBack={() => setIsAbsencesOpen(false)} />}
        {isAlertsOpen && <AlertsScreen key="alerts" onBack={() => setIsAlertsOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;