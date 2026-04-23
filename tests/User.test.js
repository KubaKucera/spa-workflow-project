import { createInitialState } from "../src/state.js";
import { dispatchAction } from "../src/dispatch.js";

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Test pro přihlášení
 * Testuje změnu stavového automatu entity User z ANONYMOUS na AUTHENTICATED
 */
export function testScenario_loginSuccess() {
    let state = createInitialState();

    // --- GIVEN ---
    // Simulace výchozího stavu
    state.user = {
        state: "ANONYMOUS",
        role: null
    };
    state.auth = {
        token: null
    };

    const action = {
        type: "ACTION_LOGIN_SUCCESS",
        payload: { token: "token_123", role: "schvalovatel" }
    };

    // --- WHEN ---
    const newState = dispatchAction(clone(state), action);

    // --- THEN ---
    console.assert(
        newState.user.state === "AUTHENTICATED",
        "Stav uživatele by se měl změnit z ANONYMOUS na AUTHENTICATED"
    );
    console.assert(
        newState.user.role === "schvalovatel",
        "Role uživatele by měla být nastavena na 'schvalovatel'"
    );
    console.assert(
        newState.auth.token === "token_123",
        "Token by měl být uložen do stavu infrastruktury"
    );

    console.log("testScenario_loginSuccess passed");
}


export function testScenario_createRequestAuthorized() {
    let state = createInitialState();

    
    state.user = {
        state: "ACTIVE",
        role: "žadatel"
    };
    state.requests = [];

    const action = {
        type: "CREATE_REQUEST",
        payload: { title: "Nová dovolená" }
    };

    
    const newState = dispatchAction(clone(state), action);

    
    console.assert(
        newState.requests.length === 1,
        "Žádost by měla být vytvořena, protože uživatel je ACTIVE a je žadatel"
    );
    console.assert(
        newState.requests[0].title === "Nová dovolená",
        "Data žádosti by měla odpovídat payloadu"
    );

    console.log("testScenario_createRequestAuthorized passed");
}


export function testScenario_routeChanged() {
    let state = createInitialState();

    // --- GIVEN ---
    state.router = {
        currentPath: "/",
        queryParams: {}
    };

    
    const action = {
        type: "ACTION_ROUTE_CHANGED",
        payload: { path: "/requests", params: { filter: "pending" } }
    };

    // --- WHEN ---
    const newState = dispatchAction(clone(state), action);

    // --- THEN ---
    console.assert(
        newState.router.currentPath === "/requests",
        "Aktuální cesta v router stavu by měla odpovídat nové URL"
    );
    console.assert(
        newState.router.queryParams.filter === "pending",
        "Query parametry z URL by měly být naparsovány a uloženy ve stavu"
    );

    console.log("testScenario_routeChanged passed");
}
