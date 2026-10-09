import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";

// User Pages
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import AIPlanner from "./pages/AIPlanner";
import FloorPlanEditor from "./pages/FloorPlanEditor";
import MyDesigns from "./pages/MyDesigns";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import ThreeDView from "./pages/ThreeDView";
import DesignMethod from "./pages/DesignMethod";
import FeaturesPage from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import Users from "./pages/Users";
import AIUsage from "./pages/AIUsage";
import Reports from "./pages/Reports";
import AdminSettings from "./pages/AdminSettings";
import ContactQueries from "./pages/ContactQueries";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Password Reset */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =========================
            PROTECTED USER ROUTES
            Login required
        ========================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/create-project"
            element={<CreateProject />}
          />

          <Route
            path="/ai-planner"
            element={<AIPlanner />}
          />

          <Route
            path="/floor-plan-editor"
            element={<FloorPlanEditor />}
          />

          <Route
            path="/my-designs"
            element={<MyDesigns />}
          />

          <Route
            path="/templates"
            element={<Templates />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/help"
            element={<Help />}
          />

          <Route
            path="/3d-view"
            element={<ThreeDView />}
          />

          <Route
            path="/design-method"
            element={<DesignMethod />}
          />

          <Route
            path="/features"
            element={<FeaturesPage />}
          />

          <Route
            path="/how-it-works"
            element={<HowItWorks />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />
        </Route>

        {/* =========================
            PROTECTED ADMIN ROUTES
            Admin login + admin role
        ========================== */}

        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />

          <Route
            path="/admin/projects"
            element={<AdminProjects />}
          />

          <Route
            path="/admin/queries"
            element={<ContactQueries />}
          />

          <Route
            path="/admin/ai-usage"
            element={<AIUsage />}
          />

          <Route
            path="/admin/reports"
            element={<Reports />}
          />

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;