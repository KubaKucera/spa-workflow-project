import { Approval } from "./Approval.js";

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
        this.state = RequestState.NEW;
        this.approvals = [];
    }

    submitRequest(approverIds, user) {
        if (!user || user.state !== "ACTIVE") {
            throw new Error("Only active user can submit request");
        }
        if (this.state !== RequestState.NEW) {
            throw new Error("Invalid state");
        }

        this.state = RequestState.UNDER_REVIEW;

        this.approvals = approverIds.map(
            id => new Approval(Date.now() + Math.random(), this.id, id)
        );
    }

    evaluateApprovals(mockApprovals = null) {
        if (this.state !== RequestState.UNDER_REVIEW) return;

        const approvalsToCheck = mockApprovals || this.approvals;

        const hasReject = approvalsToCheck.some(a => a.state === "REJECTED");
        const allApproved = approvalsToCheck.every(a => a.state === "APPROVED");

        if (hasReject) {
            this.state = RequestState.REJECTED;
        } else if (allApproved && approvalsToCheck.length > 0) {
            this.state = RequestState.APPROVED;
        }
    }

    finalizeRequest() {
        if (this.state === RequestState.UNDER_REVIEW) {
            this.evaluateApprovals();
        }

        if (this.state !== RequestState.APPROVED && this.state !== RequestState.REJECTED) {
            throw new Error("Request is not in final state");
        }

        return this.state;
    }

    isFinal() {
        return this.state === RequestState.APPROVED || this.state === RequestState.REJECTED;
    }
}