import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    setResetEmail(data.email);
    setSubmitted(true);
    toast.success(`Password reset link sent to ${data.email}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-[#10B981] p-2.5 rounded-2xl text-white shadow-md shadow-emerald-600/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">EduLearn</span>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Check Your Email</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We have sent a password reset link to{' '}
              <span className="font-semibold text-slate-800">{resetEmail}</span>.
            </p>
            <p className="text-xs text-slate-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#10B981] text-white font-semibold text-sm rounded-xl hover:bg-[#059669] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all ${
                      errors.email
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-200"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#10B981] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
