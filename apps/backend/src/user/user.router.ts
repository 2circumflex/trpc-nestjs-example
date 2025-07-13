import { Injectable } from "@nestjs/common";
import { Router, Query, Mutation } from "nestjs-trpc";
import { z } from "zod";
import { UserService } from "./user.service";
import { TRPCError } from "@trpc/server";

const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // password는 응답에서 제외
});

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  avatar: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

@Injectable()
@Router({ alias: "users" })
export class UserRouter {
  constructor(private readonly userService: UserService) {}

  @Query({ output: z.array(userSchema) })
  async getUsers() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
        cause: error,
      });
    }
  }

  @Query({
    input: z.object({ id: z.number() }),
    output: userSchema,
  })
  async getUserById({ id }: { id: number }) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user",
        cause: error,
      });
    }
  }

  @Mutation({
    input: createUserSchema,
    output: userSchema,
  })
  async createUser(input: z.infer<typeof createUserSchema>) {
    try {
      // 이메일 중복 확인
      const existingUser = await this.userService.findByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      return await this.userService.create(input);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user",
        cause: error,
      });
    }
  }
}
