import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageHeader from "./components/PageHeader/pageHeader";
import "./App.css";
import Slider from "./components/Slider/slider";
import PageBody from "./components/PageBody/pageBody";
import PageFooter from "./components/PageFooter/pageFooter";
import AccommodationDetailPage from "./pages/AccommodationDetailPage";

function App() {
  return (
    <BrowserRouter>
      <PageHeader />

      {/* Container căn giữa cho toàn bộ nội dung page */}
      <main className="w-full max-w-7xl mx-auto px-4">
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
        </Routes>
      </main>

      <PageFooter />
    </BrowserRouter>
  );
}

export default App;
