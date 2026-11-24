const cleanMarkdown = (line) =>
  line
    .replace(/\[([^\]]+)\]\((?:mailto:)?[^)]+\)/gi, "$1")
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/^#{1,6}\s+/, "")
    .replace(/[*_`]/g, "")
    .trim();

const sectionName = (heading) =>
  heading.toUpperCase().replace(/[^A-Z]+/g, " ").trim();

const sectionAliases = {
  "PROFESSIONAL SUMMARY": "summary",
  SUMMARY: "summary",
  "TECHNICAL SKILLS": "skills",
  SKILLS: "skills",
  "PROFESSIONAL EXPERIENCE": "experience",
  "WORK EXPERIENCE": "experience",
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  EDUCATION: "education",
  ACHIEVEMENTS: "achievements",
};

const getSections = (lines) => {
  const sections = {};
  let activeSection = "";

  lines.forEach((line) => {
    const heading = line.match(/^##\s+(.+?)\s*#*\s*$/);

    if (heading) {
      activeSection = sectionAliases[sectionName(heading[1])] || "";
      if (activeSection && !sections[activeSection]) {
        sections[activeSection] = [];
      }
      return;
    }

    if (activeSection) sections[activeSection].push(line);
  });

  return sections;
};

const getDateFromLine = (line) =>
  line.match(
    /\b(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+)?(?:19|20)\d{2}\s*(?:[-–—]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+)?(?:(?:19|20)\d{2}|Present))?/i
  )?.[0] || "";

const parseExperience = (lines) => {
  const experiences = [];
  let activeExperience = null;
  let subsection = "";

  lines.forEach((line) => {
    const roleHeading = line.match(/^###\s+(.+)$/);
    if (roleHeading) {
      activeExperience = {
        role: cleanMarkdown(roleHeading[1]),
        company: "",
        date: "",
        bullets: [],
      };
      experiences.push(activeExperience);
      subsection = "";
      return;
    }

    if (!activeExperience || !line) return;

    const cleanLine = cleanMarkdown(line);
    const boldLine = /^\*\*.+\*\*$/.test(line);
    const companyParts = cleanLine.split(/\s+\|\s+/);

    if (
      boldLine &&
      !cleanLine.includes(":") &&
      !activeExperience.company &&
      (companyParts.length > 1 || getDateFromLine(cleanLine))
    ) {
      activeExperience.company = companyParts[0].trim();
      activeExperience.date =
        companyParts.slice(1).join(" | ").trim() || getDateFromLine(cleanLine);
      subsection = "";
      return;
    }

    if (boldLine && !cleanLine.includes(":")) {
      subsection = cleanLine;
      return;
    }

    const bullet = cleanMarkdown(line);
    if (!bullet) return;

    const prefixedBullet = subsection
      ? `${subsection}: ${bullet}`
      : bullet;
    const lastBulletIndex = activeExperience.bullets.length - 1;

    if (/^\s*[-*+]\s+/.test(line)) {
      activeExperience.bullets.push(prefixedBullet);
    } else if (lastBulletIndex >= 0) {
      activeExperience.bullets[lastBulletIndex] += ` ${bullet}`;
    } else {
      activeExperience.bullets.push(prefixedBullet);
    }
  });

  return experiences;
};

const parseProjects = (lines) => {
  const projects = [];
  let activeProject = null;

  lines.forEach((line) => {
    const title = line.match(/^###\s+(.+)$/);
    if (title) {
      activeProject = {
        title: cleanMarkdown(title[1]),
        bullets: [],
        techStack: "",
      };
      projects.push(activeProject);
      return;
    }

    if (!activeProject || !line) return;

    const cleanLine = cleanMarkdown(line);
    const techStack = cleanLine.match(/^Tech Stack:\s*(.*)$/i);
    if (techStack) {
      activeProject.techStack = techStack[1].trim();
    } else {
      activeProject.bullets.push(cleanLine);
    }
  });

  return projects;
};

const parseEducation = (lines) => {
  const education = [];
  let activeEducation = null;

  lines.forEach((line) => {
    if (!line) return;

    const degree = cleanMarkdown(line);
    if (
      /^\*\*.+\*\*$/.test(line) ||
      /^(Master|Bachelor|B\.?Tech|M\.?Tech|Diploma|Ph\.?D)/i.test(degree)
    ) {
      activeEducation = {
        degree,
        institution: "",
        date: "",
      };
      education.push(activeEducation);
      return;
    }

    if (!activeEducation) return;

    const parts = degree.split(/\s+\|\s+/);
    if (parts.length > 1) {
      activeEducation.institution = parts[0].trim();
      activeEducation.date = parts.slice(1).join(" | ").trim();
    } else if (!activeEducation.institution) {
      activeEducation.institution = degree;
    } else if (!activeEducation.date && getDateFromLine(degree)) {
      activeEducation.date = getDateFromLine(degree);
    }
  });

  return education;
};

const parseAchievements = (lines) =>
  lines
    .filter(Boolean)
    .map((line) => {
      const achievement = cleanMarkdown(line);
      const parts = achievement.split(/\s+[–—-]\s+/, 2);

      return {
        title: parts[0].trim(),
        description: (parts[1] || "").trim(),
      };
    });

const parseResumeJSON = (text) => {
  const data = JSON.parse(text);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Resume JSON must be a JSON object.");
  }

  const readString = (object, key, path) => {
    const value = object[key];
    if (value === undefined || value === null) return "";
    if (typeof value !== "string") {
      throw new Error(`${path} must be a string.`);
    }
    return value;
  };

  const readItems = (key, readItem) => {
    const items = data[key];
    if (items === undefined || items === null) return [];
    if (!Array.isArray(items)) {
      throw new Error(`${key} must be an array.`);
    }

    return items.map((item, index) => {
      const path = `${key}[${index}]`;
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new Error(`${path} must be an object.`);
      }
      return readItem(item, path);
    });
  };

  const readBullets = (item, path) => {
    const bullets = item.bullets;
    if (bullets === undefined || bullets === null) return [];
    if (!Array.isArray(bullets)) {
      throw new Error(`${path}.bullets must be an array.`);
    }
    return bullets.map((bullet, index) => {
      if (typeof bullet !== "string") {
        throw new Error(`${path}.bullets[${index}] must be a string.`);
      }
      return bullet;
    });
  };

  const result = {
    name: readString(data, "name", "name"),
    location: readString(data, "location", "location"),
    email: readString(data, "email", "email"),
    phone: readString(data, "phone", "phone"),
    website: readString(data, "website", "website"),
    linkedin: readString(data, "linkedin", "linkedin"),
    github: readString(data, "github", "github"),
    summary: readString(data, "summary", "summary"),
    skills: readItems("skills", (skill, path) => ({
      category: readString(skill, "category", `${path}.category`),
      value: readString(skill, "value", `${path}.value`),
    })),
    experience: readItems("experience", (experience, path) => ({
      role: readString(experience, "role", `${path}.role`),
      company: readString(experience, "company", `${path}.company`),
      date: readString(experience, "date", `${path}.date`),
      bullets: readBullets(experience, path),
    })),
    projects: readItems("projects", (project, path) => ({
      title: readString(project, "title", `${path}.title`),
      bullets: readBullets(project, path),
      techStack: readString(project, "techStack", `${path}.techStack`),
    })),
    education: readItems("education", (education, path) => ({
      degree: readString(education, "degree", `${path}.degree`),
      institution: readString(education, "institution", `${path}.institution`),
      date: readString(education, "date", `${path}.date`),
    })),
    achievements: readItems("achievements", (achievement, path) => ({
      title: readString(achievement, "title", `${path}.title`),
      description: readString(achievement, "description", `${path}.description`),
    })),
  };

  if (
    !result.name &&
    !result.summary &&
    !result.skills.length &&
    !result.experience.length &&
    !result.projects.length &&
    !result.education.length &&
    !result.achievements.length
  ) {
    throw new Error("No resume information was found in the JSON.");
  }

  return result;
};

export function parseResumeText(text) {
  const normalizedText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  if (normalizedText.startsWith("{")) {
    return parseResumeJSON(normalizedText);
  }

  const lines = normalizedText.split(/\r?\n/).map((line) => line.trim());
  const firstSectionIndex = lines.findIndex((line) => /^##\s+/.test(line));
  const preamble = (firstSectionIndex < 0
    ? lines
    : lines.slice(0, firstSectionIndex)
  ).filter(Boolean);
  const nameLine = preamble.find((line) => /^#\s+/.test(line));
  const name = nameLine ? cleanMarkdown(nameLine) : "";
  const contactLines = preamble.filter((line) => line !== nameLine);
  const contactText = contactLines.map(cleanMarkdown).join("\n");
  const sections = getSections(lines);

  const contactValue = (label) => {
    const line = contactLines.find((item) =>
      new RegExp(`^${label}:`, "i").test(cleanMarkdown(item))
    );
    return line
      ? cleanMarkdown(line).replace(new RegExp(`^${label}:\\s*`, "i"), "")
      : "";
  };
  const contactFirstLine = cleanMarkdown(contactLines[0] || "");
  const location = contactFirstLine
    .split("|")[0]
    .trim()
    .replace(/^(Website|LinkedIn|GitHub):\s*/i, "");
  const email = contactText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = contactText.match(/\+?\d[\d\s().-]{7,}\d/)?.[0]?.trim() || "";
  const linkedin = contactValue("LinkedIn") ||
    contactText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|]+/i)?.[0] ||
    "";
  const github = contactValue("GitHub") ||
    contactText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/i)?.[0] ||
    "";

  const skills = (sections.skills || [])
    .filter(Boolean)
    .reduce((items, line) => {
      const cleanLine = cleanMarkdown(line);
      const separator = cleanLine.indexOf(":");

      if (separator > 0) {
        items.push({
          category: cleanLine.slice(0, separator).trim(),
          value: cleanLine.slice(separator + 1).trim(),
        });
      } else if (items.length) {
        items[items.length - 1].value += ` ${cleanLine}`;
      }

      return items;
    }, []);

  const result = {
    name,
    location,
    email,
    phone,
    website: contactValue("Website"),
    linkedin,
    github,
    summary: (sections.summary || []).map(cleanMarkdown).filter(Boolean).join(" "),
    skills,
    experience: parseExperience(sections.experience || []),
    projects: parseProjects(sections.projects || []),
    education: parseEducation(sections.education || []),
    achievements: parseAchievements(sections.achievements || []),
  };

  if (
    !result.name &&
    !result.summary &&
    !result.skills.length &&
    !result.experience.length &&
    !result.projects.length &&
    !result.education.length &&
    !result.achievements.length
  ) {
    throw new Error("No resume sections were recognized. Check the pasted format.");
  }

  return result;
}
