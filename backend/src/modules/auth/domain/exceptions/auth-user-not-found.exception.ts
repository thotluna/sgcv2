export class AuthUserNotFoundException extends Error {
    constructor(username: string) {
        super(`User with username ${username} not found`);
        this.name = 'AuthUserNotFoundException';
    }
}
