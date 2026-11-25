import { useEffect, useState } from "react";
import {
  getProfile,
  getSkills,
  getExperience,
  getTools,
  getSocials,
  getStats,
  getColors
} from "../services/googleSheets";

export default function usePortfolioData() {
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [data, setData] = useState({
    profile: null,
    skills: [],
    experience: [],
    tools: [],
    socials: [],
    stats:[],
    colors: null
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        let colorsError = null;
        const [
          profile,
          skills,
          experience,
          tools,
          socials,
          stats,
          colors
        ] = await Promise.all([
          getProfile(),
          getSkills(),
          getExperience(),
          getTools(),
          getSocials(),
          getStats(),
          getColors().catch((loadError) => {
            colorsError = loadError;
            return null;
          })
        ]);

        if (active) {
          setData({
            profile,
            skills,
            experience,
            tools,
            socials,
            stats,
            colors
          });
          setError(
            colorsError
              ? `Could not load the color theme. Using the default palette. ${colorsError.message}`
              : ""
          );
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError.message ||
              "Could not load portfolio data. Please check the Google Sheets configuration."
          );
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [retryCount]);

  return { ...data, error, retry: () => setRetryCount((count) => count + 1) };
}