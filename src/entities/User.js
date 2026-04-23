export const UserState = {
    ANONYMOUS: "ANONYMOUS",
    AUTHENTICATED: "AUTHENTICATED",
    ACTIVE: "ACTIVE"
};

export class User {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.state = UserState.ANONYMOUS;
    }

    login() {
        if (this.state !== UserState.ANONYMOUS) {
            throw new Error("Already logged in");
        }
        this.state = UserState.AUTHENTICATED;
    }

    activate() {
        if (this.state !== UserState.AUTHENTICATED) {
            throw new Error("Cannot activate");
        }
        this.state = UserState.ACTIVE;
    }
}