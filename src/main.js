import "../tests/Request.test.js";
import "../tests/Comment.test.js";
import "../tests/Approval.test.js";
import "../tests/User.test.js";

import { initStore } from "./infra/store/store.js";
import { initRouter } from "./infra/router/router.js";
import { initAuth } from "./infra/auth/auth.js";
import { initRender } from "./ui/render.js";
import { Request } from "./entities/Request.js";

// IR01 – inicializace store s instanci Requestu
const initialRequests = [
    new Request({ id: 1, title: "Dovolená", authorId: "1" }),
    new Request({ id: 2, title: "Nákup notebooku", authorId: "1" }),
    new Request({ id: 3, title: "Home office", authorId: "2" })
];

initStore({
    requests: initialRequests,
    approvals: [],
    comments: [],
    users: []
});

initRouter();
initAuth();

const root = document.getElementById("app");
initRender(root);

console.log("Aplikace byla úspěšně inicializována.");