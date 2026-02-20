import React from "react";

const PatientList = ({ patients, selectedId, onSelect, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Patients</h3>
      </div>
      <ul className="list">
        {patients.map((patient) => (
          <li
            key={patient.id}
            className={selectedId === patient.id ? "list-item active" : "list-item"}
          >
            <button
              type="button"
              className="link"
              onClick={() => onSelect(patient)}
            >
              <div className="list-title">{patient.name}</div>
              <div className="list-subtitle">{patient.email || "No email"}</div>
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => onDelete(patient.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
