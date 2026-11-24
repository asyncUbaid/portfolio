
import React, { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./ResumeEditor.css";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const initialResume = {
  name: "UBAID ANSARI",
  location: "Indore, India",
  email: "ubaid.ansari.dev@gmail.com",
  phone: "+91-93992-34358",
  website: "www.asyncnation.in",
  linkedin: "https://www.linkedin.com/in/ubaid-ansari-66780b23a",
  github: "www.github.com/asyncUbaid",

  summary:
    "Mobile Application Developer with 3.5+ years of experience building scalable React Native and Android applications across transportation, aviation, real estate, drone technology, and ed-tech domains. Experienced in Offline-First architectures, real time communication, GPS tracking, REST API integrations, cloud services, and performance optimization. Delivered solutions supporting high-volume operational workflows and enterprise grade mobile applications.",

  skills: [
    {
      category: "Languages",
      value: "Java, JavaScript, TypeScript, Kotlin",
    },
    {
      category: "Tools/Frameworks",
      value: "React.js, React Native, Android, Git, Android Studio, Xcode",
    },
    {
      category: "Databases",
      value: "SQLite, MySQL",
    },
    {
      category: "Familiar with",
      value: "Node.js, Express.js, MongoDB, Jetpack Compose",
    },
  ],

  experience: [
    {
      role: "Mobile Application Developer",
      company: "Canopus Infosystems",
      date: "Feb 2023 - Present",
      bullets: [
        "Developed and maintained scalable mobile applications across transportation, logistics, real estate, aviation, and drone technology domains.",
        "Integrated REST APIs, GPS services, real-time communication, and cloud-based solutions.",
        "Improved application stability, performance, and user experience through debugging, testing, and code reviews.",
        "Collaborated with clients, stakeholders, and cross-functional teams to deliver business-critical features.",
        "Contributed to enterprise-grade applications serving thousands of users.",
        "Followed Agile methodologies and Git-based workflows throughout the SDLC.",
      ],
    },
  ],

  projects: [
    {
      title: "React Native Developer | ITMS Driver App",
      bullets: [
        "Large-scale transportation platform supporting 100+ tenants operations across the USA.",
        "Implemented trip assignment, ETA calculation, IVR callouts, trip execution, and EOD processing.",
        "Built Offline-First functionality for low-connectivity environments and reduced the on time network dependency by 50%.",
        "Contributed to an application processing 100,000+ trips per month per tenant.",
      ],
      techStack: "React Native, JavaScript, Socket.IO, REST APIs, GPS, Git",
    },
    {
      title: "React Developer | Quotivo (Housing & Real Estate Platform)",
      bullets: [
        "Developed and maintained cross-platform real estate application for property listing, search, booking, and management.",
        "Built features for buyers, sellers, and agents.",
        "Developed 20+ reusable React Native components and integrated REST APIs.",
      ],
      techStack: "React Native, TypeScript, REST APIs, Git",
    },
    {
      title: "React Native Developer | JetScanner360 (Flight Booking Application)",
      bullets: [
        "Implemented flight search, booking, cancellation, payment processing, and booking management features.",
        "Optimised filtering, sorting, and API integration workflows that reduced latency and unnecessary API calling by 20%.",
      ],
      techStack: "React Native, JavaScript, REST APIs, Git",
    },
    {
      title: "Android Developer | Sync for DJI",
      bullets: [
        "Developed Android application for synchronizing drone media to cloud storage.",
        "Implemented uploads using pre-signed URLs and Backblaze B2.",
        "Improved upload reliability through retry and error-handling mechanisms from scratch.",
      ],
      techStack: "Android, Java, REST APIs, Backblaze B2, Git",
    },
    {
      title: "Android Developer | Edsoma (Parenting & Child Learning Platform)",
      bullets: [
        "Developed UI and functionality for a parenting and child learning platform.",
        "Implemented video calling and parental control features.",
        "Improved application performance, stability, and user experience by implementing MVVM architecture that reduced redundancy and memory leaks by 20%.",
      ],
      techStack: "Android, Java, Kotlin, Zoom, Agora, REST APIs, XML",
    },
  ],

  education: [
    {
      degree: "Master of Computer Application (MCA)",
      institution:
        "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
      date: "2023 - 2025",
    },
    {
      degree: "Bachelor of Computer Application (BCA)",
      institution: "Devi Ahilya Vishwavidyalaya (DAVV), Indore",
      date: "2019 - 2022",
    },
  ],

  achievements: [
    {
      title: "Employee of the Month",
      description:
        "Recognized by Canopus Infosystems for outstanding performance, contribution to project delivery, and commitment to quality.",
    },
  ],
};

