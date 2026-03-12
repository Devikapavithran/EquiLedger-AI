import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { LayoutDashboard, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-primary p-2 rounded-lg text-white">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">EquiLedger AI</h1>
      </div>

      <div className="bg-card p-8 rounded-2xl shadow-xl w-full max-w-md border border-border">
        {!submitted ? (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Forgot password?</h2>
              <p className="text-slate-500 mt-2">No worries, we'll send you reset instructions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-[#DB2777] text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-100 flex justify-center items-center disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Check your email</h2>
            <p className="text-slate-500 mt-2 mb-8">
              We've sent password reset instructions to <span className="font-semibold">{email}</span>
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-primary font-bold hover:text-[#DB2777]"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-border text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
