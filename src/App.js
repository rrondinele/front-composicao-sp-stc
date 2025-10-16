import React from "react";
import FormEquipe from "./components/FormEquipe";
import ListaEquipes from "./components/ListaEquipes";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Cadastro de Equipes</h1>
        <FormEquipe />
        <ListaEquipes />
      </div>
    </div>
  );
}

export default App;