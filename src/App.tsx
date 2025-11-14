import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./pages/AdminPage";

// Wrapper components to extract params
function VerifyEmailWrapper() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || undefined;
  return <AuthPage type="verify-email" token={token || ""} returnUrl={returnUrl} />;
}

function ResetPasswordWrapper() {
  const { token } = useParams<{ token: string }>();
  return <AuthPage type="reset-password" token={token || ""} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordWrapper />} />
        <Route path="/verify-email/:token" element={<VerifyEmailWrapper />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
