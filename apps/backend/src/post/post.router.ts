import { z } from "zod";
import { Router, Query, Mutation } from "nestjs-trpc";
import { Injectable } from "@nestjs/common";
import { PostService } from "./post.service";
import { TRPCError } from "@trpc/server";

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
  authorId: z.number().int().positive(), // 임시로 authorId를 직접 받음 (나중에 JWT에서 추출)
});

const updatePostSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  data: z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    isPublic: z.boolean().optional(),
  }),
});

@Injectable()
@Router({ alias: "posts" })
export class PostRouter {
  constructor(private readonly postService: PostService) {}

  // 포스트 생성
  @Mutation({
    input: createPostSchema,
    output: postSchema,
  })
  async createPost(input: z.infer<typeof createPostSchema>) {
    try {
      return await this.postService.createPost(
        {
          title: input.title,
          content: input.content,
          isPublic: input.isPublic,
        },
        input.authorId
      );
    } catch (error) {
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
      userId: z.number().int().positive().optional(),
    }),
    output: postSchema,
  })
  async getPostById({ id, userId }: { id: number; userId?: number }) {
    try {
      return await this.postService.getPublicPostById(id, userId);
    } catch (error) {
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
  async updatePost(input: z.infer<typeof updatePostSchema>) {
    try {
      return await this.postService.updatePost(
        input.id,
        input.data,
        input.userId
      );
    } catch (error) {
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
      userId: z.number().int().positive(),
    }),
    output: z.object({ success: z.boolean() }),
  })
  async deletePost({ id, userId }: { id: number; userId: number }) {
    try {
      await this.postService.deletePost(id, userId);
      return { success: true };
    } catch (error) {
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
