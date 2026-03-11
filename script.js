/**
 * BRAIN CREATOR - CREATION & DEPLOY ENGINE (script.js)
 */

const CONFIG = {
    API_KEY: 'AIzaSyAg3m_J2pb4P8KZBOLnkU-7xbT6vilvUm8',
    CLIENT_ID: '819190259473-aka5j4abtiu6t5e9sdrm32ukke4pt69f.apps.googleusercontent.com',
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/drive.file'
};

let tokenClient, gapiInited = false, gisInited = false;

function gapiLoaded() { 
    gapi.load('client', async () => { 
        await gapi.client.init({ 
            apiKey: CONFIG.API_KEY, 
            discoveryDocs: [CONFIG.DISCOVERY_DOC] 
        }); 
        gapiInited = true; 
        logMsg("GAPI Pronta."); 
    }); 
}

function gisLoaded() { 
    tokenClient = google.accounts.oauth2.initTokenClient({ 
        client_id: CONFIG.CLIENT_ID, 
        scope: CONFIG.SCOPES, 
        callback: '' 
    }); 
    gisInited = true; 
    logMsg("GIS Pronta."); 
}

function handleAuth() {
    if (!gisInited) {
        logMsg("Attendi il caricamento dei servizi Google...", "error");
        return;
    }

    tokenClient.callback = async (resp) => {
        if (resp.error) return logMsg("Errore Login: " + resp.error, "error");
        document.getElementById('drive-status').textContent = "Connesso";
        document.getElementById('drive-status').style.color = "var(--accent-success)";
        logMsg("Accesso Drive autorizzato.");
    };

    // Forza il popup se non c'è già un token attivo
    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

async function deployBrain() {
    if (!gapi.client.getToken()) {
        logMsg("Devi prima effettuare il log-in.", "error");
        return handleAuth();
    }

    const name = document.getElementById('brain-name').value || "Core-Neurale";
    const role = document.getElementById('brain-role').value;
    const temp = document.getElementById('temp-slider').value;

    const brainData = { name, role, temp, createdAt: new Date().toISOString() };
    
    // UI Feedback
    document.getElementById('create-btn').style.display = 'none';
    document.getElementById('upload-progress').style.display = 'block';
    document.getElementById('fill-bar').style.width = '50%';
    logMsg(`Compilazione ${name} in corso...`);

    try {
        const fileMetadata = { name: `${name}.json`, mimeType: 'application/json' };
        const response = await gapi.client.drive.files.create({
            resource: fileMetadata, 
            media: { mimeType: 'application/json', body: JSON.stringify(brainData) }
        });

        if (response.status === 200) {
            document.getElementById('fill-bar').style.width = '100%';
            logMsg(`Salvataggio cloud completato (ID: ${response.result.id}).`);
            
            // SALVATAGGIO LOCALE PER LA CHAT
            localStorage.setItem('activeBrain', JSON.stringify(brainData));
            
            setTimeout(() => {
                document.getElementById('upload-progress').style.display = 'none';
                document.getElementById('launch-btn').style.display = 'block'; // Mostra tasto avvio
                document.getElementById('main-ring').style.background = "var(--accent-success)";
                document.getElementById('status-title').textContent = "Deploy Eseguito";
                logMsg("Sistema pronto per l'avvio neurale.");
            }, 1000);
        }
    } catch (err) { 
        logMsg("Errore Cloud: " + err.message, "error"); 
    }
}

function logMsg(msg, type = 'info') {
    const out = document.getElementById('log-output');
    const line = document.createElement('div');
    line.textContent = `> ${msg}`;
    if (type === 'error') line.style.color = '#ff4d4d';
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

// Redirect alla pagina Chat
function launchChat() {
    window.location.href = 'chat.html';
}

// Inizializzazione Event Listeners
document.getElementById('drive-connect').addEventListener('click', handleAuth);
document.getElementById('create-btn').addEventListener('click', deployBrain);
document.getElementById('launch-btn').addEventListener('click', launchChat);
