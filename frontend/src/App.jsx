
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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

import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import Users from "./pages/Users";
import AIUsage from "./pages/AIUsage";
import Reports from "./pages/Reports";
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/ai-planner" element={<AIPlanner />} />
        <Route path="/floor-plan-editor" element={<FloorPlanEditor />} />
        <Route path="/my-designs" element={<MyDesigns />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/3d-view" element={<ThreeDView />} />
        <Route path="/design-method" element={<DesignMethod />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/ai-usage" element={<AIUsage />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
