export class Router {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
       
        window.addEventListener('popstate', () => this.syncUrlWithState());
    }

 
    syncUrlWithState() {
        const url = new URL(window.location.href);
        const path = url.pathname;
        
        
        const params = Object.fromEntries(url.searchParams.entries());

  
        this.dispatcher.dispatch('ACTION_ROUTE_CHANGED', { path, params });
    }

    navigate(path, params = {}) {
        const url = new URL(path, window.location.origin);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        window.history.pushState({}, '', url);
        this.syncUrlWithState();
    }
}
