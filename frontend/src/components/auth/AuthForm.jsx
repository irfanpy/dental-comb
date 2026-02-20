import React from "react";

const AuthForm = ({ authMode, setAuthMode, auth, setAuth, onSubmit, error }) => {
  return (
    <div className="auth-layout">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>{authMode === "login" ? "Login" : "Register"}</h2>
        <label>
          Email
          <input
            type="email"
            value={auth.email}
            onChange={(event) =>
              setAuth((prev) => ({ ...prev, email: event.target.value }))
            }
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={auth.password}
            onChange={(event) =>
              setAuth((prev) => ({ ...prev, password: event.target.value }))
            }
            required
          />
        </label>
        <button type="submit" className="primary">
          {authMode === "login" ? "Login" : "Create Account"}
        </button>
        <button
          type="button"
          className="link"
          onClick={() =>
            setAuthMode((prev) => (prev === "login" ? "register" : "login"))
          }
        >
          {authMode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AuthForm;