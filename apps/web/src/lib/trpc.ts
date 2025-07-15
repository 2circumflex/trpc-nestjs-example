import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { AppRouter } from "../../../backend/src/@generated/server";

function getBaseUrl() {
  return `http://localhost:${process.env.PORT ?? 8080}`;
}

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      headers: () => {
        // SSR 시 localStorage 접근 방지
        if (typeof window === "undefined") return {};

        const token = localStorage.getItem("auth-token");
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
