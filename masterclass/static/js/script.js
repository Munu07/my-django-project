let appData = null;
let currentProgram = null;
let animationRunning = false;

/* ================= UTILITIES ================= */

async function fetchData() {
    if (appData) return appData;

    try {
        const response = await fetch("/static/data.json"); // Django static path
        if (!response.ok) throw new Error(`Failed to load JSON: ${response.status}`);

        let data;
        try {
            data = await response.json();
        } catch (jsonErr) {
            throw new Error("Invalid JSON format: " + jsonErr.message);
        }

        appData = data;
        return appData;
    } catch (err) {
        console.error("JSON Load Error:", err);
        return null;
    }
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

function safe(id) {
    return document.getElementById(id);
}

/* ================= HOMEPAGE ================= */

async function loadHomepage() {
    const data = await fetchData();
    const container = safe("sections-container");
    if (!data || !container) return;

    container.innerHTML = "";

    data.sections.forEach(section => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h2>${section.title}</h2>
            <p>${section.description || ""}</p>
        `;

        card.onclick = () => {
            window.location.href = `/section/?id=${section.id}`;
        };

        container.appendChild(card);
    });
}

/* ================= SECTION ================= */

async function loadSectionFromURL() {
    const params = new URLSearchParams(window.location.search);
    const sectionId = params.get('id');
    if (!sectionId) return;

    const data = await fetchData();
    if (!data) return;

    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;

    if (safe("section-title"))
        safe("section-title").textContent = section.title;

    populateSidebar(sectionId, null);
}

/* ================= SIDEBAR ================= */

async function populateSidebar(sectionId, currentTopicId) {
    const data = await fetchData();
    if (!data) return;

    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;

    const navList = document.querySelector(".sidebar-nav ul");
    if (!navList) return;

    navList.innerHTML = "";

    if (!section.topics || section.topics.length === 0) {
        navList.innerHTML = "<li>No topics found.</li>";
        return;
    }

    section.topics.forEach(topic => {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = `/topic/?section=${sectionId}&topic=${topic.id}`;
        a.textContent = topic.title;

        if (topic.id === currentTopicId)
            a.classList.add("active");

        li.appendChild(a);
        navList.appendChild(li);
    });
}

/* ================= TOPIC ================= */

async function loadTopicFromURL() {
    const params = new URLSearchParams(window.location.search);
    const sectionId = params.get('section');
    const topicId = params.get('topic');
    if (!sectionId || !topicId) return;

    const data = await fetchData();
    if (!data) return;

    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;

    const topic = section.topics.find(t => t.id === topicId);
    if (!topic) return;

    if (safe("topic-title"))
        safe("topic-title").textContent = topic.title;

    if (safe("explanation-text"))
        safe("explanation-text").textContent = topic.explanation || "";

    if (safe("syntax-code"))
        safe("syntax-code").textContent = topic.syntax || "";

    if (safe("example-code"))
        safe("example-code").textContent = topic.example || "";

    if (safe("logic-text"))
        safe("logic-text").textContent = topic.logic || "";

    const exList = safe("exercises-list");
    if (exList && topic.exercises) {
        exList.innerHTML =
            topic.exercises.map(ex => `<li>${ex}</li>`).join("");
    }

    populateSidebar(sectionId, topicId);

    if (window.Prism) Prism.highlightAll();
}

/* ================= PRACTICE ================= */

function loadProgram(program) {
    currentProgram = program;
    if (!program) return;

    if (safe("prog-title"))
        safe("prog-title").textContent = program.title;

    if (safe("prog-statement"))
        safe("prog-statement").textContent = program.statement;

    if (safe("prog-input"))
        safe("prog-input").textContent = program.input || "N/A";

    if (safe("prog-output"))
        safe("prog-output").textContent = program.output || "N/A";

    resetPracticeUI();
}

function resetPracticeUI() {
    if (safe("logic-box"))
        safe("logic-box").style.display = "none";

    if (safe("solution-box"))
        safe("solution-box").style.display = "none";

    const panel = safe("animation-panel");
    if (panel) {
        panel.classList.remove("active");
        panel.innerHTML = "";
    }
}

/* ================= SAFE JAVA SIMULATION ================= */

async function runJavaProgram() {
    const code = document.getElementById("java-editor").value;
    const outputBox = document.getElementById("program-output");
    outputBox.textContent = "Running...";

    try {
       const response = await fetch("/api/run-java/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
});


        const text = await response.text();

        // Attempt to parse JSON safely
        let data;
        try {
            data = JSON.parse(text);
        } catch (jsonErr) {
            console.error("Non-JSON response from server:", text);
            throw new Error("Server response is not valid JSON");
        }

        outputBox.textContent = data.output || "No output returned.";

    } catch (err) {
        console.error("Error running Java program:", err);
        outputBox.textContent = "Error running Java code. Check console for details.";
    }
}

/* ================= STEP EXECUTION ================= */

function showStepExecution() {
    const editor = safe("java-editor");
    const stepBox = safe("step-output");

    if (!editor || !stepBox) return;

    stepBox.innerHTML = "";

    const lines = editor.value.split("\n");

    lines.forEach((line, index) => {
        const div = document.createElement("div");
        div.textContent = `Step ${index + 1}: ${line.trim()}`;
        stepBox.appendChild(div);
    });
}

/* ================= DOM READY INITIALIZATION ================= */

document.addEventListener('DOMContentLoaded', () => {
    if (safe("sections-container")) {
        loadHomepage();
    } else if (safe("section-title")) {
        loadSectionFromURL();
    } else if (safe("topic-title")) {
        loadTopicFromURL();
    }
});
