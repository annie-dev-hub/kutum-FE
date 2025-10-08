import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminDashboardPage from './pages/AdminDashboardPage'
import UserDashboardPage from './pages/UserDashboardPage'
import DashboardEntry from './pages/DashboardEntry'
import UserProfilePage from './pages/UserProfilePage'
import BloodGroupsPage from './pages/BloodGroupsPage'
import ClothingSizesPage from './pages/ClothingSizesPage'
import DocumentTypesPage from './pages/DocumentTypesPage'
import RelationTypesPage from './pages/RelationTypesPage'
import TopNav from './components/layout/TopNav'
import PeoplePage from './pages/PeoplePage'
import DocumentsPage from './pages/DocumentsPage'
import VehiclesPage from './pages/VehiclesPage'
import HealthPage from './pages/HealthPage'
// Dev pages removed

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Test routes removed for production */}
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardEntry />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/blood-groups" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="admin" />
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                  <BloodGroupsPage />
                </main>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/clothing-sizes" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="admin" />
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                  <ClothingSizesPage />
                </main>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/document-types" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="admin" />
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                  <DocumentTypesPage />
                </main>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/relation-types" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="admin" />
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                  <RelationTypesPage />
                </main>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="admin" />
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                  <UserProfilePage />
                </main>
              </div>
            </ProtectedRoute>
          } 
        />

        {/* User pages */}
        <Route
          path="/people"
          element={
            <ProtectedRoute>
              <PeoplePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="user" />
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                  <VehiclesPage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/health"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="user" />
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                  <HealthPage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

