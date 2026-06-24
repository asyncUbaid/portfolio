// src/services/googleSheets.js

import axios from "axios";

const SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID;

const BASE_URL = `https://opensheet.elk.sh/${SHEET_ID}`;

export const getProfile = async () => {   
  const response = await axios.get(`${BASE_URL}/Profile`);
  return response.data[0];
};

export const getSkills = async () => {
  const response = await axios.get(`${BASE_URL}/Skills`);
  return response.data;
};

export const getExperience = async () => {
  const response = await axios.get(`${BASE_URL}/Experience`);
  return response.data;
};

export const getTools = async () => {
  const response = await axios.get(`${BASE_URL}/Tools`);
  return response.data;
};

export const getSocials = async () => {
  const response = await axios.get(`${BASE_URL}/Socials`);
  return response.data;
};

export const getStats = async () => {
  const response = await axios.get(`${BASE_URL}/Stats`);
  return response.data;
};