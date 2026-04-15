import { ActionTypes } from "../actions/actionTypes.js";
import { dispatch } from "../dispatcher/dispatcher.js"; // import od Pavla (IR02)

// Handler pro vytvoreni nové žádosti
export function handleCreateRequest(event, title) {
    if (event) event.preventDefault(); // Izolace od chovani prohlizece

    if (!title || title.trim() === "") return;

    dispatch({
        type: ActionTypes.CREATE_REQUEST,
        payload: { title: title.trim() }
    });
}

// Handler pro odesilani žádosti ke schválení
export function handleSubmitRequest(requestId) {
    dispatch({
       type: ActionTypes.SUBMIT_REQUEST,
       payload: { requestId } 
    });
}