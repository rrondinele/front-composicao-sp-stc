import React, { useState, useEffect } from "react";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  finalizeTeams,
} from "../services/api"; // Importe as funções do serviço

function CadastroEquipe() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    data_atividade: "",
    supervisor: "",
    status: "",
    equipe: "",
    eletricista_motorista: "",
    eletricista_parceiro: "",
    servico: "",
    placa_veiculo: "",
  });

  // Buscar equipes ao carregar o componente
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  // Cadastrar uma nova equipe
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeam(formData);
      alert("Equipe cadastrada com sucesso!");
      setFormData({
        data_atividade: "",
        supervisor: "",
        status: "",
        equipe: "",
        eletricista_motorista: "",
        eletricista_parceiro: "",
        servico: "",
        placa_veiculo: "",
      });
      fetchTeams(); // Atualiza a lista de equipes
    } catch (error) {
      alert("Erro ao cadastrar equipe.");
    }
  };

  // Editar uma equipe
  const handleEdit = async (id) => {
    try {
      await updateTeam(id, formData);
      alert("Equipe atualizada com sucesso!");
      fetchTeams(); // Atualiza a lista de equipes
    } catch (error) {
      alert("Erro ao editar equipe.");
    }
  };

  // Excluir uma equipe
  const handleDelete = async (id) => {
    try {
      await deleteTeam(id);
      alert("Equipe excluída com sucesso!");
      fetchTeams(); // Atualiza a lista de equipes
    } catch (error) {
      alert("Erro ao excluir equipe.");
    }
  };

  // Marcar equipes como finalizadas
  const handleFinalize = async () => {
    try {
      await finalizeTeams();
      alert("Equipes finalizadas com sucesso!");
      fetchTeams(); // Atualiza a lista de equipes
    } catch (error) {
      alert("Erro ao finalizar equipes.");
    }
  };

  return (
    <div>
      <h1>Cadastro de Equipes</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário */}
        <input
          type="date"
          name="data_atividade"
          value={formData.data_atividade}
          onChange={(e) =>
            setFormData({ ...formData, data_atividade: e.target.value })
          }
        />
        {/* Outros campos */}
        <button type="submit">Cadastrar</button>
      </form>

      <h2>Equipes Cadastradas</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.equipe} - {team.supervisor}
            <button onClick={() => handleEdit(team.id)}>Editar</button>
            <button onClick={() => handleDelete(team.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      <button onClick={handleFinalize}>Finalizar Equipes</button>
    </div>
  );
}

export default CadastroEquipe;