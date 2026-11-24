import { parseResumeText } from "./resumeText";

test("parses Markdown resume sections into editor fields", () => {
  const resume = parseResumeText(`# UBAID ANSARI
Indore, India | [ubaid@example.com](mailto:ubaid@example.com) | +91-93992-34358
Website: [www.example.com](https://www.example.com)
LinkedIn: linkedin.com/in/example

## PROFESSIONAL SUMMARY
Software developer with experience building applications.

## TECHNICAL SKILLS
**Programming Languages:** Python, JavaScript
**Databases:** SQLite, MySQL

## PROFESSIONAL EXPERIENCE
### AI Engineer / Software Developer
**Canopus Infosystems | February 2023 – Present**
**AI Engineering**
- Built practical AI applications.

## PROJECTS
### ITMS Driver App | React Native Developer
- Built an offline-first mobile app.
**Tech Stack:** React Native, REST APIs

## EDUCATION
**Master of Computer Application (MCA)**
RGPV, Bhopal | 2023–2025

## ACHIEVEMENTS
- **Employee of the Month** – Recognized for outstanding work.`);

  expect(resume).toMatchObject({
    name: "UBAID ANSARI",
    location: "Indore, India",
    email: "ubaid@example.com",
    phone: "+91-93992-34358",
    website: "www.example.com",
    linkedin: "linkedin.com/in/example",
    summary: "Software developer with experience building applications.",
    skills: [
      { category: "Programming Languages", value: "Python, JavaScript" },
      { category: "Databases", value: "SQLite, MySQL" },
    ],
    experience: [{
      role: "AI Engineer / Software Developer",
      company: "Canopus Infosystems",
      date: "February 2023 – Present",
      bullets: ["AI Engineering: Built practical AI applications."],
    }],
    projects: [{
      title: "ITMS Driver App | React Native Developer",
      bullets: ["Built an offline-first mobile app."],
      techStack: "React Native, REST APIs",
    }],
    education: [{
      degree: "Master of Computer Application (MCA)",
      institution: "RGPV, Bhopal",
      date: "2023–2025",
    }],
    achievements: [{
      title: "Employee of the Month",
      description: "Recognized for outstanding work.",
    }],
  });
});

test("rejects text that contains no recognizable resume information", () => {
  expect(() => parseResumeText("just some random notes")).toThrow(
    "No resume sections were recognized"
  );
});

test("parses JSON resume fields, including pasted JSON code fences", () => {
  const resume = parseResumeText(`\`\`\`json
${JSON.stringify({
  name: "UBAID ANSARI",
  email: "ubaid@example.com",
  summary: "AI engineer and software developer.",
  skills: [{ category: "Programming Languages", value: "Python, Java" }],
  experience: [{
    role: "AI Engineer",
    company: "Canopus Infosystems",
    date: "February 2023 – Present",
    bullets: ["Built AI applications."],
  }],
  projects: [{
    title: "ITMS Driver App",
    bullets: ["Built offline-first functionality."],
    techStack: "React Native, REST APIs",
  }],
  education: [{
    degree: "Master of Computer Application",
    institution: "RGPV, Bhopal",
    date: "2023–2025",
  }],
  achievements: [{
    title: "Employee of the Month",
    description: "Recognized for outstanding work.",
  }],
}, null, 2)}
\`\`\``);

  expect(resume).toMatchObject({
    name: "UBAID ANSARI",
    email: "ubaid@example.com",
    summary: "AI engineer and software developer.",
    skills: [{ category: "Programming Languages", value: "Python, Java" }],
    experience: [{
      role: "AI Engineer",
      company: "Canopus Infosystems",
      date: "February 2023 – Present",
      bullets: ["Built AI applications."],
    }],
    projects: [{
      title: "ITMS Driver App",
      bullets: ["Built offline-first functionality."],
      techStack: "React Native, REST APIs",
    }],
    education: [{
      degree: "Master of Computer Application",
      institution: "RGPV, Bhopal",
      date: "2023–2025",
    }],
    achievements: [{
      title: "Employee of the Month",
      description: "Recognized for outstanding work.",
    }],
  });
});

test("reports invalid JSON resume field types", () => {
  expect(() => parseResumeText('{"name": 123}')).toThrow(
    "name must be a string."
  );
});
