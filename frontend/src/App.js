import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import History from "./pages/History";
import Landing from "./marketing/Landing";
import Deals from "./marketing/Deals";
import Trends from "./marketing/Trends";
import Alerts from "./marketing/Alerts";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/history/:id" element={<History />} />
        <Route path="/landing" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
