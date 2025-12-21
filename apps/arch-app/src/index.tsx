import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@zuojipeng/my-libs/wagmi';
import { ErrorBoundary } from './components/common';
import router from "./routers";
import "./style.css";

// 创建 React Query 客户端
const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <ErrorBoundary>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </WagmiProvider>
  </ErrorBoundary>
);
