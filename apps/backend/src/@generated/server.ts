import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  users: t.router({
    getUsers: publicProcedure.output(z.array(z.object({
      id: z.number(),
      email: z.string().email(),
      name: z.string(),
      avatar: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
      // password는 응답에서 제외
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUserById: publicProcedure.input(z.object({ id: z.number() })).output(z.object({
      id: z.number(),
      email: z.string().email(),
      name: z.string(),
      avatar: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
      // password는 응답에서 제외
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createUser: publicProcedure.input(z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
      avatar: z.string().optional(),
    })).output(z.object({
      id: z.number(),
      email: z.string().email(),
      name: z.string(),
      avatar: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
      // password는 응답에서 제외
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  auth: t.router({
    login: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string(),
    })).output(z.object({
      access_token: z.string(),
      user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string(),
        avatar: z.string().nullable(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    register: publicProcedure.input(z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
    })).output(z.object({
      access_token: z.string(),
      user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string(),
        avatar: z.string().nullable(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  posts: t.router({
    createPost: publicProcedure.input(z.object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),
      content: z.string().min(1, "Content is required"),
      isPublic: z.boolean().optional().default(true),
    })).output(z.object({
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
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getPublicPosts: publicProcedure.output(z.array(z.object({
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
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUserPosts: publicProcedure.input(z.object({ userId: z.number().int().positive() })).output(z.array(z.object({
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
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getPostById: publicProcedure.input(z.object({
      id: z.number().int().positive(),
    })).output(z.object({
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
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updatePost: publicProcedure.input(z.object({
      id: z.number().int().positive(),
      data: z.object({
        title: z.string().min(1).max(200).optional(),
        content: z.string().min(1).optional(),
        isPublic: z.boolean().optional(),
      }),
    })).output(z.object({
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
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deletePost: publicProcedure.input(z.object({
      id: z.number().int().positive(),
    })).output(z.object({ success: z.boolean() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

