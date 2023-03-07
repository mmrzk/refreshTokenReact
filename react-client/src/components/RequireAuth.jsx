import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

export function RequireAuth({ children }) {
  const auth = useContext(AuthContext);
  switch (auth.authState) {
    case false:
      return <Navigate to="/login" />;
    case true:
      return children;
    default:
      return null;
  }
}
