import { subscribe } from "../infra/store/store.js";
import { 
    getAllRequests, getCommentsForRequest, getCurrentUser,
    getCurrentRoute, getLoadingState, getErrorState, getApprovalsForRequest,
    getRequestCapabilities, getCommentCapabilities
} from "../selectors/selectors.js";
import { 
    handleSubmitRequest, handleCreateRequest, 
    handleApproveRequest, handleRejectRequest, handleAddComment,
    handleEditComment, handleLogin, handleLogout,
    handleDeleteRequest, handleDeleteComment
} from "../handlers/handlers.js";

// --- KOMPONENTA KOMENTÁŘE ---
function CommentView({ viewState, handlers }) {
    const { comment, capabilities } = viewState;
    const { canEdit, canDelete } = capabilities;
    const { onEdit, onDelete } = handlers;

    const li = document.createElement("li");
    li.textContent = `${comment.text} [${comment.state}] (Autor ID: ${comment.authorId})`;

    if (canEdit && onEdit) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Upravit";
        editBtn.style.marginLeft = "10px";
        editBtn.className = "primary";
        editBtn.addEventListener("click", () => {
            const newText = prompt("Upravte text komentáře:", comment.text);
            if (newText !== null) onEdit(comment.id, newText);
        });
        li.appendChild(editBtn);
    }

    if (canDelete && onDelete) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Smazat";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.className = "delete-btn";         
        deleteBtn.addEventListener("click", () => onDelete(comment.id));
        li.appendChild(deleteBtn);
    }
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

// --- KOMPONENTA ŽÁDOSTI ---
function RequestView({ viewState, handlers }) {
    const { request, approvals, comments, currentUser, isDetail, capabilities } = viewState;
    const { canSubmit, canApprove, canReject, myApprovalId, canDelete } = capabilities;
    const { onSubmit, onApprove, onReject, onDelete } = handlers;

    const container = document.createElement("article");

    const title = document.createElement("h3");
    title.textContent = `${request.title} — ${request.state}`;
    container.appendChild(title);

    if (!isDetail) {
        const link = document.createElement("a");
        link.href = `#request/${request.id}`;
        link.textContent = "Zobrazit detail žádosti";
        link.style.display = "block";
        link.style.marginBottom = "1rem";
        container.appendChild(link);
    }

    // Podminene zobrazení akcí na základě capabilities
    if (canSubmit && onSubmit) {
        const btn = document.createElement("button");
        btn.textContent = "Odeslat ke schválení";
        btn.addEventListener("click", () => onSubmit(request.id));
        container.appendChild(btn);
    }

    if (canDelete && onDelete) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Smazat žádost";
        deleteBtn.className = "delete-btn";        
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", () => onDelete(request.id));
        container.appendChild(deleteBtn);
    }

    if (request.state === "UNDER_REVIEW") {
        if (isDetail && approvals.length > 0) {
            const statusLabel = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = "Průběh schvalování:";
            statusLabel.appendChild(strong);
            container.appendChild(statusLabel);

            const approvalUl = document.createElement("ul");
            approvals.forEach(a => {
                const li = document.createElement("li");
                li.textContent = `Schvalovatel ${a.approverId}: ${a.state}`;
                if (a.state === "APPROVED") li.style.color = "green";
                if (a.state === "REJECTED") li.style.color = "red";
                approvalUl.appendChild(li);
            });
            container.appendChild(approvalUl);
        }

        if ((canApprove || canReject) && myApprovalId) {
            const actionDiv = document.createElement("div");
            actionDiv.style.marginTop = "1rem";

            if (canApprove && onApprove) {
                const approveBtn = document.createElement("button");
                approveBtn.textContent = "Schválit";
                approveBtn.className = "approve-btn";               
                approveBtn.addEventListener("click", () => onApprove(myApprovalId));
                actionDiv.appendChild(approveBtn);
            }

            if (canReject && onReject) {
                const rejectBtn = document.createElement("button");
                rejectBtn.textContent = "Zamítnout";
                rejectBtn.className = "reject-btn";
                rejectBtn.style.marginLeft = "5px";
                rejectBtn.addEventListener("click", () => onReject(myApprovalId));
                actionDiv.appendChild(rejectBtn);
            }
            container.appendChild(actionDiv);
        }
    }

    if (isDetail) {
        container.appendChild(document.createElement("hr"));
        if (comments && comments.length > 0) {
            const label = document.createElement("p");
            const strongLabel = document.createElement("strong");
            strongLabel.textContent = "Komentáře:";
            label.appendChild(strongLabel);
            container.appendChild(label);

            const ul = document.createElement("ul");
            comments.forEach(c => {
                const commentViewState = { comment: c, capabilities: getCommentCapabilities(c) };
                const commentHandlers = { onEdit: handleEditComment, onDelete: handleDeleteComment };
                ul.appendChild(CommentView({ viewState: commentViewState, handlers: commentHandlers }));
            });
            container.appendChild(ul);
        }

        if (currentUser && currentUser.state === "ACTIVE") {
            container.appendChild(renderCommentForm(request.id));
        }
    }

    return container;
}

