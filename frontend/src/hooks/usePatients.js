import { useState, useEffect } from "react";
import { api } from "../api";

export const usePatients = (isAuthed) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [error, setError] = useState("");

  const loadPatients = async (page = pagination.page) => {
    try {
      const data = await api.listPatients(page, pagination.limit);
      setPatients(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAuthed) {
      loadPatients(1);
    }
  }, [isAuthed]);

  const handlePatientSave = async (payload) => {
    setError("");
    try {
      if (selectedPatient) {
        await api.updatePatient(selectedPatient.id, payload);
      } else {
        await api.createPatient(payload);
      }
      setSelectedPatient(null);
      await loadPatients(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.deletePatient(id);
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }
      await loadPatients(1);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    patients,
    selectedPatient,
    setSelectedPatient,
    pagination,
    loadPatients,
    handlePatientSave,
    handleDelete,
    error,
    setError,
  };
};