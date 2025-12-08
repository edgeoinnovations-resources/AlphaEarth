import { GoogleGenAI } from "https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm";
import { alphaEarthContext, caseStudies } from "./chatbot-data.js";

// --- CONFIGURATION ---
// REPLACE THIS with your specific "Green" API Key
const API_KEY = "AIzaSyAa-lWVCNKF5iiK938tPHWyjmdyrE_4zLs";

// New SDK Initialization
const client = new GoogleGenAI({ apiKey: API_KEY });

// --- STATE MANAGEMENT ---
const chatWindow = document.getElementById('ae-chatbot-container');
const messagesDiv = document.getElementById('ae-chat-messages');
const inputField = document.getElementById('ae-chat-input');

// --- HELPER: Find Active Case Study ---
function getActiveContext() {
    if (!window.map) return "Map state unavailable.";

    const center = window.map.getCenter();
    const currentZoom = window.map.getZoom();

    let nearestStudy = null;
    let minDist = 100000;

    // Find nearest case study within ~2 degrees
    caseStudies.features.forEach(feature => {
        const [lon, lat] = feature.geometry.coordinates;
        const dist = Math.sqrt(Math.pow(lon - center.lng, 2) + Math.pow(lat - center.lat, 2));

        if (dist < 2.0 && dist < minDist) {
            minDist = dist;
            nearestStudy = feature.properties;
        }
    });

    // Build Context String
    let context = `
    CURRENT MAP STATE:
    - Center: Lat ${center.lat.toFixed(4)}, Lon ${center.lng.toFixed(4)}
    - Zoom Level: ${currentZoom.toFixed(1)}
    `;

    if (nearestStudy) {
        context += `
    ACTIVE CASE STUDY DETECTED:
    - Name: "${nearestStudy.name}"
    - Category: ${nearestStudy.category}
    - Analysis Mode: ${nearestStudy.analysis}
    - Key Observation: "${nearestStudy.observation}"
    - Explanation Data: "${nearestStudy.explainer}"
        `;
    } else {
        context += `\nUser is exploring freely (no specific case study active).`;
    }

    return context;
}

// --- CORE: Send Message (New SDK Syntax) ---
async function sendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;

    // 1. UI: Add User Message
    appendMessage(userText, 'user');
    inputField.value = '';

    // 2. UI: Add Loading Indicator
    const loadingId = appendMessage("Thinking...", 'bot', true);

    // 3. Logic: Build Prompt
    const dynamicContext = getActiveContext();
    const fullPrompt = `
    SYSTEM INSTRUCTIONS:
    ${alphaEarthContext.introduction}

    INTERPRETATION MODES:
    ${JSON.stringify(alphaEarthContext.modes)}

    ${dynamicContext}

    USER QUESTION: "${userText}"

    GUIDELINES:
    - Be concise (under 3 sentences) unless asked for detail.
    - If a Case Study is active, use the "Explanation Data".
    `;

    try {
        // 4. API: Call Gemini (NEW SDK METHOD)
        const response = await client.models.generateContent({
            model: 'models/gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            config: {
                temperature: 0.7,
            }
        });

        // 5. Logic: Parse Response (New SDK property)
        // The new SDK returns the text directly on the response object property
        const botText = response.text || "I couldn't generate a response.";

        // 6. UI: Update Chat
        removeMessage(loadingId);
        appendMessage(botText, 'bot');

    } catch (error) {
        removeMessage(loadingId);
        console.error("Gemini Error:", error);
        appendMessage("Error: " + (error.message || "Connection failed."), 'bot');
    }
}

// --- UI HELPERS ---
function appendMessage(text, sender, isTemp = false) {
    const div = document.createElement('div');
    div.classList.add('ae-message', sender);
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

// --- EVENT LISTENERS ---
// Initialize only after DOM is ready
if (document.getElementById('ae-chat-toggle')) {
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
}
