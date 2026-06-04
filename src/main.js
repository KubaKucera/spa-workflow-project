import "../tests/entities/Request.test.js";
import "../tests/entities/Comment.test.js";
import "../tests/entities/Approval.test.js";
import "../tests/entities/User.test.js";

import { initStore } from "./infra/store/store.js";
import { initRouter } from "./infra/router/router.js";
import { initAuth } from "./infra/auth/auth.js";
import { initRender } from "./ui/render.js";
import { Request } from "./entities/Request.js";

if (!window.location.hash || window.location.hash === "#") {
    window.location.hash = "home";
}

// IR01 – inicializace store s instanci Requestu
const initialRequests = [
    new Request({ id: 1, title: "Žádost o nákup monitoru", authorId: "applicant2" }),
    new Request({ id: 2, title: "Schválení rozpočtu na marketing", authorId: "applicant1" }),
    new Request({ id: 3, title: "Proplacení cestovních nákladů", authorId: "applicant2" }),
    new Request({ id: 4, title: "Žádost o nový firemní notebook", authorId: "applicant1" }),    
];

initStore({
    requests: initialRequests,
    approvals: [],
    comments: [],
    currentUser: null, // Vychozi stav, ktery initAuth() ihned prepise
    currentRoute: "home",
    loading: false,
    error: null
});

const root = document.getElementById("app");
initRender(root);

initRouter();
initAuth();

console.log("Aplikace byla úspěšně spuštěna a inicializována.");