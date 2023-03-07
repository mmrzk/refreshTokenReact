import React, { useCallback, useContext } from "react";
import { AuthContext } from "../contexts/auth";

function Login() {
  const { signIn } = useContext(AuthContext);

  const sendCrap = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const value = Object.fromEntries(formData.entries());

    await signIn(value);
  });

  return (
    <div
      className="vh-100 d-flex justify-content-center"
      style={{ marginTop: "10%" }}
    >
      <form onSubmit={sendCrap} className="vw-50%">
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            name="email"
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
