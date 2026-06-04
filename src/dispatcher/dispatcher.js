import { updateState, getState } from "../infra/store/store.js";
import { Request } from "../entities/Request.js";
import { Comment } from "../entities/Comment.js";
import { approveApi, rejectApi } from "../infra/api/approvalApi.js";
import { ActionTypes } from "../actions/actionTypes.js";

export function dispatch(action) {
  const state = getState();

  try {
    switch (action.type) {
      case ActionTypes.CREATE_REQUEST: {
        const request = new Request({
          id: Date.now(),
          title: action.payload.title,
          authorId: state.currentUser.id
        });
        updateState({ requests: [...state.requests, request] });
        break;
      }
      
      case ActionTypes.SUBMIT_REQUEST: {
        const request = state.requests.find(r => r.id === action.payload.requestId);
        if (!request) throw new Error("Request not found");

        request.submitRequest(action.payload.approverIds, state.currentUser);

        updateState({
          requests: state.requests.map(r => r.id === request.id ? request : r),
          approvals: [...state.approvals, ...request.approvals]
        });
        break;
      }
      
      case ActionTypes.APPROVE_REQUEST:
      case ActionTypes.REJECT_REQUEST: {
        const approval = state.approvals.find(a => a.id === action.payload.approvalId);
        if (!approval) throw new Error("Approval not found");

        const request = state.requests.find(r => r.id === approval.requestId);
        if (!request) throw new Error("Request not found");

        updateState({ loading: true, error: null });
        const apiCall = action.type === ActionTypes.APPROVE_REQUEST ? approveApi : rejectApi;
        
        apiCall(request.id)
          .then(() => {
            const updatedApprovals = state.approvals.map(a => {
              if (a.id === approval.id) {
                if (action.type === ActionTypes.APPROVE_REQUEST) {
                  a.approve(request.state, state.currentUser);
                } else {
                  a.reject(request.state, state.currentUser);
                }
              }
              return a;
            });

            request.approvals = updatedApprovals.filter(a => a.requestId === request.id);
            request.evaluateApprovals();

            if (request.isFinal()) {
              state.comments
                .filter(c => c.requestId === request.id)
                .forEach(c => c.archiveComment());
            }

            updateState({
              requests: state.requests.map(r => r.id === request.id ? request : r),
              approvals: updatedApprovals,
              comments: [...state.comments],
              loading: false
            });
          })
          .catch(err => {            
            updateState({ loading: false, error: err.message || "API error occurred" });
          });
        break;
      }

      case ActionTypes.DELETE_REQUEST: {
        const request = state.requests.find(r => r.id === action.payload.requestId);
        if (!request) throw new Error("Request not found");

        request.deleteRequest(state.currentUser);

        updateState({
          requests: state.requests.map(r => r.id === request.id ? request : r)
        });
        break;
      }
      
      case ActionTypes.ADD_COMMENT: {
        const comment = new Comment({
          id: Date.now(),
          requestId: action.payload.requestId,
          authorId: state.currentUser.id,
          text: action.payload.text
        });
        updateState({ comments: [...state.comments, comment] });
        break;
      }

      case ActionTypes.EDIT_COMMENT: {
        const comment = state.comments.find(c => c.id === action.payload.commentId);
        if (!comment) throw new Error("Comment not found");

        comment.editComment(action.payload.text, state.currentUser);
        updateState({ comments: [...state.comments] });
        break;
      }

      case ActionTypes.DELETE_COMMENT: {
        const comment = state.comments.find(c => c.id === action.payload.commentId);
        if (!comment) throw new Error("Comment not found");

        comment.deleteComment(state.currentUser);

        updateState({
          comments: state.comments.map(c => c.id === comment.id ? comment : c)
        });
        break;
      }

      case ActionTypes.LOGIN_USER: {
        updateState({ currentUser: action.payload.user });
        break;
      }

      case ActionTypes.LOGOUT_USER: {
        updateState({ currentUser: null, currentRoute: "home" });
        break;
      }
      
      case ActionTypes.NAVIGATE: {
        updateState({ currentRoute: action.payload.path });
        break;
      }

      default:
        console.warn("Unknown action:", action.type);
    }
  } catch (err) {
    updateState({ error: err.message });
  }
}