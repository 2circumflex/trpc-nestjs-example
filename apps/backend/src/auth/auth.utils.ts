import { TRPCError } from "@trpc/server";
import { JwtGuard } from "./jwt.guard";
import { User } from "../user/user.entity";

export interface AuthenticatedContext {
  user: User;
  req: any;
}

export async function requireAuth(jwtGuard: JwtGuard, req: any): Promise<User> {
  try {
    const authHeader = req.headers.authorization;
    const user = await jwtGuard.validateToken(authHeader);
    return user;
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: error.message || "Authentication required",
    });
  }
}

export async function optionalAuth(
  jwtGuard: JwtGuard,
  req: any
): Promise<User | null> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null;
    }
    const user = await jwtGuard.validateToken(authHeader);
    return user;
  } catch (error) {
    return null;
  }
}
