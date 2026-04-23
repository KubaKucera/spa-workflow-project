let state = {
    requests: [],
    approvals: [],
    comments: [],
    currentUser: null,
    currentRoute: "home",
    loading: false,
    error: null
};

let listeners = [];

// Vraci kopii aktualniho stavu pro Selektory (IR05)
export function getState() {
    return { ...state };
}

/** 
 * Jedine misto pro řízené mutace stavu
 * Po zmeně upozorní všechny odběratele (typicky Render IR06)
*/
export function updateState(updates) {
    state = {
        ...state,
        ...updates
    };

    // Upozornime UI na zmenu
    listeners.forEach(l => l({ ...state }));
}

// Umoznuje UI (Renderu) prihlasit se k odberu změn
export function subscribe(listener) {
    listeners.push(listener);
}

// Inicializace stavu (napr. po nacteni aplikace)
export function initStore(initialData) {
    updateState(initialData);
}