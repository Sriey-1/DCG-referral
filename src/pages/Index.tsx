
import { Navigate } from "react-router-dom";

const Index = () => {
  // Always redirect to dashboard
  return <Navigate to="/dashboard" />;
};

export default Index;
