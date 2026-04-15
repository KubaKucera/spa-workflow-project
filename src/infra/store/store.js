// Návrh globálniho stavu
let state = {
    requests: [],
    approvals: [],
    comments: [],
    users: [],
    currentUser: null
};

let listeners = [];

// Vrací kopii aktualniho stavu pro Selektory (IR05)
export function getState() {
    return { ...state };
}

/** 
 * Jedine misto pro řízené mutace stavu
 * Po zmeně upozorní všechny odběratele (typicky Render IR06)
*/
export function updateState(updates) {
    state = { ...state, ...updates };
    listeners.forEach(listener => listener(state));
}

// Umožnuje UI (Renderu) přihlásit se k odberu změn
export function subscribe(listener) {
    listeners.push(listener);
}

// Inicializace stavu (napr. po načtení aplikace)
export function initStore(initialData) {
    updateState(initialData);
}