// --- SEZNAM A DETAIL ---
function renderList(root) {
    const user = getCurrentUser();

    // BYZNYS PRAVIDLO: Zalozit novou zadost smi pouze uzivatel s roli Zadatel (APPLICANT)
    if (user && user.role === "APPLICANT") {
        renderCreateForm(root);
    } else {        
        root.appendChild(document.createElement("hr"));
    }

    const requests = getAllRequests();
    if (!requests || requests.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Žádné žádosti k zobrazení.";
        root.appendChild(empty);
        return;
    }   
    
    requests.forEach(r => {
        const viewState = {
            request: r,
            approvals: getApprovalsForRequest(r.id),
            comments: getCommentsForRequest(r.id),
            currentUser: getCurrentUser(),
            isDetail: false,
            capabilities: getRequestCapabilities(r)
        };
        const handlers = { onSubmit: handleSubmitRequest, onDelete: handleDeleteRequest };
        root.appendChild(RequestView({ viewState, handlers }));
    });
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
        notFound.textContent = "Žádaná žádost nebyla nalezena.";
        root.appendChild(notFound);
        return;
    }

    const viewState = {
        request,
        approvals: getApprovalsForRequest(request.id),
        comments: getCommentsForRequest(request.id),
        currentUser: getCurrentUser(),
        isDetail: true,
        capabilities: getRequestCapabilities(request)
    };
    const handlers = {
        onSubmit: handleSubmitRequest,
        onApprove: handleApproveRequest,
        onReject: handleRejectRequest,
        onDelete: handleDeleteRequest
    };

    root.appendChild(RequestView({ viewState, handlers }));
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

// --- ZALOZNI POHLED PRO LOGIN (Pokud se uzivatel odhlasi) ---
function LoginView() {
    const form = document.createElement("form");
    const label = document.createElement("h3");
    label.textContent = "Přihlášení do systému";
    form.appendChild(label);

    const selectUser = document.createElement("select");

    const opt1 = document.createElement("option");
    opt1.value = "approver1|Aleš Král|APPROVER";
    opt1.textContent = "Aleš Král (Role: Schvalovatel)";
    selectUser.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = "approver2|Dana Novotná|APPROVER"; // Format: ID|Jmeno|Role
    opt2.textContent = "Dana Novotná (Role: Schvalovatel)";
    selectUser.appendChild(opt2);

    const opt3 = document.createElement("option");
    opt3.value = "applicant1|Tomáš Hájek|APPLICANT";
    opt3.textContent = "Tomáš Hájek (Role: Žadatel)";
    selectUser.appendChild(opt3);

    const opt4 = document.createElement("option");
    opt4.value = "applicant2|Pepa Vomáčka|APPLICANT";
    opt4.textContent = "Pepa Vomáčka (Role: Žadatel)";
    selectUser.appendChild(opt4);   
    
    const opt5 = document.createElement("option");
    opt5.value = "applicant3|Jana Horáková|APPLICANT";
    opt5.textContent = "Jana Horáková (Role: Žadatel)";
    selectUser.appendChild(opt5); 
    
    form.appendChild(selectUser);

    const btn = document.createElement("button");
    btn.textContent = "Přihlásit se";
    form.appendChild(btn);

    form.addEventListener("submit", (e) => {
        const [id, name, role] = selectUser.value.split("|");
        handleLogin(e, id, name, role);
    });
    return form;
}

// --- HLAVNI RENDER ---
function render(root) {
    root.replaceChildren(); 
    const user = getCurrentUser();
    const loading = getLoadingState();
    const error = getErrorState();
    const currentRoute = getCurrentRoute();

    const header = document.createElement("h1");
    header.textContent = "Workflow schvalování";
    root.appendChild(header);
    
    if (!user) {
        root.appendChild(LoginView());
        return;
    }

    const userBar = document.createElement("div");
    userBar.style.display = "flex";
    userBar.style.justifyContent = "space-between";
    userBar.style.marginBottom = "1rem";

    const info = document.createElement("p");
    info.textContent = `Přihlášen: ${user.name} | Role: ${user.role} | ID: ${user.id}`;
    userBar.appendChild(info);

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Odhlásit se";
    logoutBtn.className = "secondary logout-btn";
    logoutBtn.addEventListener("click", handleLogout);
    userBar.appendChild(logoutBtn);
    root.appendChild(userBar);

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