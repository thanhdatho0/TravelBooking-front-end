import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageHeader from "./components/PageHeader/pageHeader";
import "./App.css";
import Slider from "./components/Slider/slider";
import PageBody from "./components/PageBody/pageBody";
import PageFooter from "./components/PageFooter/pageFooter";
import AccommodationDetailPage from "./pages/AccommodationDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";
import BookingPage from "./pages/BookingPage";
import VnpayCallbackPage from "./pages/VnpayCallbackPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentVnpayReturnPage from "./pages/PaymentVnpayReturnPage";
import PaymentFailPage from "./pages/PaymentFailPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageHeader />

      <main className="w-full">
        <Routes>
          // App.jsx (Home route)
          <Route
            path="/"
            element={
              <>
                <Slider />

                {/* Search form nằm dưới slider */}
                <div className="w-full mt-15">
                  <PageBody />
                </div>
              </>
            }
          />
          <Route
            path="/accommodations/:id"
            element={<AccommodationDetailPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/booking/:accomId" element={<BookingPage />} />
          <Route
            path="/payment/vnpay-callback"
            element={<VnpayCallbackPage />}
          />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route
            path="/payment/vnpay-return"
            element={<PaymentVnpayReturnPage />}
          />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
        </Routes>
      </main>

      <PageFooter />
    </BrowserRouter>
  );
}

export default App;
