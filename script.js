// Selezioniamo gli elementi del DOM
const createBtn = document.getElementById('create-btn');
const logOutput = document.getElementById('log-output');
const statusText = document.getElementById('status-text');
const brainNameInput = document.getElementById('brain-name');
const brainRoleSelect = document.getElementById('brain-role');

/**
 * Funzione per aggiungere un messaggio al terminale simulato
 * @param {string} message - Il testo da mostrare
 */
function addLog(message) {
    const entry = document.createElement('div');
    entry.textContent = `> ${new Date().toLocaleTimeString()}: ${message}`;
    logOutput.appendChild(entry);
    logOutput.scrollTop = logOutput.scrollHeight;
}

/**
 * Metodo principale per l'inizializzazione del "Cervello"
 */
function initializeBrain() {
    const name = brainNameInput.value.trim() || "Senza Nome";
    const role = brainRoleSelect.value;

    if (name === "Senza Nome") {
        addLog("Errore: Inserire un nome valido prima dell'inizializzazione.");
        return;
    }

    // Reset UI
    createBtn.disabled = true;
    createBtn.textContent = "Inizializzazione...";
    statusText.textContent = `Creazione di ${name}...`;

    // Sequenza di log simulata (Simulazione processo IA)
    addLog(`Avvio protocollo ${name}...`);
    
    setTimeout(() => {
        addLog(`Caricamento moduli: ${role.toUpperCase()}...`);
    }, 1000);

    setTimeout(() => {
        addLog("Allocazione neurale completata al 45%...");
    }, 2500);

    setTimeout(() => {
        addLog("Sincronizzazione Knowledge Base in corso...");
    }, 4000);

    setTimeout(() => {
        addLog(`SUCCESSO: Cervello '${name}' è ora online.`);
        statusText.textContent = `Stato: Online (${name})`;
        createBtn.disabled = false;
        createBtn.textContent = "Aggiorna Parametri";
        
        // Cambio colore per feedback visivo
        document.querySelector('.pulse-ring').style.background = '#00ff00';
    }, 6000);
}

// Event Listeners
createBtn.addEventListener('click', initializeBrain);
