import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/Auth.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (email, password, name) => {
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </div>
  );
};

export default Register;
