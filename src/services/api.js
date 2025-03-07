import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // URL do backend
});

// Função para buscar todas as equipes
export const getTeams = async () => {
  try {
    const response = await api.get("/teams");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar equipes:", error);
    throw error;
  }
};

// Função para cadastrar uma nova equipe
export const createTeam = async (teamData) => {
  try {
    const response = await api.post("/teams", teamData);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar equipe:", error);
    throw error;
  }
};

// Função para editar uma equipe
export const updateTeam = async (id, teamData) => {
  try {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  } catch (error) {
    console.error("Erro ao editar equipe:", error);
    throw error;
  }
};

// Função para excluir uma equipe
export const deleteTeam = async (id) => {
  try {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir equipe:", error);
    throw error;
  }
};

// Função para marcar equipes como finalizadas
export const finalizeTeams = async () => {
  try {
    const response = await api.put("/teams/finalizar");
    return response.data;
  } catch (error) {
    console.error("Erro ao finalizar equipes:", error);
    throw error;
  }
};

export default api;