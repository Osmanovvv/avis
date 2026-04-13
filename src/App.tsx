import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Index from "./pages/Index";

const Solutions = lazy(() => import("./pages/Solutions"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Cases = lazy(() => import("./pages/Cases"));
const About = lazy(() => import("./pages/About"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Industries = lazy(() => import("./pages/Industries"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminDocumentation = lazy(() => import("./pages/AdminDocumentation"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/solutions/:slug" element={<ServiceDetail />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/privacy" element={<Privacy />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminContent />} />
                  <Route path="/admin/media" element={<AdminMedia />} />
                  <Route path="/admin/leads" element={<AdminLeads />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/documentation" element={<AdminDocumentation />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
