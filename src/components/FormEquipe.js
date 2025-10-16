import React, { useState } from "react";
import api from "../services/api";

const FormEquipe = () => {
  const [equipe, setEquipe] = useState({
    nome: "",
    membros: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipe({ ...equipe, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/equipes", equipe);
      alert("Equipe cadastrada com sucesso!");
      setEquipe({ nome: "", membros: "" }); // Limpa o formulário
    } catch (err) {
      console.error("Erro ao cadastrar equipe:", err);
      alert("Erro ao cadastrar equipe.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Equipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nome da Equipe</label>
          <input
            type="text"
            name="nome"
            value={equipe.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Membros</label>
          <input
            type="text"
            name="membros"
            value={equipe.membros}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default FormEquipe;