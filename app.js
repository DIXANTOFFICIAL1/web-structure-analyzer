import { calculateMetrics } from "./modules/matrics.js";
import { analyzeSEO } from "./modules/seo.js";
import { checkAccessibility } from "./modules/accessibility.js";
import { checkSecurity } from "./modules/security.js";
import { renderChart } from "./modules/charts.js";
import { exportReport } from "./modules/export.js";

const fileInput = document.getElementById("fileInput");
const codeInput = document.getElementById("codeInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const dropArea = document.getElementById("dropArea");
const themeToggle = document.getElementById("themeToggle");
const exportBtn = document.getElementById("exportBtn");

let analysisResult = {};

themeToggle.onclick = () => {
document.body.classList.toggle("dark");
};

// DRAG & DROP
dropArea.addEventListener("dragover", e => {
e.preventDefault();
});

dropArea.addEventListener("drop", async e => {
e.preventDefault();

const file = e.dataTransfer.files[0];
const content = await file.text();

analyze(content);
});

fileInput.addEventListener("change", async () => {
const file = fileInput.files[0];
if (!file) return;

const content = await file.text();
analyze(content);
});

// BUTTON CLICK
analyzeBtn.onclick = async () => {

let content = codeInput.value;

if (fileInput.files.length > 0) {
content = await fileInput.files[0].text();
}

if (!content) {
alert("Provide HTML input");
return;
}

analyze(content);
};

function analyze(content) {

console.log("Analyzing...");

document.getElementById("preview").srcdoc = content;

const metrics = calculateMetrics(content);
const seo = analyzeSEO(content);
const accessibility = checkAccessibility(content);
const security = checkSecurity(content);

analysisResult = {
metrics,
seo,
accessibility,
security
};

renderResults();
renderChart(metrics.tagCounts);
}

function renderResults() {

document.getElementById("metrics").innerHTML =
`
Lines: ${analysisResult.metrics.lines}<br>
Words: ${analysisResult.metrics.words}<br>
Characters: ${analysisResult.metrics.characters}
`;

document.getElementById("seo").innerHTML =
`
Title Tag: ${analysisResult.seo.hasTitle ? "Yes" : "No"}<br>
Meta Description: ${analysisResult.seo.hasMetaDesc ? "Yes" : "No"}
`;

document.getElementById("accessibility").innerHTML =
`
Missing ALT attributes: ${analysisResult.accessibility.missingAlt}
`;

document.getElementById("security").innerHTML =
`
Inline JS handlers: ${analysisResult.security.inlineJS}
`;
}

// EXPORT
exportBtn.onclick = () => {
exportReport(analysisResult);
};
