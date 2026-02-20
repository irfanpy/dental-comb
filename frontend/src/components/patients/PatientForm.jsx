import React, { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  medicalNotes: "",
};

const PatientForm = ({ selected, onSave, onCancel }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        phone: selected.phone || "",
        dob: selected.dob ? selected.dob.slice(0, 10) : "",
        medicalNotes: selected.medicalNotes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      return;
    }
    onSave(form);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>{selected ? "Edit Patient" : "New Patient"}</h3>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Date of Birth
          <input name="dob" type="date" value={form.dob} onChange={handleChange} />
        </label>
        <label>
          Medical Notes
          <textarea
            name="medicalNotes"
            value={form.medicalNotes}
            onChange={handleChange}
            rows={3}
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="primary">
            {selected ? "Update" : "Create"}
          </button>
          {selected && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
