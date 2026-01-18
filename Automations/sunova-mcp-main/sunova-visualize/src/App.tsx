import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import VideoEditorPage from "./pages/VideoEditor";
import StoryboardPage from "./pages/StoryboardPage";
import BetaInfo from "./pages/BetaInfo";
import BetaApply from "./pages/BetaApply";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Tutorials from "./pages/Tutorials";
import Careers from "./pages/Careers";
import ComingSoon from "./pages/ComingSoon";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CommercialLicense from "./pages/CommercialLicense";
import RefundPolicy from "./pages/RefundPolicy";
import AdminApiLogs from "./pages/admin/AdminApiLogs";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminBetaApplications from "./pages/admin/AdminBetaApplications";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  // Create QueryClient inside component to avoid dispatcher issues during hot reloads
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/beta" element={<BetaInfo />} />
            <Route path="/beta/apply" element={<BetaApply />} />
            {/* Footer Pages */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/about" element={<ComingSoon title="About Us Coming Soon" description="We're crafting our story. Check back soon to learn more about our mission and team!" />} />
            <Route path="/contact" element={<ComingSoon title="Contact Coming Soon" description="We're setting up our contact channels. For now, reach us at hello@sunova.ai" />} />
            <Route path="/press" element={<ComingSoon title="Press Kit Coming Soon" description="Media resources and press materials will be available here soon." />} />
            <Route path="/best-practices" element={<ComingSoon title="Best Practices Coming Soon" description="Expert tips and workflow guides for creating amazing music videos will be available soon." />} />
            <Route path="/trends" element={<ComingSoon title="Music Video Trends Coming Soon" description="Stay ahead with the latest trends in AI music video generation. Content coming soon!" />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/license" element={<CommercialLicense />} />
            <Route path="/refunds" element={<RefundPolicy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/video-editor" element={
              <ProtectedRoute>
                <VideoEditorPage />
              </ProtectedRoute>
            } />
            <Route path="/project/:id/storyboard" element={
              <ProtectedRoute>
                <StoryboardPage />
              </ProtectedRoute>
            } />
            <Route path="/project/:id/video-editor" element={
              <ProtectedRoute>
                <VideoEditorPage />
              </ProtectedRoute>
            } />
            {/* Admin Routes */}
            <Route path="/admin/api-logs" element={
              <ProtectedAdminRoute>
                <AdminApiLogs />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/tasks" element={
              <ProtectedAdminRoute>
                <AdminTasks />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/transactions" element={
              <ProtectedAdminRoute>
                <AdminTransactions />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedAdminRoute>
                <AdminUsers />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/users/:userId" element={
              <ProtectedAdminRoute>
                <AdminUserDetail />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/beta-applications" element={
              <ProtectedAdminRoute>
                <AdminBetaApplications />
              </ProtectedAdminRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
