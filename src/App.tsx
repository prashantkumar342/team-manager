import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './lib/firebase';

import Auth from './pages/Auth';
import StartWithTeam from './pages/StartWithTeam';
import { useTeamStore } from './store/useTeams.store';
import ConfirmModal from './components/ConfirmModal';
import { useGetTeam } from './api/hook/useTeam';
import { Spinner } from './components/ui/spinner';
import AppSidebar from './components/Sidebar';
import Home from './pages/Home';
import TeamDashboard from './pages/TeamDashboard';
import HomeLayout from './layouts/HomeLayout';
import TeamChat from './pages/TeamChat';
import TeamDashboardLayout from './layouts/TeamDashboardLayout';
import ProjectTasks from './pages/ProjectTasks';
import PageNotFound from './pages/PageNotFound';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; description?: string }>({
    title: '',
    description: '',
  });
  const { getTeams } = useGetTeam();
  const addTeams = useTeamStore((s) => s.addTeams);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser && firebaseUser.emailVerified ? firebaseUser : null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const handleFetchTeams = async () => {
      try {
        setTeamsLoading(true);

        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          setModalContent({
            title: 'Session Expired',
            description: 'Please log in again to continue.',
          });
          setConfirmModal(true);
          return;
        }

        const res = await getTeams(0, 10, token);
        if (res.status === 200 && res.data.success) {
          addTeams(res.data.data.teams);
        }
      } finally {
        setTeamsLoading(false);
      }
    };

    handleFetchTeams();
  }, [user, addTeams, getTeams]);

  if (loading || teamsLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {user && <AppSidebar />}
      <div className="w-full bg-background ">
        {/*<Navbar />*/}
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" replace /> : <Auth />} />

          <Route path="/home" element={user ? <HomeLayout /> : <Navigate to="/" replace />}>
            <Route index element={<Home />} />
            <Route path="team/:id" element={<TeamDashboardLayout />}>
              <Route index element={<TeamDashboard />} />
              <Route path="project/:projectId" element={<ProjectTasks />} />
              <Route path="chat" element={<TeamChat />} />
            </Route>
          </Route>

          <Route path="/start-with-team" element={user ? <StartWithTeam /> : <Navigate to="/" replace />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <ConfirmModal
          open={confirmModal}
          onOpenChange={setConfirmModal}
          title={modalContent.title}
          description={modalContent.description}
          confirmText="Okay"
          showCancel={false}
          onConfirm={() => setConfirmModal(false)}
        />
      </div>
    </>
  );
}

export default App;
