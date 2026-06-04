import { Request, RequestState } from "../../src/entities/Request.js";

console.log("Testy pro Request (Jakub Kučera)");

const activeUser = { state: "ACTIVE" };
const reqAutor = { id: "user1", state: "ACTIVE" };
const reqCiziUzivatel = { id: "user2", state: "ACTIVE" };

// Test 1: odeslani zadosti
const req1 = new Request({ id: 1, title: "Dovolená", authorId: "user1" });
req1.submitRequest(["approver1", "approver2"], activeUser);

console.assert(
    req1.state === RequestState.UNDER_REVIEW,
    "Chyba: má být UNDER_REVIEW"
);

console.assert(
    req1.approvals.length === 2,
    "Chyba: mají vzniknout 2 schválení"
);

console.log("Test 1 OK: odeslání žádosti funguje");

// Test 2: zamítnutí má přednost
const req2 = new Request({ id: 2, title: "Nákup", authorId: "user1" });
req2.submitRequest(["approver1"], activeUser);

// simulace rozhodnuti pres realny Approval objekt
req2.approvals[0].state = "REJECTED";

req2.evaluateApprovals();

console.assert(
    req2.state === RequestState.REJECTED,
    "Chyba: má být REJECTED"
);

console.log("Test 2 OK: zamítnutí má přednost");


// Test 3: částečné schválení
const req3 = new Request({ id: 3, title: "Projekt", authorId: "user1" });
req3.submitRequest(["approver1", "approver2"], activeUser);

// jeden schvaleny, druhy ceka
req3.approvals[0].state = "APPROVED";
req3.approvals[1].state = "PENDING";

req3.evaluateApprovals();

console.assert(
    req3.state === RequestState.UNDER_REVIEW,
    "Chyba: má zůstat UNDER_REVIEW"
);

console.log("Test 3 OK: čeká se na všechna schválení");

// Test 4: neaktivní uživatel
try {
    const req4 = new Request({ id: 4, title: "Pokus", authorId: "user1" });
    req4.submitRequest(["approver1"], { state: "ANONYMOUS" });
    console.error("Test 4 SELHAL");
} catch {
    console.log("Test 4 OK: blokace neaktivního uživatele");
}


// Test 5: dvojité odeslání
try {
    const req5 = new Request({ id: 5, title: "Duplikát", authorId: "user1" });
    req5.submitRequest(["approver1"], activeUser);
    req5.submitRequest(["approver1"], activeUser);
    console.error("Test 5 SELHAL");
} catch {
    console.log("Test 5 OK: nelze odeslat žádost podruhé");
}

// --- NOVÉ TESTY PRO SMAZÁNÍ ŽÁDOSTI ---

// Test 6: úspěšné smazání žádosti autorem ve stavu NEW
const req6 = new Request({ id: 6, title: "Nová žádost ke smazání", authorId: "user1" });
req6.deleteRequest(reqAutor);

console.assert(
    req6.state === RequestState.DELETED,
    "Chyba: žádost měla přejít do stavu DELETED"
);
console.log("Test 6 OK: úspěšné smazání žádosti autorem ve stavu NEW");

// Test 7: pokus o smazání žádosti cizím uživatelem (byznys autorizace)
try {
    const req7 = new Request({ id: 7, title: "Žádost Jakuba", authorId: "user1" });
    req7.deleteRequest(reqCiziUzivatel);
    console.error("Test 7 SELHAL - cizí uživatel smazal žádost!");
} catch (e) {
    console.log("Test 7 OK: cizí uživatel nemůže smazat žádost (" + e.message + ")");
}

// Test 8: pokus o smazání žádosti, která již byla odeslána ke schválení (ochrana životního cyklu)
try {
    const req8 = new Request({ id: 8, title: "Odeslaná žádost", authorId: "user1" });
    req8.submitRequest(["approver1"], activeUser); // Vstupní stav: UNDER_REVIEW
    req8.deleteRequest(reqAutor);
    console.error("Test 8 SELHAL - rozpracovaná žádost byla smazána!");
} catch (e) {
    console.log("Test 8 OK: nelze smazat žádost odeslanou ke schválení (" + e.message + ")");
}

console.log("Request testy dokončeny.\n");