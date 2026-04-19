import { subscribe } from "../infra/store/store.js";
import { getAllRequests, getCommentsForRequest, getCurrentUser, canAddComment } from "../selectors/selectors.js";

function renderComment(comment) {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = comment.text;

    const state = document.createElement("small");
    state.textContent = ` [${comment.state}]`;

    li.appendChild(text);
    li.appendChild(state);
    return li;
}

function renderRequest(request) {
    const article = document.createElement("article");

    const header = document.createElement("h3");
    header.textContent = `${request.title} — ${request.state}`;
    article.appendChild(header);

    // komentáře
    const comments = getCommentsForRequest(request.id);
    if (comments.length > 0) {
        const nadpis = document.createElement("p");
        nadpis.textContent = "Komentáře:";
        article.appendChild(nadpis);

        const ul = document.createElement("ul");
        comments.forEach(c => ul.appendChild(renderComment(c)));
        article.appendChild(ul);
    }

    return article;
}

function render(rootElement) {
    rootElement.innerHTML = "";

    const user = getCurrentUser();

    // hlavička
    const header = document.createElement("h1");
    header.textContent = "Workflow schvalování";
    rootElement.appendChild(header);

    // info o uživateli
    const userInfo = document.createElement("p");
    if (user) {
        userInfo.textContent = `Přihlášen: ${user.id} (${user.role})`;
    } else {
        userInfo.textContent = "Nepřihlášen";
    }
    rootElement.appendChild(userInfo);

    // seznam žádostí
    const requests = getAllRequests();

    if (requests.length === 0) {
        const prazdno = document.createElement("p");
        prazdno.textContent = "Žádné žádosti.";
        rootElement.appendChild(prazdno);
        return;
    }

    requests.forEach(r => rootElement.appendChild(renderRequest(r)));
}

export function initRender(rootElement) {
    subscribe(() => render(rootElement));
    render(rootElement);
}
