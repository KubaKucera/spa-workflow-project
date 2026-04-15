import { Request, RequestState } from "../src/entities/Request.js";

console.log("Spouštím testy entity Request (Jakub Kučera)...");

// Pomocny "mock" objekt aktivniho uzivatele pro testy (odpovida entitě Matěje)
const activeUser = { state: "ACTIVE" };

// Test 1: Uspesny přechod NEW -> UNDER_REVIEW a vytvoření schválení
const req1 = new Request({ id: 1, title: "Dovolená", authorId: "user1" });
// PRIDANO: activeUser jako druhý parametr... poté i níže
req1.submit(["approver1", "approver2"], activeUser);

console.assert(req1.state === RequestState.UNDER_REVIEW, "Chyba: Stav by měl být UNDER_REVIEW");
console.assert(req1.approvals.length === 2, "Chyba: Měla se vytvořit 2 schválení");

// Test 2: Invariant - Request je REJECTED, pokud je alespon jedno schválení zamítnuto
const req2 = new Request({ id: 2, title: "Nákup", authorId: "user1" });
req2.submit(["approver1"], activeUser);
req2.evaluateStatus([{ state: "REJECTED" }]);

console.assert(req2.state === RequestState.REJECTED, "Chyba: Žádost měla být REJECTED");

// Test 3: Invariant - Request je APPROVED pouze pokud jsou vsechna schválení APPROVED
const req3 = new Request({ id: 3, title: "Projekt", authorId: "user1" });
req3.submit(["approver1", "approver2"], activeUser);
req3.evaluateStatus([{ state: "APPROVED" }, { state: "PENDING" }]);

console.assert(req3.state === RequestState.UNDER_REVIEW, "Chyba: Žádost má zůstat UNDER_REVIEW, dokud nejsou všechna schválení hotová");

// Test 4: Ochrana invariantu - Neprihlaseny nebo neaktivni uživatel nemůže odeslat žádost
const req4 = new Request({ id: 4, title: "Pokus", authorId: "user1" });
try {
    req4.submit(["approver1"], { state: "ANONYMOUS" });
    console.log("Chyba: Test selhal! System měl vyhodit chybu pro neaktivniho uživatele.");
} catch (e) {
    console.log("Test4 OK: System spravne zablokoval neaktivního uživatele.");
}

console.log("Testy entity Request dokončeny.");