import React from "react";
import { api } from "./api";
import PatientList from "./components/patients/PatientList.jsx";
import PatientForm from "./components/patients/PatientForm.jsx";
import ChatPanel from "./components/chat/ChatPanel.jsx";
import AuthForm from "./components/auth/AuthForm.jsx";
import Header from "./components/common/Header.jsx";
import Pagination from "./components/common/Pagination.jsx";
import ErrorAlert from "./components/common/ErrorAlert.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { usePatients } from "./hooks/usePatients.js";
import { useChat } from "./hooks/useChat.js";

const App = () => {
  const {
    isAuthed,
    authMode,
    setAuthMode,
    auth,
    setAuth,
    error: authError,
    setError: setAuthError,
    clearError,
    login,
    logout,
  } = useAuth();

  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    pagination,
    loadPatients,
    handlePatientSave,
    handleDelete,
    error: patientsError,
    setError: setPatientsError,
  } = usePatients(isAuthed);

  const {
    chatMessages,
    loadingChat,
    handleSend,
    error: chatError,
    setError: setChatError,
  } = useChat(selectedPatient);

  const error = authError || patientsError || chatError;

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    clearError();
    try {
      const data =
        authMode === "login"
          ? await api.login(auth)
          : await api.register(auth);
      login(data.token);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setSelectedPatient(null);
    setPatientsError("");
    setChatError("");
  };

  if (!isAuthed) {
    return (
      <AuthForm
        authMode={authMode}
        setAuthMode={setAuthMode}
        auth={auth}
        setAuth={setAuth}
        onSubmit={handleAuthSubmit}
        error={error}
      />
    );
  }

  return (
    <div className="app">
      <Header onLogout={handleLogout} />
      <ErrorAlert error={error} />
      <div className="grid">
        <div className="column">
          <PatientList
            patients={patients}
            selectedId={selectedPatient?.id}
            onSelect={(patient) => setSelectedPatient(patient)}
            onDelete={handleDelete}
          />
          <Pagination
            pagination={pagination}
            onPageChange={loadPatients}
          />
        </div>
        <div className="column">
          <PatientForm
            selected={selectedPatient}
            onSave={handlePatientSave}
            onCancel={() => setSelectedPatient(null)}
          />
          <ChatPanel
            patient={selectedPatient}
            messages={chatMessages}
            onSend={handleSend}
            loading={loadingChat}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
