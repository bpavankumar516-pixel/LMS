import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import {
  ArrowLeft,
  Clock,
  BarChart,
  User,
  Star,
  CheckCircle,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses } = useLMS();

  const course = courses.find((c) => c.id.toString() === id.toString());

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-xs text-slate-500">The course you are looking for does not exist or was deleted.</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 bg-[#10B981] text-white rounded-xl text-xs font-semibold"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const handleEnroll = () => {
    toast.success(`Successfully enrolled in "${course.title}"!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#10B981] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Catalog</span>
      </button>

      {/* Main Course Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
        {/* Left Thumbnail Banner (5 Cols) */}
        <div className="lg:col-span-5 relative min-h-[260px] bg-slate-900">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-white font-bold text-[11px] rounded-full shadow-md">
              {course.category}
            </span>
            <span className="px-3 py-1 bg-slate-900/80 text-emerald-300 font-semibold text-[11px] rounded-full backdrop-blur-xs">
              {course.level}
            </span>
          </div>
        </div>

        {/* Right Info Section (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
              <span className="text-slate-400 font-normal">({course.reviewsCount || 120} student reviews)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {course.description}
            </p>

            {/* Course Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-[#10B981] rounded-xl">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Instructor</p>
                  <p className="text-xs font-bold text-slate-800">{course.instructor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Duration</p>
                  <p className="text-xs font-bold text-slate-800">{course.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <BarChart className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Level</p>
                  <p className="text-xs font-bold text-slate-800">{course.level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Enroll Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Course Price</p>
              <p className="text-2xl font-extrabold text-[#10B981]">${course.price}</p>
            </div>
            <button
              onClick={handleEnroll}
              className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum & What You'll Learn Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900">What You'll Learn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>Fundamental core concepts and industry best practices</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>Hands-on real world portfolio projects</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>Interactive quizzes and downloadable source code</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>Official Certificate of Completion upon finishing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
