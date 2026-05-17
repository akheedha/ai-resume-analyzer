import React, { useState, useRef } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import {
  Upload,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import "react-circular-progressbar/dist/styles.css";

function App() {



  const [file, setFile] = useState(null);

  const [analysis, setAnalysis] = useState({});

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const analysisRef = useRef(null);

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) {

      alert("Please select a PDF file");

      return;
    }

    const formData = new FormData();
formData.append("resume_file", file);

console.log(file);

console.log(formData.get("resume_file"));
   

    setSuccess(false);

    try {

      setLoading(true);

      const response = await axios.post(

      "https://resumeforge-ai-backend-uu4a.onrender.com/api/resumes/",

  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      console.log(response.data);

      setAnalysis(response.data.ai_analysis);

      setSuccess(true);

      setLoading(false);

      setTimeout(() => {

        analysisRef.current?.scrollIntoView({
          behavior: "smooth",
        });

      }, 500);

} catch (error) {

  console.log(error);

  setLoading(false);

  if (error.response && error.response.data) {

    alert(
      error.response.data.error ||
      JSON.stringify(error.response.data)
    );

  }

  else if (error.request) {

    alert("Backend not responding");

  }

  else {

    alert(error.message);

  }
}
  };

  return (

    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND GLOWS */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px]"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px]"></div>

      <Navbar />

      <div className="p-10">

        <div className="max-w-6xl mx-auto">

          {/* HERO */}

          <div className="text-center mb-20 relative">

            <div className="absolute inset-0 flex justify-center">

              <div className="w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"></div>

            </div>

            <div className="relative z-10">

              <h1 className="text-7xl font-extrabold leading-tight">

                ResumeForge{" "}

                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">

                  AI

                </span>

              </h1>

              <p className="text-gray-400 text-xl mt-6 max-w-2xl mx-auto">

                Forge Better Careers With AI

              </p>

            </div>

          </div>

          {/* TOP GRID */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* UPLOAD CARD */}

            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition duration-300 hover:border-purple-400/30 hover:shadow-purple-500/10 hover:shadow-2xl">

              <div className="flex items-center gap-3 mb-8">

                <Upload className="text-purple-400" size={32} />

                <h2 className="text-3xl font-bold">

                  Upload Your Resume

                </h2>

              </div>

              <form onSubmit={handleUpload}>



                {/* FILE AREA */}

                <div className="border-2 border-dashed border-purple-500/40 rounded-3xl p-16 text-center bg-black/20">

                  <p className="text-gray-400 text-lg mb-6">

                    Drag & Drop your resume here

                  </p>

                  <label className="cursor-pointer inline-block bg-purple-600 hover:bg-purple-700 transition px-8 py-4 rounded-2xl font-semibold">

                    Choose Resume

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />

                  </label>

                  <p className="text-gray-500 text-sm mt-5">

                    Supports PDF files

                  </p>

                  {file && (

                    <div className="mt-5 bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-3 rounded-2xl inline-block">

                      ✅ {file.name}

                    </div>

                  )}

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-8 p-5 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-3 ${
                    loading
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                  }`}
                >

                  {loading ? (

                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>

                      Analyzing Resume...

                    </>

                  ) : (

                    "Upload Resume"

                  )}

                </button>

              </form>

            </div>

            {/* ATS SCORE */}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center items-center transition duration-300 hover:border-blue-400/30 hover:shadow-blue-500/10 hover:shadow-2xl">

              <h2 className="text-3xl font-bold mb-8">

                ATS Score

              </h2>

              {analysis?.ats_score ? (

                <>
                  <div className="w-56 h-56 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)]">

                    <CircularProgressbar

                      value={analysis.ats_score}

                      text={`${analysis.ats_score}%`}

                      styles={buildStyles({

                        textColor: "#ffffff",

                        pathColor: "#a855f7",

                        trailColor: "#27272a",

                      })}

                    />

                  </div>

                  <p className="mt-6 text-xl font-semibold text-green-400 text-center">

                    {
                      analysis.ats_score >= 80
                        ? "Excellent Resume"
                        : analysis.ats_score >= 60
                        ? "Good Resume"
                        : "Needs Improvement"
                    }

                  </p>
                </>

              ) : (

                <div className="text-gray-500 text-center">

                  Upload a resume to see your ATS score

                </div>

              )}

            </div>

          </div>

          {/* LOADING */}

          {loading && (

            <div className="text-center mt-10 text-xl text-purple-400 animate-pulse">

              Analyzing Resume...

            </div>

          )}

          {/* SUCCESS */}

          {success && (

            <div className="mt-8 bg-green-500/10 border border-green-500/30 text-green-400 p-5 rounded-2xl text-center text-lg">

              ✅ Resume analyzed successfully!

            </div>

          )}

          {/* ANALYSIS */}

          {analysis?.ats_score && (

            <div ref={analysisRef}>

              <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* STRENGTHS */}

                <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-green-400/40 hover:shadow-green-500/10 hover:shadow-2xl">

                  <div className="flex items-center gap-3 mb-6">

                    <ShieldCheck className="text-green-400" size={30} />

                    <h2 className="text-3xl font-bold text-green-400">

                      Strengths

                    </h2>

                  </div>

                  <div className="flex flex-wrap gap-4">

                    {analysis?.strengths?.map((item, index) => (

                      <div
                        key={index}
                        className="bg-green-500/20 text-green-200 px-5 py-3 rounded-2xl transition duration-300 hover:scale-105"
                      >

                        {item}

                      </div>

                    ))}

                  </div>

                </div>

                {/* MISSING SKILLS */}

                <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-red-400/40 hover:shadow-red-500/10 hover:shadow-2xl">

                  <div className="flex items-center gap-3 mb-6">

                    <AlertCircle className="text-red-400" size={30} />

                    <h2 className="text-3xl font-bold text-red-400">

                      Missing Skills

                    </h2>

                  </div>

                  <div className="flex flex-wrap gap-4">

                    {analysis?.missing_skills?.map((item, index) => (

                      <div
                        key={index}
                        className="bg-red-500/20 text-red-200 px-5 py-3 rounded-2xl transition duration-300 hover:scale-105"
                      >

                        {item}

                      </div>

                    ))}

                  </div>

                </div>

                {/* SUGGESTIONS */}

                <div className="md:col-span-2 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.01] hover:border-yellow-400/40 hover:shadow-yellow-500/10 hover:shadow-2xl">

                  <div className="flex items-center gap-3 mb-6">

                    <Sparkles className="text-yellow-300" size={30} />

                    <h2 className="text-3xl font-bold text-yellow-300">

                      AI Suggestions

                    </h2>

                  </div>

                  <div className="space-y-4">

                    {analysis?.suggestions?.map((item, index) => (

                      <div
                        key={index}
                        className="bg-yellow-500/10 border border-yellow-500/10 p-5 rounded-2xl text-lg transition duration-300 hover:scale-[1.02] hover:border-yellow-400/30 hover:bg-yellow-500/20"
                      >

                        💡 {item}

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* FEATURES SECTION */}

      <div
        id="features"
        className="mt-32 relative z-10 px-10"
      >

        <h2 className="text-5xl font-bold text-center mb-16">

          Powerful AI Features

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.03]">

            <div className="text-5xl mb-5">
              📄
            </div>

            <h3 className="text-2xl font-bold mb-4">

              Resume Upload

            </h3>

            <p className="text-gray-400">

              Upload PDF resumes instantly with a modern drag-and-drop interface.

            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.03]">

            <div className="text-5xl mb-5">
              🤖
            </div>

            <h3 className="text-2xl font-bold mb-4">

              AI Analysis

            </h3>

            <p className="text-gray-400">

              Get AI-powered resume evaluation tailored to your career field.

            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.03]">

            <div className="text-5xl mb-5">
              📊
            </div>

            <h3 className="text-2xl font-bold mb-4">

              ATS Score

            </h3>

            <p className="text-gray-400">

              Instantly view your resume ATS compatibility score.

            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.03]">

            <div className="text-5xl mb-5">
              💡
            </div>

            <h3 className="text-2xl font-bold mb-4">

              Smart Suggestions

            </h3>

            <p className="text-gray-400">

              Improve your resume with actionable AI recommendations.

            </p>

          </div>

        </div>

      </div>

      {/* ABOUT SECTION */}

      <div
        id="about"
        className="mt-32 relative z-10 px-10"
      >

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-xl">

          <h2 className="text-5xl font-bold mb-10 text-center">

            About ResumeForge AI

          </h2>

          <p className="text-gray-300 text-xl leading-10 max-w-4xl mx-auto text-center">

            ResumeForge AI is an AI-powered resume optimization platform designed to help job seekers improve ATS compatibility and strengthen their resumes using intelligent analysis and personalized recommendations.

            <br /><br />

            Built using React, Django REST Framework, Tailwind CSS, and OpenRouter AI integration, the platform combines modern UI design with practical AI-driven career tools.

            <br /><br />


          </p>

        </div>

      </div>

      {/* FOOTER */}

      <footer className="text-center py-10 text-gray-500 relative z-10">

        Designed & Developed by Akheedha

      </footer>

    </div>
  );
}

export default App;