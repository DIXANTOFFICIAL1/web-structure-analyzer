const fileInput = document.getElementById("fileInput");
const codeInput = document.getElementById("codeInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const themeToggle = document.getElementById("themeToggle");
const exportBtn = document.getElementById("exportBtn");

let analysisResult = {};

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

analyzeBtn.onclick = async () => {
  let content = codeInput.value;

  if (fileInput.files.length > 0) {
    content = await fileInput.files[0].text();
  }

  if (!content) return alert("Provide HTML input!");

  analyze(content);
};

function analyze(content) {

  const lines = content.split("\n");
  const words = content.split(/\s+/).length;
  const charCount = content.length;
  const tagMatches = content.match(/<(\w+)/g) || [];

  const tagCounts = {};
  tagMatches.forEach(tag => {
    const clean = tag.replace("<","").toLowerCase();
    tagCounts[clean] = (tagCounts[clean] || 0) + 1;
  });

  const hasTitle = /<title>.*<\/title>/i.test(content);
  const hasMetaDesc = /<meta\s+name="description"/i.test(content);
  const missingAlt = (content.match(/<img(?![^>]*alt=)/g) || []).length;
  const inlineJS = (content.match(/onclick=|onload=/g) || []).length;

  analysisResult = {
    lines: lines.length,
    words,
    characters: charCount,
    tags: tagCounts,
    seo: { hasTitle, hasMetaDesc },
    accessibility: { missingAlt },
    security: { inlineJS }
  };

  renderResults();
  renderChart(tagCounts);
}

function renderResults() {

  document.getElementById("metrics").innerHTML = `
    <p>Lines: ${analysisResult.lines}</p>
    <p>Words: ${analysisResult.words}</p>
    <p>Characters: ${analysisResult.characters}</p>
  `;

  document.getElementById("seo").innerHTML = `
    <p>Title Tag: ${analysisResult.seo.hasTitle ? "✔" : "❌"}</p>
    <p>Meta Description: ${analysisResult.seo.hasMetaDesc ? "✔" : "❌"}</p>
  `;

  document.getElementById("accessibility").innerHTML = `
    <p>Missing ALT Attributes: ${analysisResult.accessibility.missingAlt}</p>
  `;

  document.getElementById("security").innerHTML = `
    <p>Inline JS Handlers: ${analysisResult.security.inlineJS}</p>
  `;
}

function renderChart(tagCounts) {
  const ctx = document.getElementById("tagChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(tagCounts),
      datasets: [{
        label: "Tag Frequency",
        data: Object.values(tagCounts)
      }]
    }
  });
}

exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "analysis-report.json";
  a.click();
};
