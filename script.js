/**
 * BRAIN CREATOR - CLOUD ENGINE
 * Integrazione reale con Google Drive API v3
 */

const CONFIG = {
    API_KEY: 'AIzaSyAg3m_J2pb4P8KZBOLnkU-7xbT6vilvUm8',
    CLIENT_ID: '819190259473-aka5j4abtiu6t5e9sdrm32ukke4pt69f.apps.googleusercontent.com',
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/drive.file'
};

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Inizializza la libreria GAPI (API Client)
 */
function gapiLoaded() {
    gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: CONFIG.API_KEY,
            discoveryDocs: [CONFIG.DISCOVERY_DOC],
        });
        gapiInited = true;
        logMessage("Libreria Google Drive caricata.");
    });
}

/**
 * Inizializza il client di identità (GIS)
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.CLIENT_ID,
        scope: CONFIG.SCOPES,
        callback: '', // Impostato dinamicamente al login
    });
    gisInited = true;
    logMessage("Sistema di Autenticazione pronto.");
}

/**
 * Gestisce l'accesso con l'account Google
 */
function handleAuth() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            logMessage("Errore Login: " + resp.error, "error");
            throw (resp);
        }
        document.getElementById('drive-status').textContent = "Stato: Connesso";
        document.getElementById('drive-status').style.color = "#34a853";
        document.getElementById('status-title').textContent = "Sistema Online";
        logMessage("Accesso autorizzato correttamente.");
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 * Esegue il salvataggio del file JSON su Drive
 */
async function deployBrain() {
    if (!gapi.client.getToken()) {
        logMessage("Errore: Autenticazione richiesta.", "error");
        handleAuth();
        return;
    }

    const name = document.getElementById('brain-name').value || "New_Brain_IA";
    const role = document.getElementById('brain-role').value;
    const temp = document.getElementById('temp-slider').value;

    const brainData = {
        core_id: Math.random().toString(36).substr(2, 9),
        brain_name: name,
        settings: { role, temperature: temp / 100 },
        created_at: new Date().toISOString()
    };

    // UI Feedback
    const progress = document.getElementById('upload-progress');
    const fill = document.getElementById('fill-bar');
    const btn = document.getElementById('create-btn');
    
    btn.disabled = true;
    progress.style.display = 'block';
    fill.style.width = '40%';
    
    logMessage(`Sincronizzazione di '${name}' in corso...`);

    try {
        const fileMetadata = {
            name: `${name}.json`,
            mimeType: 'application/json'
        };

        // Chiamata alle API Drive per creare il file
        const response = await gapi.client.drive.files.create({
            resource: fileMetadata,
            media: {
                mimeType: 'application/json',
                body: JSON.stringify(brainData)
            }
        });

        if (response.status === 200) {
            fill.style.width = '100%';
            logMessage(`DEPLOY COMPLETATO. ID File: ${response.result.id}`);
            
            // Aggiorna interfaccia finale
            document.getElementById('main-ring').style.background = "#34a853";
            document.getElementById('status-title').textContent = "Cervello Attivo";
            document.getElementById('status-desc').textContent = `File configurato correttamente su Drive.`;
        }
    } catch (err) {
        logMessage("Errore Cloud: " + err.message, "error");
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            progress.style.display = 'none';
            fill.style.width = '0%';
        }, 2000);
    }
}

/**
 * Scrive messaggi nel terminale UI
 */
function logMessage(msg, type = 'info') {
    const out = document.getElementById('log-output');
    const line = document.createElement('div');
    line.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    if (type === 'error') line.style.color = '#ff4d4d';
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

// Event Listeners
document.getElementById('drive-connect').addEventListener('click', handleAuth);
document.getElementById('create-btn').addEventListener('click', deployBrain);
