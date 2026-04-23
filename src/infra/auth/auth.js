import { dispatch } from "../../dispatcher/dispatcher.js"; 
import { ActionTypes } from "../../actions/actionTypes.js"; 
import { User } from "../../entities/User.js"; 

export function initAuth() {
    // Aplikace striktni business logiky
    const user = new User("1", "John Doe", "APPROVER");
    
    // Provedeni nutnych prechodu ve stavovem automatu
    user.login(); // ANONYMOUS -> AUTHENTICATED
    user.activate(); // AUTHENTICATED -> ACTIVE

    // Stav nemenime primo, ale delegujeme to na Dispatcher
    dispatch({
        type: ActionTypes.LOGIN_USER,
        payload: { user }
    });
    
    console.log("IR08: Identita předána dispatcheru.");
}