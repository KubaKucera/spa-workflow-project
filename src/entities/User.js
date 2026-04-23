export const UserState = {
    ANONYMOUS: 'ANONYMOUS',
    AUTHENTICATED: 'AUTHENTICATED',
    ACTIVE: 'ACTIVE'
};

export const UserRole = {
    REQUESTER: 'žadatel',
    APPROVER: 'schvalovatel'
};

export class User {
    constructor() {
        this.state = UserState.ANONYMOUS;
        this.role = null;
    }

   
    
    transitionToAuthenticated(role) {
       
        if (this.state === UserState.ANONYMOUS) {
            this.state = UserState.AUTHENTICATED;
            this.role = Object.values(UserRole).includes(role) ? role : UserRole.REQUESTER;
        }
    }

    transitionToActive() {
        
        if (this.state === UserState.AUTHENTICATED) {
            this.state = UserState.ACTIVE;
        }
    }

    transitionToAnonymous() {
        
        this.state = UserState.ANONYMOUS;
        this.role = null;
    }
}
