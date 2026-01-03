// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analyze from "./pages/Analyze";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./auth/ProtectedRoute";

const App = () => (
  <Routes>
    {/* Default route → login */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
    {/* This route handles Google OAuth callback */}
    <Route path="/auth-success" element={<AuthSuccess />} />

    <Route
      path="/analyze"
      element={
        <ProtectedRoute>
          <Analyze />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;