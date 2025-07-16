// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { TRPCProvider, trpcClient } from "./trpc";

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         // SSR에서는 staleTime을 0 이상으로 설정하여 클라이언트에서 즉시 리페치 방지
//         staleTime: 60 * 1000,
//         refetchOnWindowFocus: false,
//       },
//     },
//   });
// }

// let browserQueryClient: QueryClient | undefined = undefined;

// function getQueryClient() {
//   if (typeof window === "undefined") {
//     // 서버: 항상 새로운 query client 생성
//     return makeQueryClient();
//   } else {
//     // 브라우저: 기존 클라이언트가 없으면 새로 생성
//     // React가 초기 렌더링 중 서스펜드될 때 새 클라이언트를 다시 만들지 않도록 하는 것이 중요
//     if (!browserQueryClient) browserQueryClient = makeQueryClient();
//     return browserQueryClient;
//   }
// }

// interface ProvidersProps {
//   children: React.ReactNode;
// }

// export function Providers({ children }: ProvidersProps) {
//   const queryClient = getQueryClient();

//   return (
//     <QueryClientProvider client={queryClient}>
//       <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
//         {children}
//       </TRPCProvider>
//     </QueryClientProvider>
//   );
// }

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "./trpc";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:8080/trpc",
          // You can pass any HTTP headers you wish here
          async headers() {
            if (typeof window === "undefined") return {};

            const token = localStorage.getItem("auth-token");
            return token ? { authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