// Extract PDF text while preserving approximate line structure.
async function readPDF(file) {
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  const allLines = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const rows = [];

    content.items.forEach((item) => {
      if (!item.str?.trim()) return;

      const x = item.transform[4];
      const y = item.transform[5];

      let row = rows.find(
        (r) => Math.abs(r.y - y) < 3
      );

      if (!row) {
        row = { y, items: [] };
        rows.push(row);
      }

      row.items.push({ x, text: item.str.trim() });
    });

    rows.sort((a, b) => b.y - a.y);

    rows.forEach((row) => {
      row.items.sort((a, b) => a.x - b.x);
      allLines.push(
        row.items.map((item) => item.text).join(" ")
      );
    });
  }

  return allLines.join("\n");
}

function extractResume(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const get = (regex) => text.match(regex)?.[0] || "";

  const sections = {};
  let current = "";

  const headingMap = {
    SUMMARY: "summary",
    SKILLS: "skills",
    "WORK EXPERIENCE": "experience",
    EXPERIENCE: "experience",
    PROJECTS: "projects",
    EDUCATION: "education",
    ACHIEVEMENTS: "achievements",
  };

  Object.keys(headingMap).forEach((heading) => {
    // headingMap is used below for section identification.
  });

  lines.forEach((line) => {
    const heading = line.toUpperCase().replace(/:$/, "");

    if (headingMap[heading]) {
      current = headingMap[heading];
      if (!sections[current]) sections[current] = [];
      return;
    }

    if (current) {
      sections[current].push(line);
    }
  });

  const email = get(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phone = get(/\+?\d[\d\s().-]{8,}\d/);

  const linkedin = get(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i);
  const github = get(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s]+/i);

  const contactLines = lines.slice(1, 4).join(" ");
  const location = contactLines.match(
    /([A-Za-z ]+,\s*[A-Za-z ]+)/
  )?.[0] || "";

  const cleanBullets = (arr = []) =>
    arr
      .map((line) => line.replace(/^[•●▪-]\s*/, "").trim())
      .filter(Boolean);

  const skillRows = (sections.skills || []).map((line) => {
    const parts = line.split(/\s{2,}/);

    return {
      category: parts[0] || "",
      value: parts.slice(1).join(" ") || "",
    };
  }).filter((item) => item.category || item.value);

  const sectionLines = sections.projects || [];
  const projectStart = /^(React Native Developer|React Developer|Android Developer)\s*\|/i;

  const projectGroups = [];
  let activeProject = null;

  sectionLines.forEach((line) => {
    if (projectStart.test(line)) {
      activeProject = {
        title: line,
        bullets: [],
        techStack: "",
      };
      projectGroups.push(activeProject);
    } else if (activeProject && /^Tech Stack:/i.test(line)) {
      activeProject.techStack = line.replace(/^Tech Stack:\s*/i, "");
    } else if (activeProject) {
      activeProject.bullets.push(
        line.replace(/^[•●▪-]\s*/, "")
      );
    }
  });

  const experienceLines = sections.experience || [];
  const experienceRole = experienceLines[0] || "";
  const experienceDate = experienceLines.find(
    (line) => /\b(19|20)\d{2}\b/.test(line)
  ) || "";

  const company = experienceLines[1] || "";

  const educationLines = sections.education || [];
  const education = [];

  for (let i = 0; i < educationLines.length; i++) {
    if (/^(Master|Bachelor|B\.?Tech|M\.?Tech|Diploma|Ph\.?D)/i.test(educationLines[i])) {
      education.push({
        degree: educationLines[i],
        institution: educationLines[i + 1] || "",
        date: educationLines[i + 2] || "",
      });
    }
  }

  return {
    ...initialResume,
    name: lines[0] || "",
    email,
    phone,
    location,
    linkedin,
    github,
    summary: (sections.summary || []).join(" "),
    skills: skillRows.length ? skillRows : initialResume.skills,
    experience: experienceLines.length
      ? [{
          role: experienceRole,
          company,
          date: experienceDate,
          bullets: cleanBullets(
            experienceLines.slice(2).filter(
              (line) => !/\b(19|20)\d{2}\b/.test(line)
            )
          ),
        }]
      : initialResume.experience,
    projects: projectGroups.length ? projectGroups : initialResume.projects,
    education: education.length ? education : initialResume.education,
    achievements: (sections.achievements || []).length
      ? (sections.achievements || []).map((line) => {
          const parts = line.split(/\s+[–-]\s+/);
          return {
            title: parts[0] || line,
            description: parts.slice(1).join(" - "),
          };
        })
      : initialResume.achievements,
  };
}

