import { subscribe } from "../infra/store/store.js";
import { getAllRequests, getCommentsForRequest, getCurrentUser,
    getCurrentRoute, getLoadingState, getErrorState, getApprovalsForRequest 
} from "../selectors/selectors.js";
import { 
    handleSubmitRequest, handleCreateRequest, 
    handleApproveRequest, handleRejectRequest, handleAddComment 
} from "../handlers/requestHandlers.js";

function renderComment(comment) {
    const li = document.createElement("li");
    li.textContent = `${comment.text} [${comment.state}]`;
    return li;
}

function renderCommentForm(requestId) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.placeholder = "Napište komentář...";
    const btn = document.createElement("button");
    btn.textContent = "Přidat komentář";

    form.appendChild(input);
    form.appendChild(btn);

    form.addEventListener("submit", (e) => {
        handleAddComment(e, requestId, input.value);
        input.value = "";
    });

    return form;
}

function renderRequest(request, isDetail = false) {
    const article = document.createElement("article");
    const currentUser = getCurrentUser();

    // 1. Nadpis a stav
    const title = document.createElement("h3");
    title.textContent = `${request.title} — ${request.state}`;
    article.appendChild(title);

    // 2. Navigace
    if (!isDetail) {
        const link = document.createElement("a");
        link.href = `#request/${request.id}`;
        link.textContent = "Zobrazit detail žádosti";
        link.style.display = "block";
        link.style.marginBottom = "1rem";
        article.appendChild(link);
    }

    // 3. Akce pro Autora (Odeslani)
    if (request.state === "NEW" && currentUser && currentUser.id === request.authorId) {
        const btn = document.createElement("button");
        btn.textContent = "Odeslat ke schválení";
        btn.addEventListener("click", () => handleSubmitRequest(request.id));
        article.appendChild(btn);
    }

    // 4. Prubeh schvalování a Akce pro Schvalovatele
    if (request.state === "UNDER_REVIEW") {
        const approvals = getApprovalsForRequest(request.id);

        // Zobrazeni seznamu schvalovatelů (Důkaz business logiky v detailu)
        if (isDetail && approvals.length > 0) {
            const statusLabel = document.createElement("p");
            statusLabel.innerHTML = "<strong>Kdo musí schválit:</strong>";
            article.appendChild(statusLabel);

            const approvalUl = document.createElement("ul");
            approvals.forEach(a => {
                const li = document.createElement("li");
                li.textContent = `Schvalovatel ${a.approverId}: ${a.state}`;
                if (a.state === "APPROVED") li.style.color = "green";
                approvalUl.appendChild(li);
            });
            article.appendChild(approvalUl);
        }

        // Tlacitka pro aktualniho schvalovatele
        const myApproval = approvals.find(a => currentUser && a.approverId === currentUser.id && a.state === "PENDING");
        if (myApproval) {
            const actionDiv = document.createElement("div");
            actionDiv.style.marginTop = "1rem";

            const approveBtn = document.createElement("button");
            approveBtn.textContent = "Schválit";
            approveBtn.addEventListener("click", () => handleApproveRequest(myApproval.id));
            
            const rejectBtn = document.createElement("button");
            rejectBtn.textContent = "Zamítnout";
            rejectBtn.className = "secondary";
            rejectBtn.addEventListener("click", () => handleRejectRequest(myApproval.id));

            actionDiv.appendChild(approveBtn);
            actionDiv.appendChild(document.createTextNode(" "));
            actionDiv.appendChild(rejectBtn);
            article.appendChild(actionDiv);
        }
    }

    // 5. Komentare (jen v detailu)
    if (isDetail) {
        article.appendChild(document.createElement("hr"));
        const comments = getCommentsForRequest(request.id);
        
        if (comments && comments.length > 0) {
            const label = document.createElement("p");
            label.innerHTML = "<strong>Komentáře:</strong>";
            article.appendChild(label);

            const ul = document.createElement("ul");
            comments.forEach(c => ul.appendChild(renderComment(c)));
            article.appendChild(ul);
        }

        if (currentUser && currentUser.state === "ACTIVE") {
            article.appendChild(renderCommentForm(request.id));
        }
    }

    return article;
}

function renderList(root) {
    renderCreateForm(root);
    const requests = getAllRequests();
    if (!requests || requests.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Žádné žádosti k zobrazení.";
        root.appendChild(empty);
        return;
    }
    requests.forEach(r => root.appendChild(renderRequest(r, false)));
}

function renderDetail(root, route) {
    const requestId = parseInt(route.split("/")[1], 10);
    const request = getAllRequests().find(r => r.id === requestId);

    const backLink = document.createElement("a");
    backLink.href = "#home";
    backLink.textContent = "← Zpět na seznam";
    backLink.style.display = "block";
    backLink.style.marginBottom = "1rem";
    root.appendChild(backLink);

    if (!request) {
        const notFound = document.createElement("p");
        notFound.textContent = "Žádost nebyla nalezena.";
        root.appendChild(notFound);
        return;
    }
    root.appendChild(renderRequest(request, true));
}

function renderCreateForm(root) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.placeholder = "Zadejte název nové žádosti...";
    const btn = document.createElement("button");
    btn.textContent = "Vytvořit žádost";

    form.appendChild(input);
    form.appendChild(btn);

    form.addEventListener("submit", (e) => {
        handleCreateRequest(e, input.value);
        input.value = "";
    });

    root.appendChild(form);
    root.appendChild(document.createElement("hr"));
}

function render(root) {
    root.replaceChildren();
    const user = getCurrentUser();
    const loading = getLoadingState();
    const error = getErrorState();
    const currentRoute = getCurrentRoute();

    const header = document.createElement("h1");
    header.textContent = "Workflow schvalování";
    root.appendChild(header);

    const info = document.createElement("p");
    info.textContent = user ? `Přihlášen: ${user.name} | Role: ${user.role} | ID: ${user.id}` : "Nepřihlášen";
    root.appendChild(info);

    if (error) {
        const errDiv = document.createElement("article");
        errDiv.style.backgroundColor = "#fff0f0";
        errDiv.style.color = "#d00000";
        errDiv.textContent = `Chyba: ${error}`;
        root.appendChild(errDiv);
    }

    if (loading) {
        const loadDiv = document.createElement("p");
        loadDiv.setAttribute("aria-busy", "true");
        loadDiv.textContent = " Zpracovávám...";
        root.appendChild(loadDiv);
    }

    if (currentRoute && currentRoute.startsWith("request/")) {
        renderDetail(root, currentRoute);
    } else {
        renderList(root);
    }
}

export function initRender(root) {
    subscribe(() => render(root));
    render(root);
}