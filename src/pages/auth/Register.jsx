import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    const res = await registerUser(data.name, data.email, data.password);
    if (res.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      {/* LEFT SIDE: Full-Screen Image Hero (Hidden on mobile, 50% on lg) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          alt="Learning Platform"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-emerald-950/30"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between w-full h-full text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-[#10B981] p-2.5 rounded-2xl text-white shadow-lg">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">EduLearn</h1>
          </div>

          {/* Slogan */}
          <div className="my-auto max-w-md space-y-4">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Start Your Learning Journey
            </h2>
            <p className="text-slate-200 text-sm">
              Create an account to gain access to interactive online courses and analytics.
            </p>
          </div>

          <div className="text-xs text-slate-300">
            © 2026 EduLearn Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white min-h-screen overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-4">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="bg-[#10B981] p-2 rounded-xl text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">EduLearn</span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-500 mt-1">Fill in your details below to register</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  {...register('name', { required: 'Full name is required' })}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-hidden transition-all ${
                    errors.name
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-hidden transition-all ${
                    errors.email
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-hidden transition-all ${
                    errors.password
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === passwordVal || 'Passwords do not match'
                  })}
                  className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-hidden transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#10B981] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          EduLearn LMS © 2026
        </div>
      </div>
    </div>
  );
};

export default Register;
