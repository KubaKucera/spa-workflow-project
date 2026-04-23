import { dispatch } from "../../dispatcher/dispatcher.js";
import { ActionTypes } from "../../actions/actionTypes.js";

export function initRouter() {
    const sync = () => {
        const path = window.location.hash.replace("#", "") || "home";

        dispatch({
            type: ActionTypes.NAVIGATE,
            payload: { path }
        });
    };

    window.addEventListener("hashchange", sync);
    sync();
}