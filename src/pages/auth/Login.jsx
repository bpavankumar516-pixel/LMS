import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'alex@edulearn.com',
      password: 'admin123',
      remember: true
    }
  });

  const fillDemoCredentials = () => {
    setValue('email', 'alex@edulearn.com');
    setValue('password', 'admin123');
    toast.info('Loaded demo credentials');
  };

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password, data.remember);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      {/* LEFT SIDE: Full-Screen Image Hero (Hidden on mobile, 50% on lg) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop"
          alt="Learning System"
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
              Master New Skills with EduLearn
            </h2>
            <p className="text-slate-200 text-sm">
              Your complete online learning and education management platform.
            </p>
          </div>

          <div className="text-xs text-slate-300">
            © 2026 EduLearn Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white min-h-screen overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-4">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="bg-[#10B981] p-2 rounded-xl text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">EduLearn</span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials to access your dashboard</p>
          </div>

          {/* Demo Credentials Card */}
          <div
            onClick={fillDemoCredentials}
            className="mb-6 p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
              <span>
                Demo: <strong className="font-semibold">alex@edulearn.com</strong> / <strong className="font-semibold">admin123</strong>
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter email"
                  {...register('email', { required: 'Email address is required' })}
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#10B981] hover:underline">
                  Forgot Password?
                </Link>
              </div>
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  {...register('remember')}
                  className="w-4 h-4 text-[#10B981] border-slate-300 rounded-md focus:ring-[#10B981]"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Signup Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#10B981] font-bold hover:underline">
                Register
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

export default Login;
