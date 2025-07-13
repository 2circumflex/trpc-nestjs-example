import { z } from "zod";
import { Router, Query, Mutation } from "nestjs-trpc";
import { Injectable } from "@nestjs/common";
import { PostService } from "./post.service";
import { TRPCError } from "@trpc/server";
import { JwtGuard } from "../auth/jwt.guard";
import { requireAuth, optionalAuth } from "../auth/auth.utils";

// Zod 스키마 정의
const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  isPublic: z.boolean(),
  authorId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: z
    .object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      avatar: z.string().nullable(),
    })
    .optional(),
});

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  isPublic: z.boolean().optional().default(true),
});

const updatePostSchema = z.object({
  id: z.number().int().positive(),
  data: z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    isPublic: z.boolean().optional(),
  }),
});

@Injectable()
@Router({ alias: "posts" })
export class PostRouter {
  constructor(
    private readonly postService: PostService,
    private readonly jwtGuard: JwtGuard
  ) {}

  // 포스트 생성
  @Mutation({
    input: createPostSchema,
    output: postSchema,
  })
  async createPost(input: z.infer<typeof createPostSchema>, ctx: any) {
    try {
      const user = await requireAuth(this.jwtGuard, ctx.req);

      return await this.postService.createPost(
        {
          title: input.title,
          content: input.content,
          isPublic: input.isPublic,
        },
        user.id
      );
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create post",
        cause: error,
      });
    }
  }

  // 공개 포스트 목록 조회
  @Query({
    output: z.array(postSchema),
  })
  async getPublicPosts() {
    try {
      return await this.postService.getPublicPosts();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch posts",
        cause: error,
      });
    }
  }

  // 특정 사용자의 포스트 조회
  @Query({
    input: z.object({ userId: z.number().int().positive() }),
    output: z.array(postSchema),
  })
  async getUserPosts({ userId }: { userId: number }) {
    try {
      return await this.postService.getUserPosts(userId);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user posts",
        cause: error,
      });
    }
  }

  // 포스트 상세 조회
  @Query({
    input: z.object({
      id: z.number().int().positive(),
    }),
    output: postSchema,
  })
  async getPostById({ id }: { id: number }, ctx: any) {
    try {
      const user = await optionalAuth(this.jwtGuard, ctx.req);

      return await this.postService.getPublicPostById(id, user?.id);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      if (error.message.includes("not found")) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error.message,
        });
      }
      if (error.message.includes("private")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: error.message,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch post",
        cause: error,
      });
    }
  }

  // 포스트 수정
  @Mutation({
    input: updatePostSchema,
    output: postSchema,
  })
  async updatePost(input: z.infer<typeof updatePostSchema>, ctx: any) {
    try {
      const user = await requireAuth(this.jwtGuard, ctx.req);

      return await this.postService.updatePost(input.id, input.data, user.id);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      if (error.message.includes("not found")) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error.message,
        });
      }
      if (error.message.includes("only update your own")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: error.message,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update post",
        cause: error,
      });
    }
  }

  // 포스트 삭제
  @Mutation({
    input: z.object({
      id: z.number().int().positive(),
    }),
    output: z.object({ success: z.boolean() }),
  })
  async deletePost({ id }: { id: number }, ctx: any) {
    try {
      const user = await requireAuth(this.jwtGuard, ctx.req);

      await this.postService.deletePost(id, user.id);
      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      if (error.message.includes("not found")) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error.message,
        });
      }
      if (error.message.includes("only delete your own")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: error.message,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete post",
        cause: error,
      });
    }
  }
}
