import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroEquipe from "./pages/CadastroEquipe";
import PainelAbsenteismo from "./pages/PainelAbsenteismo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastroEquipe />} />
        <Route path="/painel" element={<PainelAbsenteismo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;