import { Comment, CommentState } from "../../src/entities/Comment.js";

console.log("Testy pro Comment (Vojtěch Kubíček)");

const autor = { id: "user1", state: "ACTIVE" };
const ciziUzivatel = { id: "user2", state: "ACTIVE" };

// Test 1: novy komentar
const c1 = new Comment({
    id: 1,
    requestId: 10,
    authorId: "user1",
    text: "Prosím o schválení."
});

console.assert(
    c1.state === CommentState.ACTIVE,
    "Chyba: komentář má být ACTIVE"
);

console.log("Test 1 OK: vytvoření komentáře");

// Test 2: editace autorem
c1.editComment("Upravený text.", autor);

console.assert(
    c1.state === CommentState.EDITED,
    "Chyba: má být EDITED"
);

console.assert(
    c1.text === "Upravený text.",
    "Chyba: text se nezměnil"
);

console.log("Test 2 OK: editace komentáře");

// Test 3: editace cizím uživatelem
try {
    const c2 = new Comment({
        id: 2,
        requestId: 10,
        authorId: "user1",
        text: "Text."
    });

    c2.editComment("Pokus.", ciziUzivatel);

    console.error("Test 3 SELHAL");
} catch {
    console.log("Test 3 OK: cizí uživatel nemůže editovat");
}

// Test 4: archivace
c1.archiveComment();

console.assert(
    c1.state === CommentState.ARCHIVED,
    "Chyba: má být ARCHIVED"
);

console.log("Test 4 OK: archivace funguje");

// Test 5: editace archivovaného komentáře
try {
    c1.editComment("Další pokus.", autor);
    console.error("Test 5 SELHAL");
} catch {
    console.log("Test 5 OK: archivovaný komentář nelze upravit");
}

// --- NOVÉ TESTY PRO SMAZÁNÍ KOMENTÁŘE ---

// Test 6: úspěšné smazání komentáře autorem
const c3 = new Comment({
    id: 3,
    requestId: 10,
    authorId: "user1",
    text: "Komentář určený ke smazání."
});

c3.deleteComment(autor);

console.assert(
    c3.state === CommentState.DELETED,
    "Chyba: komentář měl přejít do stavu DELETED"
);
console.log("Test 6 OK: úspěšné smazání komentáře autorem");

// Test 7: pokus o smazání komentáře cizím uživatelem (byznys autorizace)
try {
    const c4 = new Comment({
        id: 4,
        requestId: 10,
        authorId: "user1",
        text: "Cizí komentář."
    });
    c4.deleteComment(ciziUzivatel);
    console.error("Test 7 SELHAL - cizí uživatel smazal komentář!");
} catch (e) {
    console.log("Test 7 OK: cizí uživatel nemůže smazat komentář (" + e.message + ")");
}

// Test 8: pokus o smazání archivovaného komentáře (ochrana stavového automatu)
try {
    const c5 = new Comment({
        id: 5,
        requestId: 10,
        authorId: "user1",
        text: "Důležitý archivovaný komentář."
    });
    c5.archiveComment(); // Vstupní stav: ARCHIVED
    c5.deleteComment(autor);
    console.error("Test 8 SELHAL - archivovaný komentář byl smazán!");
} catch (e) {
    console.log("Test 8 OK: archivovaný komentář nelze smazat (" + e.message + ")");
}

console.log("Comment testy dokončeny.\n");