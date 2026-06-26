import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './style.css';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <div className="register-page">
      <motion.div
        className="register-form"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2>Register</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {(validationError || error) && (
            <p className="error">{validationError || error}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
