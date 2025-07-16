import { Injectable } from "@nestjs/common";
import { Router, Mutation, UseMiddlewares } from "nestjs-trpc";
import { z } from "zod";
import { AuthService } from "./auth.service";
import { LoggerMiddleware } from "./logger.middleware";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

const authResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    avatar: z.string().nullable(),
  }),
});

@Injectable()
@Router({ alias: "auth" })
@UseMiddlewares(LoggerMiddleware)
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({ input: loginSchema, output: authResponseSchema })
  async login(input: z.infer<typeof loginSchema>) {
    return this.authService.login(input.email, input.password);
  }

  @Mutation({ input: registerSchema, output: authResponseSchema })
  async register(input: z.infer<typeof registerSchema>) {
    return this.authService.register(input.email, input.password, input.name);
  }
}
