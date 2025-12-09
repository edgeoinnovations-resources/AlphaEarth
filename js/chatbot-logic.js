import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
// Data loaded from window global
// import { alphaEarthContext, caseStudies } from "./chatbot-data.js";

// --- CONFIGURATION ---
const API_KEY = "AIzaSyDk-1St9e7QN5gMscjJeba2D6iYb3DsO8I";

// SDK Initialization
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- STATE MANAGEMENT ---
let chatWindow, messagesDiv, inputField;

document.addEventListener("DOMContentLoaded", () => {
    chatWindow = document.getElementById('ae-chatbot-container');
    messagesDiv = document.getElementById('ae-chat-messages');
    inputField = document.getElementById('ae-chat-input');

    document.getElementById('ae-chat-toggle').onclick = () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    };
    document.getElementById('ae-chat-close').onclick = () => {
        chatWindow.style.display = 'none';
    };
    document.getElementById('ae-chat-send').onclick = sendMessage;
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

// --- HELPER: Find Active Case Study ---
function getActiveContext() {
    const map = window.map || (window.App && window.App.map);
    if (!map) return "Map state unavailable.";

    const center = map.getCenter();
    const currentZoom = map.getZoom();

    let nearestStudy = null;
    let minDist = 100000;

    caseStudies.features.forEach(feature => {
        const [lon, lat] = feature.geometry.coordinates;
        const dist = Math.sqrt(Math.pow(lon - center.lng, 2) + Math.pow(lat - center.lat, 2));

        if (dist < 2.0 && dist < minDist) {
            minDist = dist;
            nearestStudy = feature.properties;
        }
    });

    let context = `MAP CENTER: Lat ${center.lat.toFixed(4)}, Lon ${center.lng.toFixed(4)}, Zoom ${currentZoom.toFixed(1)}\n`;

    if (nearestStudy) {
        context += `ACTIVE CASE STUDY: ${nearestStudy.name}\nINFO: ${nearestStudy.explainer}\n`;
    }
    return context;
}

// --- CORE: Send Message ---
async function sendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user');
    inputField.value = '';
    const loadingId = appendMessage("Thinking...", 'bot', true);

    const dynamicContext = getActiveContext();
    const prompt = `
    SYSTEM: ${alphaEarthContext.introduction}
    MODES: ${JSON.stringify(alphaEarthContext.modes)}
    CONTEXT: ${dynamicContext}
    USER: "${userText}"
    Keep answer under 3 sentences unless asked for detail.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        removeMessage(loadingId);
        appendMessage(response.text(), 'bot');
    } catch (error) {
        removeMessage(loadingId);
        console.error("Gemini Error:", error);
        appendMessage("Error: " + (error.message || JSON.stringify(error)), 'bot');
    }
}

// --- UI HELPERS ---
function appendMessage(text, sender, isTemp = false) {
    const div = document.createElement('div');
    div.className = `ae-message ${sender}`;
    div.innerText = text;
    if (isTemp) div.id = 'temp-loading';
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return div.id;
}

function removeMessage(id) {
    const el = document.getElementById('temp-loading');
    if (el) el.remove();
}
