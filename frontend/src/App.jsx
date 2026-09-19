import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

import { Overview } from './pages/Overview';
import { Vocabulary } from './pages/Vocabulary';
import { Grammar } from './pages/Grammar';
import { Curriculum } from './pages/Curriculum';
import { Exams } from './pages/Exams';
import { ExamTake } from './pages/ExamTake';
import { Speaking } from './pages/Speaking';
import { Progress } from './pages/Progress';
import { Community } from './pages/Community';
import { LiveRooms } from './pages/LiveRooms';
import { Pricing } from './pages/Pricing';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';

import AdminLayout from './admin/AdminLayout';
import RequireAdmin from './admin/RequireAdmin';
import { Dashboard } from './admin/Dashboard';
import { Users } from './admin/Users';
import { Exams as AdminExams } from './admin/Exams';
import { ExamPapers } from './admin/ExamPapers';
import { Community as AdminCommunity } from './admin/Community';
import { LiveRooms as AdminLiveRooms } from './admin/LiveRooms';
import { Products } from './admin/Products';
import { Coupons } from './admin/Coupons';
import { Purchases } from './admin/Purchases';
import { Announcements } from './admin/Announcements';
import { FeatureFlags } from './admin/FeatureFlags';
import { AuditLog } from './admin/AuditLog';

function App() {
  const { loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="papers" element={<ExamPapers />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="live-rooms" element={<AdminLiveRooms />} />
        <Route path="products" element={<Products />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="feature-flags" element={<FeatureFlags />} />
        <Route path="audit-log" element={<AuditLog />} />
      </Route>

      {/* Learner */}
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
            <Route path="/exams/take/:paperId" element={<ExamTake />} />
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