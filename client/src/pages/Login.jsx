import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import './Login.css';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setLoginError('');
    try {
      await login(data.email, data.password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      setLoginError(err.message || 'Failed to login');
      toast.error(err.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">NYC DSA Arena</h1>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              icon={<Mail size={20} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="password-input-wrapper">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                icon={<Lock size={20} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {loginError && <div className="auth-error-message">{loginError}</div>}

            <Button
              type="submit"
              className="auth-submit-btn"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entering Arena...' : 'Enter the Arena'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Join the Arena
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
