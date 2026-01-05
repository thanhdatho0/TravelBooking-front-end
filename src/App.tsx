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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageHeader />

      <main className="w-full">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Slider />
                <PageBody />
              </>
            }
          />
          <Route
            path="/accommodations/:id"
            element={<AccommodationDetailPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/booking/:accomId" element={<BookingPage />} />
        </Routes>
      </main>

      <PageFooter />
    </BrowserRouter>
  );
}

export default App;
