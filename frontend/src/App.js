import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import "@/index.css";
import { Toaster } from "sonner";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileBar from "@/components/layout/StickyMobileBar";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import Chatbot from "@/components/layout/Chatbot";
import BookingFlow from "@/components/booking/BookingFlow";

import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ServicePage from "@/pages/ServicePage";
import DoctorsIndex from "@/pages/DoctorsIndex";
import DoctorProfile from "@/pages/DoctorProfile";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FaqPage from "@/pages/FaqPage";
import PolicyPage from "@/pages/PolicyPage";
import CareersPage from "@/pages/CareersPage";
import OffersPage from "@/pages/OffersPage";
import BookingRouteBridge from "@/pages/BookingRouteBridge";

// Reset scroll on route change; honor in-page #anchors (e.g. Journal TOC).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Layout({ children, onOpenBooking }) {
  return (
    <>
      <Header onOpenBooking={() => onOpenBooking(null)} />
      <main className="pt-[110px] lg:pt-[114px]">{children}</main>
      <Footer />
      <StickyMobileBar onOpenBooking={() => onOpenBooking(null)} />
      <WhatsAppFab />
      <Chatbot onOpenBooking={() => onOpenBooking(null)} />
    </>
  );
}

function AppInner() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSlug, setBookingSlug] = useState(null);

  const openBooking = useCallback((slug = null) => {
    setBookingSlug(slug || null);
    setBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => setBookingOpen(false), []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout onOpenBooking={openBooking}>
        <Routes>
          <Route path="/" element={<HomePage onOpenBooking={() => openBooking(null)} />} />
          <Route path="/category/:slug" element={<CategoryPage onOpenBooking={() => openBooking(null)} />} />
          <Route path="/services/:slug" element={<ServicePage onOpenBooking={(s) => openBooking(s)} />} />
          <Route path="/doctors" element={<DoctorsIndex />} />
          <Route path="/doctors/:slug" element={<DoctorProfile onOpenBooking={() => openBooking(null)} />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost onOpenBooking={() => openBooking(null)} />} />
          <Route path="/about" element={<AboutPage onOpenBooking={() => openBooking(null)} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/offers" element={<OffersPage onOpenBooking={() => openBooking(null)} />} />
          <Route path="/policies/:slug" element={<PolicyPage />} />
          <Route path="/book" element={<BookingRouteBridge onOpenBooking={openBooking} />} />
          <Route path="/book/:slug" element={<BookingRouteBridge onOpenBooking={openBooking} />} />
          <Route path="*" element={<HomePage onOpenBooking={() => openBooking(null)} />} />
        </Routes>
      </Layout>
      <BookingFlow open={bookingOpen} onClose={closeBooking} initialSlug={bookingSlug} />
      <Toaster position="top-center" toastOptions={{ style: { background: "#efdfc8", color: "#483f37", border: "1px solid #b8894a" } }} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <div className="App bg-arabian-white text-armadillo">
      <AppInner />
    </div>
  );
}
