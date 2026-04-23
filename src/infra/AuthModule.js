export class AuthModule {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        
    }

    init() {
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role'); 
        
        if (savedToken && savedRole) {
            
            this.dispatcher.dispatch('ACTION_AUTH_INITIALIZED', { 
                token: savedToken, 
                role: savedRole 
            });
        }
    }

    
    login(token, role) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        
        
        this.dispatcher.dispatch('ACTION_LOGIN_SUCCESS', { token, role });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.dispatcher.dispatch('ACTION_LOGOUT');
    }
}
