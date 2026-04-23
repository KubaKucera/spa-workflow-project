import { Approval } from "../src/entities/Approval.js";

console.log("Testy pro Approval (Pavel Ondráček)");

// Mock uzivatel s opravnenim schvalovat
const mockApprover = { 
  id: "approver1", 
  state: "ACTIVE", 
  role: "APPROVER" 
};

// Test 1: inicializace
const a1 = new Approval(1, 10, "user1");
console.assert(a1.state === "PENDING", "Chyba: stav má být PENDING");
console.log("Test 1 OK: inicializace");

// Test 2: approve
a1.approve("UNDER_REVIEW", mockApprover);
console.assert(a1.state === "APPROVED", "Chyba: po approve má být APPROVED");
console.log("Test 2 OK: schválení funguje");

// Test 3: double approve
try {
  a1.approve("UNDER_REVIEW", mockApprover);
  console.error("Test 3 SELHAL");
} catch {
  console.log("Test 3 OK: nelze rozhodnout dvakrát (approve)");
}

// Test 4: reject
const a2 = new Approval(2, 10, "user2");
a2.reject("UNDER_REVIEW", mockApprover);
console.assert(a2.state === "REJECTED", "Chyba: po reject má být REJECTED");
console.log("Test 4 OK: zamítnutí funguje");

// Test 5: double reject
try {
  a2.reject("UNDER_REVIEW", mockApprover);
  console.error("Test 5 SELHAL");
} catch {
  console.log("Test 5 OK: nelze rozhodnout dvakrát (reject)");
}

// Test 6: špatný stav requestu (approve)
try {
  new Approval(3, 10, "u3").approve("NEW", mockApprover);
  console.error("Test 6 SELHAL");
} catch {
  console.log("Test 6 OK: blokace špatného stavu (approve)");
}

// Test 7: špatný stav requestu (reject)
try {
  new Approval(4, 10, "u4").reject("NEW", mockApprover);
  console.error("Test 7 SELHAL");
} catch {
  console.log("Test 7 OK: blokace špatného stavu (reject)");
}

// Test 8: approve -> reject
try {
  const a5 = new Approval(5, 10, "u5");
  a5.approve("UNDER_REVIEW", mockApprover);
  a5.reject("UNDER_REVIEW", mockApprover);
  console.error("Test 8 SELHAL");
} catch {
  console.log("Test 8 OK: nelze změnit approve na reject");
}

// Test 9: reject -> approve
try {
  const a6 = new Approval(6, 10, "u6");
  a6.reject("UNDER_REVIEW", mockApprover);
  a6.approve("UNDER_REVIEW", mockApprover);
  console.error("Test 9 SELHAL");
} catch {
  console.log("Test 9 OK: nelze změnit reject na approve");
}

// Test 10: autorizace (špatná role)
try {
  const a7 = new Approval(7, 10, "user7");
  const poorUser = { state: "ACTIVE", role: "APPLICANT" };
  a7.approve("UNDER_REVIEW", poorUser);
  console.error("Test 10 SELHAL");
} catch {
  console.log("Test 10 OK: autorizace blokuje nepovolenou roli");
}

console.log("Approval testy dokončeny.\n");