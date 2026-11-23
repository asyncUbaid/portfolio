import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Experience from "./components/Experience/Experience";
import Tools from "./components/Tools/Tools";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

import usePortfolioData from "./hooks/usePortfolioData";
import Stats from "./components/Stats/Stats";
import { useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import ResumeEditor from "./components/ResumeEditor/ResumeEditor";
import "./App.css";

function App() {

    const [loading, setLoading] = useState(true);
  const [showResumeEditor, setShowResumeEditor] = useState(false);
  const {
    profile,
    skills,
    experience,
    tools,
    socials,
    stats,
    error: portfolioError,
    retry: retryPortfolioData
  } = usePortfolioData();

    useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // minimum UX loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (showResumeEditor) {
    return <ResumeEditor onClose={() => setShowResumeEditor(false)} />;
  }

  return (
    <>
<Navbar onOpenResumeEditor={() => setShowResumeEditor(true)} />

{portfolioError && (
  <div className="portfolio-data-error" role="alert">
    <p>{portfolioError}</p>
    <button type="button" onClick={retryPortfolioData}>
      Retry
    </button>
  </div>
)}

<Hero profile={profile} />

<Stats stats={stats} />

<About profile={profile} />

<Skills skills={skills} />

<Experience experience={experience} />

<Tools tools={tools} />

<Contact socials={socials} />

<Footer />
    </>
  );
}

export default App;
