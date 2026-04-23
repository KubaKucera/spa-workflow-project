import { getState } from "../infra/store/store.js";

// REQUESTS
export const getAllRequests = () => getState().requests;

// INFRA (IR04, IR03) - Router, Loading, Error
export const getCurrentRoute = () => getState().currentRoute;
export const getLoadingState = () => getState().loading;
export const getErrorState = () => getState().error;

// APPROVALS
export const getApprovalsForRequest = (requestId) => 
    getState().approvals.filter(a => a.requestId === requestId);

export const getRequestsByStatus = (status) =>
    getState().requests.filter(r => r.state === status);

export const getRequestsByAuthor = (userId) =>
    getState().requests.filter(r => r.authorId === userId);

// COMMENTS
export const getCommentsForRequest = (requestId) =>
    getState().comments.filter(c => c.requestId === requestId);

export const getActiveComments = (requestId) =>
    getState().comments.filter(
        c => c.requestId === requestId && c.state !== "ARCHIVED"
    );

// USER
export const getCurrentUser = () => getState().currentUser;