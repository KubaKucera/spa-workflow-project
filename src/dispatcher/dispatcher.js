import { updateState, getState } from "../infra/store/store.js";
import { Request } from "../entities/Request.js";
import { Comment } from "../entities/Comment.js";
import { approveApi, rejectApi } from "../infra/api/approvalApi.js";
import { ActionTypes } from "../actions/actionTypes.js";

export function dispatch(action) {
  const state = getState();

  try {
    switch (action.type) {
      
      // CREATE REQUEST      
      case ActionTypes.CREATE_REQUEST: {
        const request = new Request({
          id: Date.now(),
          title: action.payload.title,
          authorId: state.currentUser.id
        });

        updateState({
          requests: [...state.requests, request]
        });

        break;
      }
      
      // SUBMIT REQUEST (NEW → UNDER_REVIEW)      
      case ActionTypes.SUBMIT_REQUEST: {
        const request = state.requests.find(
          r => r.id === action.payload.requestId
        );

        if (!request) throw new Error("Request not found");

        // BUSINESS LOGIKA: Pro ucely testovani a obhajoby nastavujeme 
        // schvalovatel John Doe (ID "1"), aby mohl zadost sam schvalit do finalniho stavu.
        request.submitRequest(["1"], state.currentUser);

        updateState({
          requests: state.requests.map(r =>
            r.id === request.id ? request : r // Predame instanci (ne kopii), aby zustaly metody
          ),
          approvals: [
            ...state.approvals,
            ...request.approvals.filter(
              a => !state.approvals.some(ex => ex.id === a.id)
            )
          ]
        });

        break;
      }
      
      // APPROVE / REJECT (ASYNC FLOW)      
      case ActionTypes.APPROVE_REQUEST:
      case ActionTypes.REJECT_REQUEST: {

        const approval = state.approvals.find(
          a => a.id === action.payload.approvalId
        );

        if (!approval) throw new Error("Approval not found");

        const request = state.requests.find(
          r => r.id === approval.requestId
        );

        if (!request) throw new Error("Request not found");

        updateState({ loading: true });

        const apiCall =
          action.type === ActionTypes.APPROVE_REQUEST
            ? approveApi
            : rejectApi;

        apiCall(request.id)
          .then(() => {

            // business logika v entitach
            if (action.type === ActionTypes.APPROVE_REQUEST) {
              approval.approve(request.state, state.currentUser);
            } else {
              approval.reject(request.state, state.currentUser);
            }

            request.evaluateApprovals();

            // archivace komentaru po final stavu
            if (request.isFinal()) {
              state.comments
                .filter(c => c.requestId === request.id)
                .forEach(c => c.archiveComment());
            }

            updateState({
              requests: state.requests.map(r =>
                r.id === request.id ? request : r
              ),

              approvals: state.approvals.map(a =>
                a.id === approval.id ? approval : a
              ),

              comments: [...state.comments],
              loading: false
            });
          })
          .catch(err => {
            updateState({
              loading: false,
              error: err.message
            });
          });

        break;
      }
      
      // COMMENTS      
      case ActionTypes.ADD_COMMENT: {
        const comment = new Comment({
          id: Date.now(),
          requestId: action.payload.requestId,
          authorId: state.currentUser.id,
          text: action.payload.text
        });

        updateState({
          comments: [...state.comments, comment]
        });

        break;
      }

      case ActionTypes.EDIT_COMMENT: {
        const comment = state.comments.find(
          c => c.id === action.payload.commentId
        );

        if (!comment) throw new Error("Comment not found");

        comment.editComment(action.payload.text, state.currentUser);

        updateState({
          comments: [...state.comments]
        });

        break;
      }

      case ActionTypes.ARCHIVE_COMMENT: {
        const comment = state.comments.find(
          c => c.id === action.payload.commentId
        );

        if (!comment) throw new Error("Comment not found");

        comment.archiveComment();

        updateState({
          comments: [...state.comments]
        });

        break;
      }

      // LOGIN USER (prijeti identity z IR08)
      case ActionTypes.LOGIN_USER: {
        updateState({
          currentUser: action.payload.user,
          isAuthenticated: true
        });

        break;
      }
      
      // NAVIGATION (IR04)      
      case ActionTypes.NAVIGATE: {
        updateState({
          currentRoute: action.payload.path
        });

        break;
      }

      default:
        console.warn("Unknown action:", action.type);
    }

  } catch (err) {
    updateState({
      error: err.message
    });
  }
}