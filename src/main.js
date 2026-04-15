import "../tests/Request.test.js";

import { initStore } from "./infra/store/store.js";
import { initRender } from "./ui/render.js";

// Inicializace aplikace s prazdnym nebo testovacim stavem
const initialState = {
    requests: [],
    approvals: [],
    currentUser: null
};

// Spuštění State Managementu (IR01)
initStore(initialState);

// Spuštění renderovani do divu s id="app"
const root = document.getElementById("app");
initRender(root);

console.log("Aplikace byla úspěšně inicializována.");