function ResumeEditor({ onClose }) {
  const [resume, setResume] = useState(initialResume);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resumeRef = useRef(null);

  const updateField = (field, value) => {
    setResume((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateArray = (field, index, key, value) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addItem = (field, item) => {
    setResume((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  const removeItem = (field, index) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const uploadResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const text = await readPDF(file);

      if (!text.trim()) {
        throw new Error(
          "No readable text found. This may be a scanned PDF."
        );
      }

      const extracted = extractResume(text);
      setResume(extracted);
      setMessage("Resume details extracted. Review the fields before downloading.");
    } catch (err) {
      setError(err.message || "Could not read the PDF.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const downloadResume = async () => {
    try {
      setMessage("Generating your resume PDF...");
      setError("");

      const pdf = new jsPDF("p", "mm", "a4");

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const pageHeight = Math.round(canvas.width * 297 / 210);

      for (let y = 0; y < canvas.height; y += pageHeight) {
        const sliceHeight = Math.min(pageHeight, canvas.height - y);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const pageContext = pageCanvas.getContext("2d");
        if (!pageContext) {
          throw new Error("Unable to create a canvas for the PDF.");
        }

        pageContext.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        if (y > 0) pdf.addPage();

        pdf.addImage(
          pageCanvas.toDataURL("image/jpeg", 0.98),
          "JPEG",
          0,
          0,
          210,
          297 * sliceHeight / pageHeight,
          undefined,
          "FAST"
        );
      }

      const safeName = (resume.name || "Resume")
        .trim()
        .replace(/[^a-z0-9_-]/gi, "_");

      pdf.save(`${safeName}_Resume.pdf`);
      setMessage("Your resume has been downloaded.");
    } catch (err) {
      console.error(err);
      setError("Unable to generate PDF. Please try again.");
    }
  };

  const Section = ({ title, children }) => (
    <section className="resume-section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );

  const Project = ({ project }) => (
    <div className="project-item">
      <h3>{project.title}</h3>

      <ul>
        {project.bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>

      <p className="tech-stack">
        <strong>Tech Stack:</strong> {project.techStack}
      </p>
    </div>
  );

  const updateBullet = (field, index, bulletIndex, value) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          bullets: item.bullets.map((bullet, j) =>
            j === bulletIndex ? value : bullet
          ),
        };
      }),
    }));
  };

  const addBullet = (field, index) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index
          ? { ...item, bullets: [...item.bullets, ""] }
          : item
      ),
    }));
  };

  const deleteBullet = (field, index, bulletIndex) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index
          ? {
              ...item,
              bullets: item.bullets.filter(
                (_, j) => j !== bulletIndex
              ),
            }
          : item
      ),
    }));
  };

  const editorInput = (label, value, onChange, multiline = false) => (
    <label className="editor-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );

  return (
    <div className="app-container">
      <header className="topbar">
        <div>
          <h1>Resume Editor</h1>
          <p>Edit your resume and its content will flow across pages.</p>
        </div>
        <div className="resume-editor-actions">
          {onClose && (
            <button className="secondary-btn" type="button" onClick={onClose}>
              Back to Portfolio
            </button>
          )}
          <button className="primary-btn" onClick={downloadResume}>
            Download PDF ↓
          </button>
        </div>
      </header>

      <main className="main-layout">
        <aside className="editor">
          <div className="editor-heading">
            <h2>Resume Details</h2>
            <p>Changes are reflected in the preview.</p>
          </div>

          <label className="upload-control">
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={uploadResume}
            />
            <strong>↑ Upload another PDF</strong>
            <small>PDF files only</small>
          </label>

          {loading && <p className="info">{ "Extracting PDF..." }</p>}
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <details open>
            <summary>Personal Information</summary>
            {editorInput("Name", resume.name, (v) => updateField("name", v))}
            {editorInput("Location", resume.location, (v) => updateField("location", v))}
            {editorInput("Email", resume.email, (v) => updateField("email", v))}
            {editorInput("Phone", resume.phone, (v) => updateField("phone", v))}
            {editorInput("Website", resume.website, (v) => updateField("website", v))}
            {editorInput("LinkedIn", resume.linkedin, (v) => updateField("linkedin", v))}
            {editorInput("GitHub", resume.github, (v) => updateField("github", v))}
          </details>

          <details open>
            <summary>Professional Summary</summary>
            {editorInput(
              "Summary",
              resume.summary,
              (v) => updateField("summary", v),
              true
            )}
          </details>

          <details open>
            <summary>Skills</summary>
            {resume.skills.map((skill, i) => (
              <div className="editor-card" key={i}>
                {editorInput("Category", skill.category, (v) =>
                  updateArray("skills", i, "category", v)
                )}
                {editorInput("Skills", skill.value, (v) =>
                  updateArray("skills", i, "value", v)
                )}
                <button className="remove-btn" onClick={() => removeItem("skills", i)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              className="add-btn"
              onClick={() => addItem("skills", { category: "", value: "" })}
            >
              + Add skill category
            </button>
          </details>

          <details open>
            <summary>Work Experience</summary>
            {resume.experience.map((item, i) => (
              <div className="editor-card" key={i}>
                {editorInput("Job Title", item.role, (v) => updateArray("experience", i, "role", v))}
                {editorInput("Company", item.company, (v) => updateArray("experience", i, "company", v))}
                {editorInput("Date", item.date, (v) => updateArray("experience", i, "date", v))}

                <strong>Responsibilities</strong>
                {item.bullets.map((bullet, j) => (
                  <div className="bullet-editor" key={j}>
                    <textarea
                      value={bullet}
                      onChange={(e) => updateBullet("experience", i, j, e.target.value)}
                    />
                    <button onClick={() => deleteBullet("experience", i, j)}>×</button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => addBullet("experience", i)}>
                  + Add responsibility
                </button>
                <button className="remove-btn" onClick={() => removeItem("experience", i)}>
                  Remove experience
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={() =>
              addItem("experience", { role: "", company: "", date: "", bullets: [] })
            }>
              + Add experience
            </button>
          </details>

          <details open>
            <summary>Projects</summary>
            {resume.projects.map((item, i) => (
              <div className="editor-card" key={i}>
                {editorInput("Project Title", item.title, (v) => updateArray("projects", i, "title", v))}
                <strong>Project Details</strong>
                {item.bullets.map((bullet, j) => (
                  <div className="bullet-editor" key={j}>
                    <textarea
                      value={bullet}
                      onChange={(e) => updateBullet("projects", i, j, e.target.value)}
                    />
                    <button onClick={() => deleteBullet("projects", i, j)}>×</button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => addBullet("projects", i)}>
                  + Add project detail
                </button>
                {editorInput("Tech Stack", item.techStack, (v) => updateArray("projects", i, "techStack", v))}
                <button className="remove-btn" onClick={() => removeItem("projects", i)}>
                  Remove project
                </button>
              </div>
            ))}
            <button
              className="add-btn"
              onClick={() => addItem("projects", { title: "", bullets: [], techStack: "" })}
            >
              + Add project
            </button>
          </details>

          <details open>
            <summary>Education</summary>
            {resume.education.map((item, i) => (
              <div className="editor-card" key={i}>
                {editorInput("Degree", item.degree, (v) => updateArray("education", i, "degree", v))}
                {editorInput("Institution", item.institution, (v) => updateArray("education", i, "institution", v))}
                {editorInput("Date", item.date, (v) => updateArray("education", i, "date", v))}
                <button className="remove-btn" onClick={() => removeItem("education", i)}>
                  Remove education
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={() =>
              addItem("education", { degree: "", institution: "", date: "" })
            }>
              + Add education
            </button>
          </details>

          <details open>
            <summary>Achievements</summary>
            {resume.achievements.map((item, i) => (
              <div className="editor-card" key={i}>
                {editorInput("Achievement", item.title, (v) => updateArray("achievements", i, "title", v))}
                {editorInput("Description", item.description, (v) => updateArray("achievements", i, "description", v), true)}
                <button className="remove-btn" onClick={() => removeItem("achievements", i)}>
                  Remove achievement
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={() =>
              addItem("achievements", { title: "", description: "" })
            }>
              + Add achievement
            </button>
          </details>

          <button className="primary-btn full-btn" onClick={downloadResume}>
            Download Updated Resume
          </button>
        </aside>

        <section className="preview">
          <div className="preview-heading">
            <div>
              <h2>Live Preview</h2>
              <p>Content flows to additional A4 pages automatically.</p>
            </div>
            <span>A4 · AUTO PAGINATION</span>
          </div>

          <div className="pages-wrapper">
            <div className="resume-page" ref={resumeRef}>
              <div className="resume-identity">
                <h1>{resume.name}</h1>
                <p>
                  {[resume.location, resume.email, resume.phone, resume.website]
                    .filter(Boolean).join(" | ")}
                </p>
                <p>
                  {[resume.linkedin, resume.github].filter(Boolean).join(" | ")}
                </p>
              </div>

              <Section title="Summary">
                <p className="body-text">{resume.summary}</p>
              </Section>

              <Section title="Skills">
                <div className="skills-table">
                  {resume.skills.map((skill, i) => (
                    <div className="skill-row" key={i}>
                      <strong>{skill.category}</strong>
                      <span>{skill.value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Work Experience">
                {resume.experience.map((item, i) => (
                  <div className="experience-item" key={i}>
                    <div className="experience-top">
                      <strong>{item.role}</strong>
                      <em>{item.date}</em>
                    </div>
                    <em className="company">{item.company}</em>
                    <ul className="resume-list">
                      {item.bullets.map((bullet, j) => (
                        <li key={j}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Section>

              <Section title="Projects">
                {resume.projects.map((project, i) => (
                  <Project project={project} key={i} />
                ))}
              </Section>

              <Section title="Education">
                {resume.education.map((item, i) => (
                  <div className="education-item" key={i}>
                    <div className="education-top">
                      <strong>{item.degree}</strong>
                      <em>{item.date}</em>
                    </div>
                    <em>{item.institution}</em>
                  </div>
                ))}
              </Section>

              <Section title="Achievements">
                <ul className="achievement-list">
                  {resume.achievements.map((item, i) => (
                    <li key={i}>
                      <strong>{item.title}</strong>
                      {item.description && ` – ${item.description}`}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ResumeEditor;
