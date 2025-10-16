import React, { useEffect, useState } from "react";
import api from "../services/api";

const ListaEquipes = () => {
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const response = await api.get("/equipes");
        setEquipes(response.data);
      } catch (err) {
        console.error("Erro ao buscar equipes:", err);
      }
    };
    fetchEquipes();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Equipes Cadastradas</h2>
      <ul>
        {equipes.map((equipe, index) => (
          <li key={index} className="mb-2">
            <strong>{equipe.nome}</strong>: {equipe.membros}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaEquipes;