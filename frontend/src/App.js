import React, { useRef, useState } from "react";
import axios from "axios";
import { AlertCircle, ArrowRight, BrainCircuit, CheckCircle2, FileSearch, FileText, Lightbulb, Mail, ShieldCheck, Sparkles, Upload } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Navbar from "./components/Navbar";

const features = [
  { icon: FileText, title: "Effortless upload", text: "Drop in your PDF and securely start an analysis in seconds." },
  { icon: BrainCircuit, title: "AI-powered review", text: "Get a detailed evaluation tailored to what recruiters look for." },
  { icon: FileSearch, title: "ATS compatibility", text: "Understand how your resume performs before it reaches an employer." },
  { icon: Lightbulb, title: "Actionable guidance", text: "Turn insights into clear next steps for a stronger application." },
];

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const analysisRef = useRef(null);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a PDF file");
      return;
    }
    setFile(selectedFile);
    setSuccess(false);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return inputRef.current?.click();
    const formData = new FormData();
    formData.append("resume_file", file);
    setSuccess(false);
    setLoading(true);
    try {
      const response = await axios.post("https://resumeforge-ai-backend-uu4a.onrender.com/api/resumes/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setAnalysis(response.data.ai_analysis || {});
      setSuccess(true);
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch (error) {
      if (error.response?.data) alert(error.response.data.error || JSON.stringify(error.response.data));
      else if (error.request) alert("Backend not responding");
      else alert(error.message);
    } finally { setLoading(false); }
  };

  const score = analysis?.ats_score;
  const scoreLabel = score >= 80 ? "Excellent match" : score >= 60 ? "Strong foundation" : score ? "Needs attention" : "Awaiting analysis";

  return (
    <div id="top" className="min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />
      <main>
        <section className="relative isolate px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
          <div className="hero-glow hero-glow-left" /><div className="hero-glow hero-glow-right" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow"><Sparkles size={14} /> AI-Powered Resume Intelligence</span>
              <h1 className="mt-6 text-4xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">Build a resume that <span className="text-brand-soft">gets noticed.</span></h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">Analyze your resume against ATS standards, uncover what is missing, and get practical AI guidance for your next opportunity.</p>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] lg:gap-6">
              <section className="panel p-5 sm:p-8" aria-labelledby="upload-title">
                <div className="mb-7 flex items-start justify-between gap-4"><div><div className="icon-box"><Upload size={21} /></div><h2 id="upload-title" className="mt-4 text-xl font-semibold sm:text-2xl">Analyze your resume</h2><p className="mt-1 text-sm text-text-secondary">Upload a PDF to receive your personalized ATS report.</p></div><span className="hidden rounded-full border border-border bg-background-secondary px-3 py-1.5 text-xs text-muted sm:block">PDF only · Secure upload</span></div>
                <form onSubmit={handleUpload}>
                  <div onDrop={(e) => { e.preventDefault(); setDragActive(false); selectFile(e.dataTransfer.files?.[0]); }} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onClick={() => inputRef.current?.click()} className={`upload-zone ${dragActive ? "upload-zone-active" : ""}`} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}>
                    <input ref={inputRef} type="file" accept=".pdf,application/pdf" onChange={(e) => selectFile(e.target.files?.[0])} className="hidden" />
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-brand-primary/25 bg-brand-primary/10 text-brand-soft"><Upload size={24} /></span>
                    {file ? <><p className="mt-4 max-w-full truncate text-base font-medium">{file.name}</p><p className="mt-1 text-sm text-brand-soft">Ready for analysis · Choose another file</p></> : <><p className="mt-4 text-base font-medium">Drag and drop your resume here</p><p className="mt-1 text-sm text-text-secondary">or click to browse from your computer</p></>}
                  </div>
                  <button type="submit" disabled={loading} className="primary-button mt-5 w-full">{loading ? <><span className="spinner" /> Analyzing your resume…</> : <>{file ? "Analyze resume" : "Choose a resume"} <ArrowRight size={18} /></>}</button>
                </form>
              </section>
              <section className="panel score-panel p-6 sm:p-8" aria-labelledby="score-title">
                <div className="flex items-center justify-between"><div><p className="section-kicker">Resume health</p><h2 id="score-title" className="mt-1 text-xl font-semibold">ATS score</h2></div><span className="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-2.5 py-1 text-xs font-medium text-brand-soft">Live report</span></div>
                <div className="mx-auto mt-7 h-40 w-40"><CircularProgressbar value={score || 0} text={score ? `${score}%` : "—"} styles={buildStyles({ textColor: "#F5F7F6", pathColor: "#22C55E", trailColor: "#252A27", textSize: "22px", pathTransitionDuration: 0.5 })} /></div>
                <div className="mt-6 border-t border-border pt-5"><div className="flex items-center gap-2 text-sm font-medium"><span className={`status-dot ${score ? "status-dot-ready" : ""}`} />{scoreLabel}</div><p className="mt-2 text-sm leading-6 text-text-secondary">{score ? "Your score reflects overall ATS readiness based on the uploaded resume." : "Your score and key recommendations will appear here after analysis."}</p></div>
              </section>
            </div>
            {success && <div className="success-banner"><CheckCircle2 size={19} /> Resume analyzed successfully. Your report is ready below.</div>}
          </div>
        </section>
        {score && <section ref={analysisRef} className="scroll-mt-24 px-5 pb-12 sm:px-8" aria-label="Analysis report"><div className="mx-auto max-w-7xl"><div className="mb-7"><p className="section-kicker">Your report</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Clear insights for a better application</h2></div><div className="grid gap-5 md:grid-cols-2"><InsightCard icon={ShieldCheck} title="Strengths" tone="green" items={analysis.strengths} /><InsightCard icon={AlertCircle} title="Areas to develop" items={analysis.missing_skills} /><section className="panel md:col-span-2 p-6 sm:p-8"><div className="flex items-center gap-3"><span className="icon-box"><Sparkles size={20} /></span><div><p className="section-kicker">Personalized feedback</p><h2 className="text-xl font-semibold">AI suggestions</h2></div></div><div className="mt-6 grid gap-3">{analysis.suggestions?.map((item, index) => <div className="suggestion" key={index}><span>{String(index + 1).padStart(2, "0")}</span>{item}</div>)}</div></section></div></div></section>}
        <section id="features" className="border-y border-border/70 bg-background-secondary/65 px-5 py-16 sm:px-8 sm:py-24"><div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="section-kicker">Everything in one review</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Practical intelligence for every application.</h2><p className="mt-4 leading-7 text-text-secondary">From upload to optimization, ResumeForge gives you a focused path to a more effective resume.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><span className="icon-box"><Icon size={21} /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-text-secondary">{text}</p></article>)}</div></div></section>
        <section id="about" className="px-5 py-16 sm:px-8 sm:py-24">
          <div className="about-panel mx-auto max-w-7xl">
            <div><p className="section-kicker">About ResumeForge</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A more confident way to prepare for the job search.</h2></div>
            <p className="max-w-2xl text-base leading-7 text-text-secondary">ResumeForge is an AI-powered resume optimization platform that helps job seekers analyze resumes, improve ATS compatibility, identify weaknesses, and receive actionable AI-powered recommendations.</p>
          </div>
        </section>
        <section className="border-t border-border bg-background-secondary/40 px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="developer-title">
          <div className="mx-auto max-w-7xl">
            <div className="developer-grid">
              <div>
                <p className="section-kicker">Built by</p>
                <h2 id="developer-title" className="mt-2 text-2xl font-semibold sm:text-3xl">Akheedha Jan</h2>
                <p className="mt-4 max-w-xl leading-7 text-text-secondary">Full Stack Developer building practical web applications with React, Node.js, Python, Django, and AI.</p>
              </div>
              <div className="space-y-5">
                <TechRow label="Full Stack Developer" items={["React", "Node.js", "Express", "Python", "Django", "AI"]} />
                <TechRow label="Built with" items={["React", "Django", "REST API", "AI"]} />
              </div>
            </div>
            <div className="contact-cta">
              <div className="contact-copy"><p className="section-kicker">Let's Connect</p><h2 className="mt-2 text-2xl font-semibold">Interested in working with me?</h2><p className="mt-2 text-sm leading-6 text-text-secondary">Have an opportunity, collaboration, or project idea? Feel free to reach out.</p><ContactLinks /><a className="contact-email" href="mailto:akheedhajan20@gmail.com">akheedhajan20@gmail.com</a></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InsightCard({ icon: Icon, title, items = [], tone }) {
  return <section className={`panel p-6 sm:p-8 ${tone === "green" ? "insight-green" : ""}`}><div className="flex items-center gap-3"><span className="icon-box"><Icon size={20} /></span><h2 className="text-xl font-semibold">{title}</h2></div><div className="mt-6 flex flex-wrap gap-2.5">{items.length ? items.map((item, index) => <span className="insight-tag" key={index}>{item}</span>) : <p className="text-sm text-text-secondary">No items were returned for this category.</p>}</div></section>;
}

