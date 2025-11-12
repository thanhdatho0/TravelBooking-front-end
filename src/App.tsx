import PageHeader from "./components/PageHeader/PageHeader";
import "./App.css";
import Slider from "./components/Slider/Slider";
import PageBody from "./components/PageBody/PageBody";
import PageFooter from "./components/PageFooter/PageFooter";

function App() {
  return (
    <>
      <PageHeader />
      <Slider />
      <PageBody />
      <PageFooter />
    </>
  );
}

export default App;
