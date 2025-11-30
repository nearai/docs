#!/usr/bin/env node
/**
 * Fetches models from the API at build time.
 * Run before building docs to get the latest model data.
 */

const fs = require("fs");
const path = require("path");

const API_URL = "https://cloud-api.near.ai/v1/model/list";
const OUTPUT_PATH = path.join(__dirname, "../src/data/models.json");

async function fetchModels() {
  console.log("Fetching models from API...");

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the models data
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));

    console.log(`✓ Saved ${data.models?.length || 0} models to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("Failed to fetch models:", error.message);

    // If fetch fails, create a placeholder file so build doesn't break
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (!fs.existsSync(OUTPUT_PATH)) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ models: [] }, null, 2));
      console.log("Created empty models.json placeholder");
    }

    process.exit(1);
  }
}

fetchModels();
