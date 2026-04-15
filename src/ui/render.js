import { getState, subscribe } from "../infra/store/store.js";

/** 
 * Toto je docasna verze, dokud Vojta (IR06) nedoda finalni render.
 * Slouží k tomu, aby main.js nevyhazoval chybu
*/

export function initRender(rootElement) {
    const render = () => {
        const state = getState();
        console.log("--- RENDER LOOP ---");
        console.log("Aktuální počet žádostí ve Storu:", state.requests.length);

        // jen jedoduchy vypis do HTML, aby bylo videt že to žije
        rootElement.textContent = `Aplikace běží. Počet žádostí: ${state.requests.length}.`;
    };

    // Testovani IR01: Přihlášení k odberu
    subscribe(render);

    // První spuštění
    render();
}