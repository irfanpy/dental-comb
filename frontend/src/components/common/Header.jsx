import React from "react";

const Header = ({ onLogout }) => {
  return (
    <header className="header">
      <div>
        <h1>Dental Assistant Dashboard</h1>
        <p className="muted">
          AI-powered patient assistance for your clinic.
        </p>
      </div>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;