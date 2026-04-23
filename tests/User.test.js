import { User, UserState } from "../src/entities/User.js";

console.log("Testy pro User (Matěj Wittich)");

// Test 1: vytvoreni uživatele
const u1 = new User("id1", "Matěj", "APPROVER");
console.assert(u1.state === UserState.ANONYMOUS, "Chyba: má být ANONYMOUS");
console.assert(u1.role === "APPROVER", "Chyba: role nesouhlasí");
console.log("Test 1 OK: vytvoření uživatele");

// Test 2: aktivace bez prihlaseni
try {
    u1.activate();
    console.error("Test 2 SELHAL");
} catch {
    console.log("Test 2 OK: nelze aktivovat bez přihlášení");
}

// Test 3: login
u1.login();
console.assert(u1.state === UserState.AUTHENTICATED, "Chyba: má být AUTHENTICATED");
console.log("Test 3 OK: přihlášení");

// Test 4: dvojitý login
try {
    u1.login();
    console.error("Test 4 SELHAL");
} catch {
    console.log("Test 4 OK: nelze se přihlásit dvakrát");
}

// Test 5: aktivace
u1.activate();
console.assert(u1.state === UserState.ACTIVE, "Chyba: má být ACTIVE");
console.log("Test 5 OK: aktivace");

// Test 6: dvojitá aktivace
try {
    u1.activate();
    console.error("Test 6 SELHAL");
} catch {
    console.log("Test 6 OK: nelze aktivovat dvakrát");
}

console.log("User testy dokončeny.\n");