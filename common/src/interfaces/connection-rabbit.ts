


export class ConnectionRabbit {
    host: string;
    port: number;
    username: string;
    password: string;

    constructor(host: string, port: number, username: string, password: string) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
    }
}