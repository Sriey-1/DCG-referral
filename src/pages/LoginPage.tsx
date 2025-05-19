
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  // Auto-authenticate the user by setting these values
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("user", JSON.stringify({ name: "Demo User", email: "demo@example.com" }));
  localStorage.setItem("token", "dummy-token");
  
  // Redirect straight to dashboard
  return <Navigate to="/dashboard" />;
};

export default LoginPage;
