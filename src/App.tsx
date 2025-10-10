/**
 * ========================================
 * KUTUM FAMILY MANAGEMENT APP
 * ========================================
 * 
 * Main application component that sets up routing and authentication
 * 
 * Features:
 * - AI-powered chatbot for family data queries
 * - Automatic document expiry scanning
 * - Family member management
 * - Document management
 * - Vehicle tracking
 * - Health records
 * - Smart reminders
 * 
 * Technology Stack:
 * - React + TypeScript
 * - React Router for navigation
 * - FastAPI backend with OpenAI integration
 * - RAG (Retrieval Augmented Generation) for intelligent responses
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

// ========== AUTH PAGES ==========
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

// ========== ADMIN PAGES ==========
// Note: AdminDashboardPage imported through DashboardEntry
import UserProfilePage from './pages/admin/UserProfilePage'
import BloodGroupsPage from './pages/admin/BloodGroupsPage'
import ClothingSizesPage from './pages/admin/ClothingSizesPage'
import DocumentTypesPage from './pages/admin/DocumentTypesPage'
import RelationTypesPage from './pages/admin/RelationTypesPage'
import AdminTrendsDashboard from './components/admin/AdminTrendsDashboard'

// ========== USER PAGES ==========
// Note: UserDashboardPage imported through DashboardEntry
import DashboardEntry from './pages/DashboardEntry'
import PeoplePage from './pages/user/PeoplePage'
import DocumentsPage from './pages/user/DocumentsPage' // Includes AI document scanner
import VehiclesPage from './pages/user/VehiclesPage'
import HealthPage from './pages/user/HealthPage'

// ========== LAYOUT COMPONENTS ==========
import TopNav from './components/layout/TopNav'

/**
 * Main App Component
 * Configures all routes and wraps app with authentication context
 */
function App() {
  return (
    // Wrap entire app with authentication provider for global user state
    <AuthProvider>
      {/* Toast notifications for user feedback */}
      <Toaster position="top-right" />
      
      {/* Define all application routes */}
      <Routes>
        {/* ========== PUBLIC ROUTES (No authentication required) ========== */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* ========== PROTECTED ROUTES (Authentication required) ========== */}
        
        {/* Main Dashboard - Shows admin or user dashboard based on role */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardEntry /> {/* Redirects to admin/user dashboard based on user role */}
            </ProtectedRoute>
          } 
        />
        
        {/* ========== ADMIN CONFIGURATION PAGES ========== */}
        
        {/* Blood Groups Management - Admin can configure available blood group options */}
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
        
        <Route 
          path="/admin-trends" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <TopNav role="admin" />
                <main>
                  <AdminTrendsDashboard />
                </main>
              </div>
            </ProtectedRoute>
          } 
        />

        {/* ========== USER FEATURE PAGES ========== */}
        
        {/* Family Members Page - Manage family member profiles and information */}
        <Route
          path="/people"
          element={
            <ProtectedRoute>
              <PeoplePage /> {/* Includes chatbot for family queries */}
            </ProtectedRoute>
          }
        />
        
        {/* Documents Page - Upload and manage family documents with AI expiry scanning */}
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage /> {/* Includes AI document scanner for automatic expiry date extraction */}
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

        {/* ========== FALLBACK ROUTE ========== */}
        {/* Redirect any unknown routes to login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

