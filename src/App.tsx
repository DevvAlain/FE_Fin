import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";

function App() {
  // Simple client-side path handling so token links work (Netlify serves index.html)
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  // Match /reset-password/:token
  const resetMatch = path.match(/^\/reset-password\/(.+)$/);
  if (resetMatch) {
    const token = decodeURIComponent(resetMatch[1]);
    return <AuthPage type="reset-password" token={token} />;
  }

  // Match /verify-email/:token
  const verifyMatch = path.match(/^\/verify-email\/(.+)$/);
  if (verifyMatch) {
    const token = decodeURIComponent(verifyMatch[1]);
    // returnUrl can be provided as search param, parse it
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const returnUrl = params.get("returnUrl") || undefined;
    return <AuthPage type="verify-email" token={token} returnUrl={returnUrl} />;
  }

  // Default: render landing page
  // If path is /login, render login page
  if (path === "/admin") return <AdminPage />;
  if (path === "/login") return <LoginPage />;

  return <LandingPage />;
}

export default App;
