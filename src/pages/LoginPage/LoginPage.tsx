import { LoginForm } from "../../components/LoginForm/LoginForm";
import React from "react";

const centerDiv: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
};

const loginContainer: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: 10,
  padding: 20,
  boxShadow: "0 0 10px #ccc",
};

const loginTitle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 20,
  fontSize: 24,
}

export const LoginPage = () => {
  return (
    <div style={centerDiv}>
      <div style={loginContainer}>
        <div style={loginTitle}>LOGIN</div>
        <LoginForm />
      </div>
    </div>
  );
};
