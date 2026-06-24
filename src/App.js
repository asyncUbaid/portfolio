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

function App() {

    const [loading, setLoading] = useState(true);
  const {
    profile,
    skills,
    experience,
    tools,
    socials,
    stats
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
  return (
    <>
<Navbar />

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
