import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

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
const ThreeDView = lazy(() => import("./pages/ThreeDView"));
import DesignMethod from "./pages/DesignMethod";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
<Route path="/3d-view" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#dfe4dc] text-sm text-[#315348]">Building 3D model...</div>}><ThreeDView /></Suspense>} />
<Route path="/design-method" element={<DesignMethod />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/ai-planner" element={<AIPlanner />} />
        <Route path="/floor-plan-editor" element={<FloorPlanEditor />} />
        <Route path="/my-designs" element={<MyDesigns />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;