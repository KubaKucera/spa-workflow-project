import { subscribe } from "../infra/store/store.js";
import { getAllRequests, getCommentsForRequest, getCurrentUser, canAddComment } from "../selectors/selectors.js";

// import { dispatch } from "../dispatcher/dispatcher.js"; // až bude dispatch exportovaný

function renderComment(comment, currentUser) {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = comment.text;

    const state = document.createElement("small");
    state.textContent = ` [${comment.state}]`;

    li.appendChild(text);
    li.appendChild(state);

    // btn Upravit - zobrazí se jen autorovi komentáře
    // až bude dispatch hotový, odkomentovat:
    // if (currentUser && currentUser.id === comment.authorId && comment.state !== "ARCHIVED") {
    //     const btn = document.createElement("button");
    //     btn.textContent = "Upravit";
    //     btn.onclick = () => dispatch({ type: "EDIT_COMMENT", commentId: comment.id });
    //     li.appendChild(btn);
    // }

    return li;
}

function renderRequest(request, currentUser) {
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
        comments.forEach(c => ul.appendChild(renderComment(c, currentUser)));
        article.appendChild(ul);
    }

    // btn Přidat komentář - zobrazí se přihlášenému uživateli
    // až bude dispatch hotov odkomentovat:
    // if (canAddComment()) {
    //     const btn = document.createElement("button");
    //     btn.textContent = "Přidat komentář";
    //     btn.onclick = () => dispatch({ type: "ADD_COMMENT", requestId: request.id, authorId: currentUser.id, text: "Nový komentář" });
    //     article.appendChild(btn);
    // }

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

    // přihlašovací formulář - až bude dispatch hotový, odkomentovat:
    // if (!user) {
    //     const input = document.createElement("input");
    //     input.placeholder = "Zadej jméno";
    //     const btn = document.createElement("button");
    //     btn.textContent = "Přihlásit";
    //     btn.onclick = () => dispatch({ type: "LOGIN_USER", id: input.value });
    //     rootElement.appendChild(input);
    //     rootElement.appendChild(btn);
    // }

    // seznam žádostí
    const requests = getAllRequests();

    if (requests.length === 0) {
        const prazdno = document.createElement("p");
        prazdno.textContent = "Žádné žádosti.";
        rootElement.appendChild(prazdno);
        return;
    }

    requests.forEach(r => rootElement.appendChild(renderRequest(r, user)));
}

export function initRender(rootElement) {
    subscribe(() => render(rootElement));
    render(rootElement);
}
