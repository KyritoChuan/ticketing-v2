import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "../../modules/user/interfaces/jwtPayload.interface";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET_KEY'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpirarion: false,
        });
    }

    /* --------------- */

    async validate(payload: JwtPayload): Promise<any> {
        const { id, email } = payload;
        return { id, email };
    }

    generateAuth(id: string, email: string): string {
        const payload: JwtPayload = { id: id, email: email };
        console.log("jwtTokenGenerate id:", id, " username:", email);
        return this.jwtService.sign(payload);
    }

    verifyAuth(jwt: string) {
        try {
            const payload: JwtPayload = this.jwtService.verify(jwt);
            return payload;
        } catch (error) {
            return null;
        }
    }
}