export const RequestState = {
    NEW: "NEW",
    UNDER_REVIEW: "UNDER_REVIEW",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
};

export class Request {
    constructor({ id, title, authorId }) {
        this.id = id;
        this.title = title;
        this.authorId = authorId;
        this.state = RequestState.NEW; // Vychozi stav
        this.approvals = []; // Vazba na instance Approval
    }

    // Přechod NEW -> UNDER_REVIEW (akce SUBMIT_REQUEST)
    submit(approverIds, currentUser) {
        // Kontrola invariantu: Pouze ACTIVE uzivatel muze vytvářet Request
        if (!currentUser || currentUser.state !== "ACTIVE") {
            throw new Error("Žádost může odeslat pouze aktivní uživatel.");
        }
        
        // Kontrola životního cyklu
        if (this.state !== RequestState.NEW) {
            throw new Error(`Nelze odeslat žádost ve stavu ${this.state}`);
        }

        this.state = RequestState.UNDER_REVIEW;

        /** 
         * Odpovědnost: Vytvoření Approval při zahájeni schvalování
         * Automaticke vytvoreni instancí Approval
        */
        this.approvals = approverIds.map(userId => ({
            requestId: this.id,
            userId: userId,
            state: "PENDING" // Výchozi stav Approval
        }));
    }

    /** 
     * Agregave stavů Approval a aktulizace stavu Request
     * Implementuje invarianty schvalovacího procesu
    */
    evaluateStatus(currentApprovals) {
        // Invariant: Lze menit pouze pokud Request je UNDER_REVIEW
        if (this.state !== RequestState.UNDER_REVIEW) return;

        const hasRejected = currentApprovals.some(a => a.state === "REJECTED");
        const allApproved = currentApprovals.length > 0 && currentApprovals.every(a => a.state === "APPROVED");

        if (hasRejected) {
            this.state = RequestState.REJECTED; // Invariant REJECTED
        } else if (allApproved) {
            this.state = RequestState.APPROVED; // Invariant APPROVED
        }
    }
}