function TechRow({ label, items }) {
  return <div><p className="text-sm font-medium text-text-primary">{label}</p><div className="tech-chips">{items.map((item) => <span key={item}>{item}</span>)}</div></div>;
}

function ContactLinks() {
  const links = [
    { label: "GitHub", href: "https://github.com/akheedha", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/akheedha/", icon: "linkedin" },
    { label: "Email Akheedha", href: "mailto:akheedhajan20@gmail.com", icon: "email" },
    { label: "Chat with Akheedha on WhatsApp", href: "https://wa.me/917736114684?text=Hi%20Akheedha%2C%20I%20came%20across%20your%20ResumeForge%20project%20and%20would%20like%20to%20discuss%20an%20opportunity.", icon: "whatsapp" },
  ];
  return <div className="contact-links">{links.map(({ label, href, icon }) => <a key={label} className="contact-icon" href={href} aria-label={label} title={label} {...(icon !== "email" ? { target: "_blank", rel: "noreferrer" } : {})}>{icon === "email" ? <Mail size={19} /> : <BrandIcon name={icon} />}</a>)}</div>;
}

function BrandIcon({ name }) {
  const paths = {
    github: "M12 .7a11.3 11.3 0 0 0-3.58 22.02c.57.1.77-.25.77-.55v-2.13c-3.14.68-3.8-1.34-3.8-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.51-.28-5.15-1.26-5.15-5.59 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.11 1.16A10.8 10.8 0 0 1 12 3.72c.96 0 1.93.13 2.84.38 2.16-1.46 3.1-1.16 3.1-1.16.62 1.55.24 2.7.12 2.98.72.8 1.16 1.8 1.16 3.03 0 4.34-2.65 5.3-5.17 5.58.41.35.77 1.02.77 2.06v3.05c0 .3.2.66.78.55A11.3 11.3 0 0 0 12 .7Z",
    linkedin: "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.29ZM5.34 7.41a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.04H3.56V8.98h3.56v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z",
    whatsapp: "M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.51 0 .16 5.35.16 11.92c0 2.1.55 4.16 1.6 5.97L.06 24l6.27-1.64a11.9 11.9 0 0 0 5.74 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.16-3.48-8.43Zm-8.44 18.34a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.88 9.88 0 0 1-1.52-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.9 9.9Zm5.42-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47a9.02 9.02 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.7.61.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d={paths[name]} /></svg>;
}

export default App;
