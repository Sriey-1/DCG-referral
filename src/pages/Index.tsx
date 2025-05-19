
import { Navigate } from "react-router-dom";

const Index = () => {
  // Set authentication data in local storage
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("user", JSON.stringify({ name: "Demo User", email: "demo@example.com" }));
  localStorage.setItem("token", "dummy-token");
  
  // Always redirect to dashboard
  return <Navigate to="/dashboard" />;
};

export default Index;
