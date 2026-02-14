import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import History from "./pages/History";
import Landing from "./marketing/Landing";
import Deals from "./marketing/Deals";
import Trends from "./marketing/Trends";
import Alerts from "./marketing/Alerts";
import AppLayout from "./components/AppLayout";
import "./styles/theme.css";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:pid" element={<Product />} />
          <Route path="/history/:id" element={<History />} />
          <Route path="/landing" element={<Home />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
