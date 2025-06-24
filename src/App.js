import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroEquipe from "./pages/CadastroEquipe";
import PainelAbsenteismo from "./pages/PainelAbsenteismo";
import TesteTabela from "./pages/teste-tabela"; // Importe o novo componente
import TesteFiltroPeriodo from "./pages/TesteFiltroPeriodo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastroEquipe />} />
        <Route path="/painel" element={<PainelAbsenteismo />} />
        <Route path="/painel/enelsp" element={<PainelAbsenteismo estado="SP" />} />
        <Route path="/painel/enel-soc-marica" element={<PainelAbsenteismo estado="RJ" />} />
        <Route path="/painel/light-vale" element={<PainelAbsenteismo estado="RJB" />} />
        <Route path="/teste-tabela" element={<TesteTabela />} /> {/* Nova rota */}
        <Route path="/teste-periodo" element={<TesteFiltroPeriodo />} />  {/* <<< Nova Rota */}
        <Route path="/teste-perdiodo" element={<TesteFiltroPeriodo />} />  {/* <<< Nova Rota */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;