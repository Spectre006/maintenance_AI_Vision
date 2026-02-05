const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const previewImage = document.getElementById("previewImage");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const summary = document.getElementById("summary");
const confidenceValue = document.getElementById("confidenceValue");
const analysisStatus = document.getElementById("analysisStatus");
const tags = document.getElementById("tags");
const dropzone = document.getElementById("dropzone");

const MAX_FILE_SIZE = 8 * 1024 * 1024;
let selectedFile = null;

const setStatus = (text, isError = false) => {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#f87171" : "";
};

const formatBytes = (bytes) => {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const resetResults = () => {
  summary.value = "";
  confidenceValue.textContent = "--";
  analysisStatus.textContent = "Idle";
  tags.innerHTML = "";
};

const setFile = (file) => {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus("Please upload a valid image file.", true);
    analyzeBtn.disabled = true;
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    setStatus("Image is too large. Max size is 8 MB.", true);
    analyzeBtn.disabled = true;
    return;
  }

  selectedFile = file;
  previewImage.src = URL.createObjectURL(file);
  preview.classList.add("has-image");
  fileName.textContent = file.name;
  fileSize.textContent = formatBytes(file.size);
  analyzeBtn.disabled = false;
  setStatus("Ready to analyze.");
  resetResults();
};

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  setFile(file);
});

["dragenter", "dragover"].forEach((evt) => {
  dropzone.addEventListener(evt, (event) => {
    event.preventDefault();
    dropzone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropzone.addEventListener(evt, (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragover");
  });
});

dropzone.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];
  setFile(file);
});

const renderTags = (items) => {
  tags.innerHTML = "";
  if (!items || !items.length) return;
  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = item;
    tags.appendChild(chip);
  });
};

analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  analyzeBtn.disabled = true;
  analysisStatus.textContent = "Analyzing";
  setStatus("Analyzing image with Vision AI...");

  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Analysis failed");
    }

    const data = await response.json();
    summary.value = data.summary || "";
    confidenceValue.textContent = data.confidence ?? "--";
    analysisStatus.textContent = "Complete";
    renderTags(data.parameters || []);
    setStatus("Analysis complete. Review and edit the summary.");
  } catch (error) {
    analysisStatus.textContent = "Error";
    setStatus(error.message || "Something went wrong.", true);
  } finally {
    analyzeBtn.disabled = false;
  }
});
