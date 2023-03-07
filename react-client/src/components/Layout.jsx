import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AuthContext } from "../contexts/auth";
import Navbar from "./Navbar";

const Layout = () => {
  const { authState, lastToken } = useContext(AuthContext);
  const [expiresIn, setExpiresIn] = useState(Number.POSITIVE_INFINITY);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;
    console.log(`token exp changed`);
    if (lastToken) {
      const { exp } = jwtDecode(lastToken);
      intervalId = setInterval(() => {
        const diff = exp - Date.now() / 1000;
        setExpiresIn(Math.round(diff));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [lastToken]);

  useEffect(() => {
    if (authState === false) {
      navigate("/login");
    } else if (authState === true) {
      navigate("/dashboard");
    }
  }, [authState]);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className="container">
        <Outlet />
        <h3>токен цей во через: {expiresIn}</h3>
      </div>
    </>
  );
};

export default Layout;
