import { ActionTypes } from "../actions/actionTypes.js";
import { dispatch } from "../dispatcher/dispatcher.js"; 

export function handleCreateRequest(event, title) {
    if (event) event.preventDefault();
    if (!title || title.trim() === "") return;
    dispatch({
        type: ActionTypes.CREATE_REQUEST,
        payload: { title: title.trim() }
    });
}

export function handleSubmitRequest(requestId) {
    if (!requestId) return;

    console.log("SUBMIT REQUEST:", requestId);

    dispatch({
        type: ActionTypes.SUBMIT_REQUEST,
        payload: { requestId }
    });
}

export function handleApproveRequest(approvalId) {
    if (!approvalId) return;
    dispatch({
        type: ActionTypes.APPROVE_REQUEST,
        payload: { approvalId }
    });
}

export function handleRejectRequest(approvalId) {
    if (!approvalId) return;
    dispatch({
        type: ActionTypes.REJECT_REQUEST,
        payload: { approvalId }
    });
}

export function handleAddComment(event, requestId, text) {
    if (event) event.preventDefault();
    if (!text || text.trim() === "") return;
    
    dispatch({
        type: ActionTypes.ADD_COMMENT,
        payload: { requestId, text: text.trim() }
    });
}