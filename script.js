/**
 * Brain Creator - Logic Engine
 * Gestisce l'interazione tra UI e simulazione Google Drive
 */

let isConnectedToDrive = false;

// Riferimenti DOM
const logOutput = document.getElementById('log-output');
const driveStatus = document.getElementById('drive-status');
const statusText = document.getElementById('status-text');
const btnCreate = document.getElementById('create-btn');

/**
 * Metodo per aggiungere log al terminale di sistema
 */
function addLog(msg) {
    const p = document.createElement('div');
    p.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    logOutput.appendChild(p);
    logOutput.scrollTop = logOutput.scrollHeight;
}

/**
 * Metodo per gestire l'autenticazione simulata con Google Drive
 */
function connectDrive() {
    addLog("Avvio handshake con le API di Google...");
    
    setTimeout(() => {
        isConnectedToDrive = true;
        driveStatus.textContent = "Stato: Connesso (Account Google)";
        driveStatus.style.color = "#34a853";
        addLog("Accesso a Google Drive autorizzato.");
        statusText.textContent = "Pronto per la sincronizzazione.";
    }, 1200);
}

/**
 * Metodo principale per salvare la configurazione del cervello su Drive
 */
function syncBrainToDrive() {
    if (!isConnectedToDrive) {
        addLog("ERRORE: Connessione a Drive richiesta per l'hosting.");
        return;
    }

    const brainName = document.getElementById('brain-name').value || "Unnamed_Brain";
    const brainRole = document.getElementById('brain-role').value;
    
    btnCreate.disabled = true;
    btnCreate.textContent = "Sincronizzazione...";
    addLog(`Generazione file di configurazione: ${brainName}.json`);

    // Simulazione processo di upload cloud
    setTimeout(() => addLog("Allocazione spazio su Google Drive..."), 800);
    setTimeout(() => addLog("Invio pacchetti neurali al server remoto..."), 1800);

    setTimeout(() => {
        addLog(`SUCCESSO: Il cervello '${brainName}' è ospitato su Drive.`);
        statusText.textContent = `Ospitato su Drive: ${brainName}`;
        btnCreate.disabled = false;
        btnCreate.textContent = "Aggiorna Configurazione";
        
        // Feedback visivo nel canvas
        document.querySelector('.pulse-ring').style.background = "#34a853";
    }, 3500);
}

// Inizializzazione Event Listeners
document.getElementById('drive-connect').addEventListener('click', connectDrive);
btnCreate.addEventListener('click', syncBrainToDrive);
