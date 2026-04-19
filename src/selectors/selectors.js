import { getState } from "../infra/store/store.js";

// Vrátí všechny žádosti
export function getAllRequests() {
    const state = getState();
    return state.requests;
}

// Vrátí žádosti podle stavu ("NEW", "UNDER_REVIEW", "APPROVED", "REJECTED")
export function getRequestsByStatus(status) {
    const state = getState();
    return state.requests.filter(r => r.state === status);
}

// Vrátí žádosti uživatele podle ID
export function getRequestsByAuthor(userId) {
    const state = getState();
    return state.requests.filter(r => r.authorId === userId);
}

// Vrátí všechny komentáře k žádosti
export function getCommentsForRequest(requestId) {
    const state = getState();
    return state.comments.filter(c => c.requestId === requestId);
}

// Vrátí pouze aktivní komentáře k dané žádosti (ACTIVE nebo EDITED)
export function getActiveComments(requestId) {
    const state = getState();
    return state.comments.filter(
        c => c.requestId === requestId && c.state !== "ARCHIVED"
    );
}

// Vrátí aktuálně přihlášeného uživatele
export function getCurrentUser() {
    const state = getState();
    return state.currentUser;
}

// Zjistí jestli může aktuální uživatel přidat komentář
export function canAddComment() {
    const state = getState();
    const user = state.currentUser;
    return user !== null && user.state === "ACTIVE";
}
