import { ActionTypes } from "../actions/actionTypes.js";
import { dispatch } from "../dispatcher/dispatcher.js"; 
import { User } from "../entities/User.js";

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
    dispatch({
        type: ActionTypes.SUBMIT_REQUEST,
        // Simulace: schvalovatele jsou Ales a Dana
        payload: { requestId, approverIds: ["approver1", "approver2"] }
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

export function handleDeleteRequest(requestId) {
    if (!requestId) return;
    
    if (confirm("Opravdu chcete tuto žádost trvale smazat?")) {
        dispatch({
            type: ActionTypes.DELETE_REQUEST,
            payload: { requestId }
        });
        
        if (window.location.hash.startsWith(`#request/${requestId}`)) {
            window.location.hash = "home";
        }
    }
}

export function handleAddComment(event, requestId, text) {
    if (event) event.preventDefault();
    if (!text || text.trim() === "") return;
    dispatch({
        type: ActionTypes.ADD_COMMENT,
        payload: { requestId, text: text.trim() }
    });
}

export function handleEditComment(commentId, newText) {
    if (!commentId || !newText || newText.trim() === "") return;
    dispatch({
        type: ActionTypes.EDIT_COMMENT,
        payload: { commentId, text: newText.trim() }
    });
}

export function handleDeleteComment(commentId) {
    if (!commentId) return;
    
    if (confirm("Opravdu chcete tento komentář smazat?")) {
        dispatch({
            type: ActionTypes.DELETE_COMMENT,
            payload: { commentId }
        });
    }
}

export function handleLogin(event, id, name, role) {
    if (event) event.preventDefault();
    const user = new User(id, name, role);
    user.login();
    user.activate();
  
    dispatch({
        type: ActionTypes.LOGIN_USER,
        payload: { user }
    });
}

export function handleLogout() {
    dispatch({ type: ActionTypes.LOGOUT_USER });
    window.location.hash = "home";
}