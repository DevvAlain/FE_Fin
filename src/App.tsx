import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/reset-password/:token" element={<AuthPage type="reset-password" token="" />} />
        <Route path="/verify-email/:token" element={<AuthPage type="verify-email" token="" />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
