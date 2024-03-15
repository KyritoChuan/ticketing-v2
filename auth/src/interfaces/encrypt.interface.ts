// To use dependency injection with interfaces we need to create a token to associate with an
// interface and provide that token when injecting to an interface type.
export const ENCRYPT_SERVICE = 'ENCRYPT_SERVICE';

/* ------------------------------- */

export interface IEncrypt {
    // generateAuth: (user: UserEntity) => string;
    // verifyAuth: (auth: string) => any;
    encryptPassword: (password: string) => Promise<string>;
    comparePassword: (password: string, encryptedPassword: string) => Promise<boolean>;
}