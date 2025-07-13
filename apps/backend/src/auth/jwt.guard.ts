import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class JwtGuard {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateToken(authHeader?: string) {
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }

    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new UnauthorizedException("Invalid authorization header format");
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      return user;
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Invalid token");
      }
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token expired");
      }
      throw error;
    }
  }

  private extractTokenFromHeader(authHeader: string): string | null {
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : null;
  }
}
