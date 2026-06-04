import { getState } from "../infra/store/store.js";
import { RequestState } from "../entities/Request.js";
import { CommentState } from "../entities/Comment.js";

export const getAllRequests = () => 
    getState().requests.filter(r => r.state !== RequestState.DELETED);

export const getCurrentRoute = () => getState().currentRoute;
export const getLoadingState = () => getState().loading;
export const getErrorState = () => getState().error;
export const getCurrentUser = () => getState().currentUser;

export const getApprovalsForRequest = (requestId) => 
    getState().approvals.filter(a => a.requestId === requestId);

export const getCommentsForRequest = (requestId) =>
    getState().comments.filter(c => c.requestId === requestId && c.state !== CommentState.DELETED);

export const getRequestCapabilities = (request) => {
    const user = getCurrentUser();
    if (!user) return { canSubmit: false, canApprove: false, canReject: false, myApprovalId: null, canDelete: false };

    const isAuthor = request.authorId === user.id;
    const approvals = getApprovalsForRequest(request.id);
    const myPendingApproval = approvals.find(a => a.approverId === user.id && a.state === "PENDING");

    return {
        canSubmit: request.state === RequestState.NEW && isAuthor && user.role === "APPLICANT" && user.state === "ACTIVE",
        canApprove: request.state === RequestState.UNDER_REVIEW && user.role === "APPROVER" && !!myPendingApproval,
        canReject: request.state === RequestState.UNDER_REVIEW && user.role === "APPROVER" && !!myPendingApproval,
        myApprovalId: myPendingApproval ? myPendingApproval.id : null,
        canDelete: request.state === RequestState.NEW && isAuthor && user.state === "ACTIVE"
    };
};

// Vypocet capabilities pro Komentar
export const getCommentCapabilities = (comment) => {
    const user = getCurrentUser();
    if (!user) return { canEdit: false, canDelete: false };

    const isAuthor = comment.authorId === user.id;

    return {
        canEdit: isAuthor && comment.state !== CommentState.ARCHIVED && user.state === "ACTIVE",
        canDelete: isAuthor && comment.state !== CommentState.ARCHIVED && user.state === "ACTIVE"
    };
};