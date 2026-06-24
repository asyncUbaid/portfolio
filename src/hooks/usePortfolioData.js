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
  const [data, setData] = useState({
    profile: null,
    skills: [],
    experience: [],
    tools: [],
    socials: [],
    stats:[]
  });

  useEffect(() => {
    async function loadData() {
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

      setData({
        profile,
        skills,
        experience,
        tools,
        socials,
        stats
      });
    }

    loadData();
  }, []);

  return data;
}