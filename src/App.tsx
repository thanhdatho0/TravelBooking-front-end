import PageHeader from "./components/PageHeader/pageHeader";
import "./App.css";
import Slider from "./components/Slider/slider";
import PageBody from "./components/PageBody/pageBody";
import PageFooter from "./components/PageFooter/pageFooter";

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
