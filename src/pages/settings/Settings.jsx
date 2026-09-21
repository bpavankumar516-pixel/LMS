import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Sliders,
  Check,
  Save,
  Lock,
  Mail,
  Phone,
  Globe,
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const getInitials = (name = '') => {
  if (!name) return 'AM';
  const parts = name.trim().split(' ').filter(Boolean);
  const cleanParts = parts.filter(
    (p) => !['dr.', 'dr', 'mr.', 'mr', 'mrs.', 'mrs', 'prof.', 'prof'].includes(p.toLowerCase())
  );
  const targetParts = cleanParts.length > 0 ? cleanParts : parts;
  if (targetParts.length === 1) {
    return targetParts[0].substring(0, 2).toUpperCase();
  }
  const first = targetParts[0]?.[0] || '';
  const last = targetParts[targetParts.length - 1]?.[0] || '';
  return (first + last).toUpperCase() || 'AM';
};

const Settings = () => {
  const { user, updateUserProfile } = useAuth();

  // Active Tab: 'profile' | 'security' | 'notifications' | 'system'
  const [activeTab, setActiveTab] = useState('profile');

  // Profile State
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [bioInput, setBioInput] = useState('');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification State
  const [notifEmailAnnouncements, setNotifEmailAnnouncements] = useState(true);
  const [notifAssignmentReminders, setNotifAssignmentReminders] = useState(true);
  const [notifQuizResults, setNotifQuizResults] = useState(true);
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(false);

  // System Preference State
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
  const [defaultView, setDefaultView] = useState('Grid View');

  // Sync state with current user
  useEffect(() => {
    if (user) {
      setNameInput(user.name || '');
      setEmailInput(user.email || '');
      setPhoneInput(user.phone || '+1 (555) 019-2834');
      setBioInput(
        user.bio ||
          (user.role === 'Student'
            ? 'Dedicated student pursuing Full Stack Web Development and Data Science certifications.'
            : 'Lead Educational Administrator overseeing course curricula and faculty management.')
      );
    }
  }, [user]);

  const userName = nameInput || user?.name || 'Alex Morgan';
  const userInitials = getInitials(userName);
  const isStudent = user?.role === 'Student';

  // Profile Submit Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) {
      toast.error('Name and Email fields are required.');
      return;
    }

    updateUserProfile({
      name: nameInput.trim(),
      email: emailInput.trim(),
      phone: phoneInput.trim(),
      bio: bioInput.trim()
    });

    toast.success('Profile details updated successfully!');
  };

  // Security Submit Handler
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and Confirmation password do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated successfully!');
  };

  // Notification Submit Handler
  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast.success('Notification preferences saved!');
  };

  // System Submit Handler
  const handleSaveSystem = (e) => {
    e.preventDefault();
    toast.success('System preferences updated!');
  };

  const [showResetModal, setShowResetModal] = useState(false);

  const handleConfirmResetData = () => {
    localStorage.clear();
    toast.info('Local storage cleared. Reloading page...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-[#0B2522] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            SETTINGS & PREFERENCES
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Account & System Settings</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage your personal profile details, authentication security, notification preferences, and platform defaults.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <User className="w-4 h-4" />
            Profile Settings
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security & Password
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'system'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            System Preferences
          </button>
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs h-fit space-y-6">
          <div className="text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0B2522] via-[#047857] to-[#10B981] text-white flex items-center justify-center font-black text-2xl tracking-wider ring-4 ring-[#10B981]/20 shadow-md mx-auto select-none">
              {userInitials}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{userName}</h3>
              <p className="text-xs text-slate-500 font-mono">{emailInput || user?.email}</p>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full mt-2 border border-emerald-200">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Account ID:</span>
              <span className="font-mono font-bold text-slate-800">#{user?.id || '101'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Member
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Member Since:</span>
              <span className="font-semibold text-slate-800">July 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-2">
          {/* TAB 1: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Update your name, contact email, and bio description.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Default Name-Based Avatar Card */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Default User Avatar</label>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0B2522] via-[#047857] to-[#10B981] text-white flex items-center justify-center font-black text-xl tracking-wider ring-4 ring-[#10B981]/20 shadow-md shrink-0 select-none">
                      {userInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Name-Based Initial Avatar ({userInitials})</h4>
                      <p className="text-[11px] text-slate-500">
                        Your avatar is generated dynamically from your full name ("{userName}").
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                    <input
                      type="text"
                      disabled
                      value={user?.role || 'Administrator'}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Biography / About Me</label>
                  <textarea
                    rows={3}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Security & Authentication</h3>
                <p className="text-xs text-slate-500">Change your password and configure account safety settings.</p>
              </div>

              <form onSubmit={handleSaveSecurity} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                </div>

                {/* 2FA Switch */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 mt-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                    <p className="text-[11px] text-slate-500">Add an extra layer of security using an authenticator app.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      twoFactorEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                        twoFactorEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Key className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: NOTIFICATION PREFERENCES */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Notification Channels</h3>
                <p className="text-xs text-slate-500">Choose when and how you receive alerts and updates.</p>
              </div>

              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Course & System Announcements</h4>
                    <p className="text-[11px] text-slate-500">Receive email alerts when new courses or features are released.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifEmailAnnouncements}
                    onChange={(e) => setNotifEmailAnnouncements(e.target.checked)}
                    className="w-5 h-5 text-[#10B981] rounded-md focus:ring-[#10B981] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Assignment Deadlines & Reminders</h4>
                    <p className="text-[11px] text-slate-500">Get notified 24 hours before coursework due dates.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifAssignmentReminders}
                    onChange={(e) => setNotifAssignmentReminders(e.target.checked)}
                    className="w-5 h-5 text-[#10B981] rounded-md focus:ring-[#10B981] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Exam Results & Certificate Generation</h4>
                    <p className="text-[11px] text-slate-500">Receive instant notifications when quiz scores and certificates are ready.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifQuizResults}
                    onChange={(e) => setNotifQuizResults(e.target.checked)}
                    className="w-5 h-5 text-[#10B981] rounded-md focus:ring-[#10B981] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Weekly Performance Digest</h4>
                    <p className="text-[11px] text-slate-500">Receive a weekly summary email of your progress and statistics.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifWeeklyDigest}
                    onChange={(e) => setNotifWeeklyDigest(e.target.checked)}
                    className="w-5 h-5 text-[#10B981] rounded-md focus:ring-[#10B981] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SYSTEM PREFERENCES */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Platform System Preferences</h3>
                <p className="text-xs text-slate-500">Configure language, timezone, view defaults, and storage caching.</p>
              </div>

              <form onSubmit={handleSaveSystem} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Platform Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    >
                      <option value="English">English (United States)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                      <option value="German">German (Deutsch)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    >
                      <option value="(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi">
                        (UTC+05:30) India Standard Time (IST)
                      </option>
                      <option value="(UTC-05:00) Eastern Time (US & Canada)">
                        (UTC-05:00) Eastern Time (EST)
                      </option>
                      <option value="(UTC+00:00) London, Dublin, Edinburgh">
                        (UTC+00:00) Greenwich Mean Time (GMT)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Default Directory View Mode</label>
                  <select
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="Grid View">Grid View Cards (Default)</option>
                    <option value="Table View">Structured Directory Table</option>
                  </select>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">Reset Local Storage Cache</h4>
                    <p className="text-[11px] text-rose-700">Clear cached assignments, enrollments, and user state.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Local Data
                  </button>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all"
                  >
                    Save System Defaults
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
