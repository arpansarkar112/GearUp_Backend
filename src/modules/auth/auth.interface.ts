export interface IloginUser {
    email: string;
    password: string;
}

export interface IsocialLoginUser {
    email: string;
    name: string;
    role: "CUSTOMER" | "PROVIDER";
}