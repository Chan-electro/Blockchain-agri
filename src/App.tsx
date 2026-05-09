import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ChatProvider } from "@/providers/ChatProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleRoute } from "@/components/auth/RoleRoute";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ConsumerScan from "@/pages/ConsumerScan";
import ConsumerBatchDetails from "@/pages/ConsumerBatchDetails";
import FarmerDashboard from "@/pages/FarmerDashboard";
import ProcessorDashboard from "@/pages/ProcessorDashboard";
import LogisticsDashboard from "@/pages/LogisticsDashboard";
import RetailerDashboard from "@/pages/RetailerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ChatProvider>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Public consumer flow */}
                  <Route path="/scan" element={<ConsumerScan />} />
                  <Route path="/product/:batchId" element={<ConsumerBatchDetails />} />

                  {/* Role dashboards */}
                  <Route
                    path="/farmer/*"
                    element={
                      <ProtectedRoute>
                        <RoleRoute allow={["FARMER"]}>
                          <FarmerDashboard />
                        </RoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/processor/*"
                    element={
                      <ProtectedRoute>
                        <RoleRoute allow={["PROCESSOR"]}>
                          <ProcessorDashboard />
                        </RoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/logistics/*"
                    element={
                      <ProtectedRoute>
                        <RoleRoute allow={["LOGISTICS"]}>
                          <LogisticsDashboard />
                        </RoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/retailer/*"
                    element={
                      <ProtectedRoute>
                        <RoleRoute allow={["RETAILER"]}>
                          <RetailerDashboard />
                        </RoleRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <RoleRoute allow={["ADMIN"]}>
                          <AdminDashboard />
                        </RoleRoute>
                      </ProtectedRoute>
                    }
                  />

                  {/* Legacy redirect */}
                  <Route path="/select-role" element={<Navigate to="/register" replace />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
              <ChatSidebar />
              <Toaster richColors position="top-right" closeButton />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </ChatProvider>
  );
}
