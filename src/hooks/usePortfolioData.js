import { useEffect, useState } from "react";
import {
  getProfile,
  getSkills,
  getExperience,
  getTools,
  getSocials,
  getStats
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
    stats:[]
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [
          profile,
          skills,
          experience,
          tools,
          socials,
          stats
        ] = await Promise.all([
          getProfile(),
          getSkills(),
          getExperience(),
          getTools(),
          getSocials(),
          getStats()
        ]);

        if (active) {
          setData({
            profile,
            skills,
            experience,
            tools,
            socials,
            stats
          });
          setError("");
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