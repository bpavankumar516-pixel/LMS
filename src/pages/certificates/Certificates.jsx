import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import {
  Award,
  BookOpen,
  Printer,
  X,
  CheckCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  User,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';

const Certificates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enrollments = [] } = useLMS();

  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const studentId = user?.studentId || user?.id || 'st-pavan';
  const studentEmail = (user?.email || 'pavan@gmail.com').toLowerCase();

  // Filter earned certificates for the logged-in student
  const earnedCertificates = enrollments.filter((e) => {
    const isMyEnrollment =
      e.studentEmail?.toLowerCase() === studentEmail ||
      String(e.studentId) === String(studentId);
    
    const isCompletedOrPassed = e.progress === 100 || e.status === 'Completed' || e.examResult?.passed;
    return isMyEnrollment && isCompletedOrPassed;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-[#0B2522] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              VERIFIED ACADEMIC ACHIEVEMENTS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Official Certificates ({earnedCertificates.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              View, preview, and print your official verified distinction completion certificates earned across all completed courses.
            </p>
          </div>

          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 self-start sm:self-center cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse More Courses</span>
          </button>
        </div>
      </div>

      {/* Earned Certificates Grid */}
      {earnedCertificates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Award className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500">
              Complete all course modules and pass the final certification assessment test with 70%+ score to earn your official distinction certificate!
            </p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Courses Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnedCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Verified Distinction
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {cert.enrollmentDate || 'Recent'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-[#10B981] transition-colors">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instructor: {cert.instructorName || 'Academic Faculty'}</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-700 font-semibold">
                  <span>Score Achieved:</span>
                  <span className="text-emerald-700 font-extrabold">{cert.examResult?.scorePct || 100}%</span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: CERT-{cert.id.slice(0, 8).toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedCertificate(cert)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
                >
                  <Award className="w-4 h-4" />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRINTABLE CERTIFICATE MODAL */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-2xl w-full shadow-2xl border-4 border-amber-300 my-8 space-y-6 text-center relative bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Badge */}
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Official Distinction Certificate of Completion</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">EduLearn Online Learning Management System</h2>
            </div>

            <div className="py-4 space-y-2 border-y border-slate-200">
              <p className="text-xs text-slate-500">This certifies that</p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-700 underline decoration-emerald-300 underline-offset-4">
                {user?.name || cert.studentName || 'Pavan Kumar'}
              </h3>
              <p className="text-xs text-slate-500">has successfully completed all required course modules and passed the Final Certification Assessment in</p>
              <h4 className="text-lg font-bold text-slate-900">{selectedCertificate.courseTitle}</h4>
              <p className="text-xs text-slate-400 pt-1">Instructor: {selectedCertificate.instructorName} &bull; Score: {selectedCertificate.examResult?.scorePct || 100}% &bull; Issued Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Certificate ID: CERT-{selectedCertificate.id.toUpperCase()}</span>
              <span className="font-bold text-emerald-600">Verified Distinction Completion</span>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setSelectedCertificate(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                  toast.success('Printing official certificate...');
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
