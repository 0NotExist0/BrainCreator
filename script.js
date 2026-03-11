/**
 * Brain Creator - Metodo di Gestione Stato e Sincronizzazione Cloud
 */

const state = {
    isConnected: false,
    activeAccount: null,
    isDeploying: false
};

// Elementi del DOM
const elements = {
    modal: document.getElementById('account-modal'),
    log: document.getElementById('log-output'),
    driveStatus: document.getElementById('drive-status'),
    statusText: document.getElementById('status-text'),
    btnCreate: document.getElementById('create-btn'),
    btnConnect: document.getElementById('drive-connect'),
    progressContainer: document.querySelector('.progress-container'),
    progressFill: document.querySelector('.progress-fill'),
    ring: document.querySelector('.pulse-ring')
};

/**
 * Gestisce l'output del terminale simulato
 */
function writeLog(message, type = 'info') {
    const entry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    entry.style.color = type === 'error' ? 'var(--accent-error)' : 'var(--accent-success)';
    entry.textContent = `> [${timestamp}] ${message}`;
    elements.log.appendChild(entry);
    elements.log.scrollTop = elements.log.scrollHeight;
}

/**
 * Gestione Modale Account
 */
function openPicker() {
    if (state.isDeploying) return;
    elements.modal.style.display = 'flex';
    writeLog("Richiesta autenticazione OAuth 2.0...");
}

function closeModal() {
    elements.modal.style.display = 'none';
}

/**
 * Selezione Account e inizializzazione sessione
 */
function selectAccount(email) {
    state.isConnected = true;
    state.activeAccount = email;
    closeModal();

    elements.driveStatus.textContent = `Cloud: ${email}`;
    elements.driveStatus.style.color = 'var(--accent-success)';
    elements.statusText.textContent = "Sincronizzato. Pronto per l'upload.";
    
    writeLog(`Token rinfrescato per ${email}`, 'info');
}

/**
 * Simulazione avanzamento barra di progresso
 */
async function updateProgress(duration) {
    elements.progressContainer.style.display = 'block';
    let progress = 0;
    const interval = 50; // ms
    const step = 100 / (duration / interval);

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            progress += step;
            elements.progressFill.style.width = `${Math.min(progress, 100)}%`;
            if (progress >= 100) {
                clearInterval(timer);
                resolve();
            }
        }, interval);
    });
}

/**
 * Metodo principale di sincronizzazione (Deploy del Cervello)
 */
async function syncBrain() {
    // Validazione iniziale
    if (!state.isConnected) {
        writeLog("ERRORE: Accesso a Google Drive non autorizzato.", "error");
        openPicker();
        return;
    }

    const brainName = document.getElementById('brain-name').value.trim();
    if (!brainName) {
        writeLog("ERRORE: Specificare un nome per il Core Neurale.", "error");
        return;
    }

    // Lock UI
    state.isDeploying = true;
    elements.btnCreate.disabled = true;
    elements.btnCreate.textContent = "Sincronizzazione...";
    
    writeLog(`Inizio pacchettizzazione '${brainName}'...`);

    // Fase 1: Preparazione JSON
    await new Promise(r => setTimeout(r, 800));
    writeLog("Compilazione parametri architettura...");

    // Fase 2: Upload con barra di progresso
    writeLog(`Caricamento in corso su Drive: /Apps/BrainCreator/${brainName}.json`);
    await updateProgress(3000);

    // Fase 3: Finalizzazione
    writeLog("Verifica integrità file cloud completata.");
    
    setTimeout(() => {
        state.isDeploying = false;
        elements.btnCreate.disabled = false;
        elements.btnCreate.textContent = "Aggiorna Configurazione";
        elements.statusText.textContent = `Online: ${brainName}`;
        elements.ring.style.background = 'var(--accent-success)';
        elements.progressContainer.style.display = 'none';
        elements.progressFill.style.width = '0%';
        writeLog(`DEPLOIEMENT COMPLETATO: Cervello attivo su account ${state.activeAccount}`);
    }, 500);
}

// Inizializzazione Listener
elements.btnConnect.addEventListener('click', openPicker);
elements.btnCreate.addEventListener('click', syncBrain);

// Chiudi modale cliccando fuori
window.onclick = (event) => {
    if (event.target == elements.modal) closeModal();
};
