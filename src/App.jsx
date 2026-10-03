import { Route, Routes } from "react-router";
import Workspace from "@/components/chrome/Workspace";
import AboutPage from "@/pages/AboutPage";
import CaseStudyPage from "@/pages/CaseStudyPage";
import ContactPage from "@/pages/ContactPage";
import HomePage from "@/pages/HomePage";
import LegalPage from "@/pages/LegalPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ReviewPage from "@/pages/ReviewPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import ServicesPage from "@/pages/ServicesPage";
import WorkPage from "@/pages/WorkPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Workspace />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="work/:slug" element={<CaseStudyPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
