import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

const Navbar = () => {
  const { authState, signOut } = useContext(AuthContext);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-body-tertiary nav-dark bg-dark"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <ul className="navbar-nav flex-row" style={{ gap: "15px" }}>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/dashboard">
              Стільниця
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/notes1">
              Notes 1
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/notes2">
              Notes 2
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/notes3">
              Notes 3
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav flex-row">
          <li className="nav-item">
            {authState ? (
              <button className="btn text-white" onClick={signOut}>
                Вихід
              </button>
            ) : (
              <Link className="nav-link text-white" to="/login">
                Вхід
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
