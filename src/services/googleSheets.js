// src/services/googleSheets.js

import axios from "axios";

const SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID?.trim();

const getBaseUrl = () => {
  if (!SHEET_ID || SHEET_ID === "your_google_sheet_id") {
    throw new Error(
      "Google Sheets is not configured. Set REACT_APP_GOOGLE_SHEET_ID in your .env.local file and restart the development server."
    );
  }

  return `https://opensheet.elk.sh/${SHEET_ID}`;
};

const getSheet = async (sheetName) => {
  try {
    const response = await axios.get(`${getBaseUrl()}/${sheetName}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Could not load the "${sheetName}" worksheet (HTTP ${error.response.status}). Check the spreadsheet ID, worksheet tab name, and sharing permissions.`
      );
    }

    throw error;
  }
};

export const getProfile = async () => {
  const rows = await getSheet("Profile");
  return rows[0];
};

export const getSkills = async () => {
  return getSheet("Skills");
};

export const getExperience = async () => {
  return getSheet("Experience");
};

export const getTools = async () => {
  return getSheet("Tools");
};

export const getSocials = async () => {
  return getSheet("Socials");
};

export const getStats = async () => {
  return getSheet("Stats");
};

export const getColors = async () => {
  const rows = await getSheet("Colors");
  const colors = rows.map((row) => ({
    role: row.Role?.trim(),
    hex: row.Hex?.trim()
  }));
  const validHex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  if (colors.some(({ hex }) => !hex || !validHex.test(hex))) {
    throw new Error(
      'The "Colors" worksheet contains an invalid color. Use 3- or 6-digit hex values such as #5B5CE2.'
    );
  }

  const primary = colors.find(
    ({ role }) => role?.toLowerCase() === "primary"
  );
  const secondary = colors.find(
    ({ role }) => role?.toLowerCase() === "secondary"
  );

  if (!primary || !secondary) {
    throw new Error(
      'The "Colors" worksheet must include rows with Role values "Primary" and "Secondary".'
    );
  }

  return {
    primary: primary.hex,
    secondary: secondary.hex,
    palette: colors.map(({ hex }) => hex)
  };
};