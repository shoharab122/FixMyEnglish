import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Vocabulary } from './pages/Vocabulary';
import { Grammar } from './pages/Grammar';
import { Curriculum } from './pages/Curriculum';
import { Exams } from './pages/Exams';
import { Speaking } from './pages/Speaking';
import { Progress } from './pages/Progress';
import { Community } from './pages/Community';
import { LiveRooms } from './pages/LiveRooms';
import { Pricing } from './pages/Pricing';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';

function App() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* /login is always reachable. If you're already signed in,
          the Login page shows a "log out first" banner. */}
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/grammar" element={<Grammar />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/speaking" element={<Speaking />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/community" element={<Community />} />
              <Route path="/live-rooms" element={<LiveRooms />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;