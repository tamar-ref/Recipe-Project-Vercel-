export interface User {
    _id: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    role: string;
    passwordStrength: boolean;
}
