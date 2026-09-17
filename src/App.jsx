import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { LMSProvider } from './context/LMSContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Dashboard from './pages/dashboard/Dashboard';
import Courses from './pages/courses/Courses';
import CourseDetails from './pages/courses/CourseDetails';
import Students from './pages/students/Students';
import Instructors from './pages/instructors/Instructors';
import InstructorProfile from './pages/instructors/InstructorProfile';
import Enrollments from './pages/enrollments/Enrollments';
import LearningProgress from './pages/progress/LearningProgress';
import Assignments from './pages/assignments/Assignments';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LMSProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/students" element={<Students />} />
                <Route path="/instructors" element={<Instructors />} />
                <Route path="/instructors/:id" element={<InstructorProfile />} />
                <Route path="/enrollments" element={<Enrollments />} />
                <Route path="/progress" element={<LearningProgress />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Default Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </LMSProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
