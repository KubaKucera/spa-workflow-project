import { Approval } from "../src/entities/Approval.js";

console.log("Testy pro Approval (Pavel Ondráček)");

// =========================
// Test 1: inicializace
// =========================
const a1 = new Approval(1, 10, "user1");
console.assert(a1.status === "PENDING", "Chyba: stav má být PENDING");
console.log("Test 1 OK");

// =========================
// Test 2: approve
// =========================
a1.approve("UNDER_REVIEW");
console.assert(a1.status === "APPROVED", "Chyba: po approve má být APPROVED");
console.log("Test 2 OK");

// =========================
// Test 3: double approve
// =========================
try {
  a1.approve("UNDER_REVIEW");
  console.log("CHYBA: mělo vyhodit error!");
} catch (e) {
  console.log("Test 3 OK: nelze rozhodnout dvakrát (approve)");
}

// =========================
// Test 4: reject
// =========================
const a2 = new Approval(2, 10, "user2");
a2.reject("UNDER_REVIEW");
console.assert(a2.status === "REJECTED", "Chyba: po reject má být REJECTED");
console.log("Test 4 OK");

// =========================
// Test 5: double reject
// =========================
try {
  a2.reject("UNDER_REVIEW");
  console.log("CHYBA: mělo vyhodit error!");
} catch (e) {
  console.log("Test 5 OK: nelze rozhodnout dvakrát (reject)");
}

// =========================
// Test 6: invalid request status
// =========================
try {
  const a3 = new Approval(3, 10, "user3");
  a3.approve("NEW");
  console.log("CHYBA: mělo vyhodit error!");
} catch (e) {
  console.log("Test 6 OK: kontrola stavu requestu funguje");
}

// =========================
// Test 7: reject při invalid request status
// =========================
try {
  const a4 = new Approval(4, 10, "user4");
  a4.reject("NEW");
  console.log("CHYBA: mělo vyhodit error!");
} catch (e) {
  console.log("Test 7 OK: reject blokován při špatném stavu requestu");
}

// =========================
// Test 8: mix approve → reject
// =========================
try {
  const a5 = new Approval(5, 10, "user5");
  a5.approve("UNDER_REVIEW");

  a5.reject("UNDER_REVIEW");

  console.log("CHYBA: nemělo povolit změnu rozhodnutí!");
} catch (e) {
  console.log("Test 8 OK: nelze změnit rozhodnutí po approve");
}

// =========================
// Test 9: mix reject → approve
// =========================
try {
  const a6 = new Approval(6, 10, "user6");
  a6.reject("UNDER_REVIEW");

  a6.approve("UNDER_REVIEW");

  console.log("CHYBA: nemělo povolit změnu rozhodnutí!");
} catch (e) {
  console.log("Test 9 OK: nelze změnit rozhodnutí po reject");
}

console.log("Testy Approval dokončeny.");