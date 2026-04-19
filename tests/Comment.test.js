import { Comment, CommentState } from "../src/entities/Comment.js";

console.log("Testy pro Comment (Vojtěch Kubíček)");

const autor = { id: "user1" };
const ciziUzivatel = { id: "user2" };

// Test 1: nový komentář by měl být ACTIVE
const c1 = new Comment({ id: 1, requestId: 10, authorId: "user1", text: "Prosím o schválení." });
console.assert(c1.state === CommentState.ACTIVE, "Chyba: komentář má být ACTIVE");
console.log("Test 1 OK");

// Test 2: autor může upravit komentář, stav se změní na EDITED
c1.edit("Upravený text.", autor);
console.assert(c1.state === CommentState.EDITED, "Chyba: po editaci má být EDITED");
console.assert(c1.text === "Upravený text.", "Chyba: text se nezměnil");
console.log("Test 2 OK");

// Test 3: někdo jiný nemá právo editovat cizí komentář
try {
    const c2 = new Comment({ id: 2, requestId: 10, authorId: "user1", text: "Text." });
    c2.edit("Pokus o hack.", ciziUzivatel);
    console.log("CHYBA: mělo vyhodit error!");
} catch (e) {
    console.log("Test 3 OK: cizí uživatel zablokován");
}

// Test 4: po dokončení requestu se komentář archivuje
c1.archive();
console.assert(c1.state === CommentState.ARCHIVED, "Chyba: má být ARCHIVED");
console.log("Test 4 OK");

// Test 5: archivovaný komentář nejde upravit
try {
    c1.edit("Další pokus.", autor);
    console.log("CHYBA: archivovaný komentář nesmí jít editovat!");
} catch (e) {
    console.log("Test 5 OK: archivovaný komentář nelze upravit");
}

console.log("Testy Comment dokončeny.");
