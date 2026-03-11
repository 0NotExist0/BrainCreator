/**
 * BRAIN CREATOR - CLOUD ENGINE
 * Implementazione professionale per integrazione Google Drive API
 */

// CONFIGURAZIONE CREDENZIALI
const API_KEY = 'AIzaSyAg3m_J2pb4P8KZBOLnkU-7xbT6vilvUm8'; 
const CLIENT_ID = 'INSERISCI_QUI_IL_TUO_CLIENT_ID.apps.googleusercontent.com'; 
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Inizializzazione Google API Client (GAPI)
 */
function gapiLoaded() {
    gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
    });
}

/**
 * Inizializzazione Google Identity Services (GIS)
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Definito all'attivazione del login
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        logMessage("SDK Google caricati con successo.");
    }
}

/**
 * Gestione Autenticazione Reale
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            logMessage("Errore Autenticazione: " + resp.error, "error");
            throw (resp);
        }
        document.getElementById('drive-status').textContent = "Connesso a Drive";
        document.getElementById('drive-status').style.color = "#34a853";
        document.getElementById('status-title').textContent = "Sistema Online";
        logMessage("Accesso autorizzato. Token ricevuto.");
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 * Metodo di creazione del "Cervello" su Google Drive
 */
async function deployBrain() {
    if (!gapi.client.getToken()) {
        logMessage("Attenzione: Devi prima connettere l'account.", "error");
        handleAuthClick();
        return;
    }

    const name = document.getElementById('brain-name').value || "Unnamed-Brain";
    const role = document.getElementById('brain-role').value;
    const temp = document.getElementById('temp-slider').value;

    const brainConfig = {
        meta: { name, version: "1.0.0", creator: "BrainCreator" },
        logic: { role, temperature: temp / 100 },
        timestamp: new Date().toISOString()
    };

    toggleUIState(true);
    logMessage(`Inizio deploy: ${name}.json...`);

    try {
        // Creazione Metadata
        const fileMetadata = {
            name: `${name}.json`,
            mimeType: 'application/json'
        };

        // Caricamento su Drive
        const response = await gapi.client.drive.files.create({
            resource: fileMetadata,
            media: {
                mimeType: 'application/json',
                body: JSON.stringify(brainConfig)
            }
        });

        if (response.status === 200) {
            logMessage(`Deploy completato! ID File: ${response.result.id}`);
            finalizeUI(name);
        }
    } catch (err) {
        logMessage("Errore Cloud: " + err.message, "error");
        toggleUIState(false);
    }
}

/**
 * Utility: Logging nel terminale UI
 */
function logMessage(msg, type = 'info') {
    const output = document.getElementById('log-output');
    const line = document.createElement('div');
    line.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    if (type === 'error') line.style.color = '#ff4d4d';
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

/**
 * Gestione stati dell'interfaccia
 */
function toggleUIState(isWorking) {
    const btn = document.getElementById('create-btn');
    const progress = document.getElementById('upload-progress');
    btn.disabled = isWorking;
    progress.style.display = isWorking ? 'block' : 'none';
    if (isWorking) {
        document.getElementById('fill-bar').style.width = '100%';
    }
}

function finalizeUI(name) {
    toggleUIState(false);
    document.getElementById('main-ring').style.background = "#34a853";
    document.getElementById('status-title').textContent = "Deploy Eseguito";
    document.getElementById('status-desc').textContent = `Il cervello ${name} è ora ospitato nel tuo Cloud.`;
}

// Event Listeners
document.getElementById('drive-connect').addEventListener('click', handleAuthClick);
document.getElementById('create-btn').addEventListener('click', deployBrain);
