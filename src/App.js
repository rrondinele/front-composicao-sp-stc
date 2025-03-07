import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import * as XLSX from "xlsx";
import exitIcon from "./exit.png"; // Importando o ícone de logout
import excelIcon from "./excel.png"; // Importando o ícone de logout

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ matricula: "", senha: "" });
  const [formData, setFormData] = useState({
    data_atividade: "",
    supervisor: "",
    status: "",
    eletricista_motorista: "",
    eletricista_parceiro: "",
    equipe: "",
    servico: "",
    placa_veiculo: "",
  });

  const [teams, setTeams] = useState([]);
  const [editId, setEditId] = useState(null);

  // Opções para os campos de seleção
  const supervisorOptions = [
    { value: "0000-JOAO", label: "0000-JOAO" },
    { value: "1111-PEDRO", label: "1111-PEDRO" },
    { value: "2222-ANA", label: "2222-ANA" },
  ];

  const statusOptions = [
    { value: "AFASTADO", label: "AFASTADO" },
    { value: "ATESTADO", label: "ATESTADO" },
    { value: "BASE", label: "BASE" },
    { value: "CAMPO", label: "CAMPO" },
    { value: "DESLIGADO", label: "DESLIGADO" },
    { value: "FALTA", label: "FALTA" },
    { value: "FERIAS", label: "FERIAS" },
    { value: "FOLGA", label: "FOLGA" },
    { value: "LICENCA MATERNIDADE", label: "LICENCA MATERNIDADE" },
    { value: "LICENCA PATERNIDADE", label: "LICENCA PATERNIDADE" },
    { value: "PERIODICO", label: "PERIODICO" },
    { value: "SUSPENSAO", label: "SUSPENSAO" },
    { value: "TREINAMENTO", label: "TREINAMENTO" },
  ];

  const equipeOptions = [
    { value: "CCE001", label: "CCE001" },
    { value: "CCE002", label: "CCE002" },
    { value: "CCE003", label: "CCE003" },
    { value: "CCE004", label: "CCE004" },
    { value: "CCE005", label: "CCE005" },
  ];

  const eletricistaMotoristaOptions = [
    { value: "1212 - JOAO", label: "1212 - JOAO" },
    { value: "1111 - MARIA", label: "1111 - MARIA" },
  ];

  const eletricistaParceiroOptions = [
    { value: "1212 - JOAO", label: "1212 - JOAO" },
    { value: "1111 - MARIA", label: "1111 - MARIA" },
  ];

  const servicoOptions = [
    { value: "AFERICAO", label: "AFERICAO" },
    { value: "CORTE", label: "CORTE" },
    { value: "LIGACAO NOVA", label: "LIGACAO NOVA" },
    { value: "PROJETO RAMAL", label: "PROJETO RAMAL" },
    { value: "RELIGA", label: "RELIGA" },
    { value: "TMA", label: "TMA" },
  ];

  const placaVeiculoOptions = [
    { value: "EWF2J53", label: "EWF2J53" },
    { value: "EXS4G32", label: "EXS4G32" },
    { value: "FCY0E42", label: "FCY0E42" },
    { value: "FGA8E51", label: "FGA8E51" },
    { value: "FJH0F61", label: "FJH0F61" },
  ];

  // Estilo minimalista para o react-select
  const minimalStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e5e7eb",
      borderRadius: "0.375rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#f3f4f6" : "white",
      color: state.isSelected ? "#1f2937" : "#4b5563",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      border: "1px solid #e5e7eb",
    }),
  };

  // Função para validar se todos os campos estão preenchidos
  const validateForm = () => {
    const requiredFields = [
      "data_atividade",
      "supervisor",
      "status",
      "eletricista_motorista",
      "eletricista_parceiro",
      "equipe",
      "servico",
      "placa_veiculo",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Por favor, preencha o campo: ${field.replace("_", " ")}`);
        return false;
      }
    }
    return true;
  };

  // Função para lidar com mudanças nos campos de seleção
  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData({ ...formData, [fieldName]: selectedOption.value });
  };

  // Função para lidar com o login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", loginData);
      if (response.data.message === "Login bem-sucedido") {
        setIsLoggedIn(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ matricula: "", senha: "" });
  };

  // Função para buscar equipes
  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/teams", {
        params: {
          data: formData.data_atividade,
        },
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
    }
  };

  // Função para buscar equipes finalizadas
  const fetchFinalizedTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/teams/finalizadas", {
        params: {
          data: formData.data_atividade,
        },
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Erro ao buscar equipes finalizadas:", error);
    }
  };

  // Função para enviar o formulário de cadastro/edição
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Valida os campos antes de cadastrar

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/teams/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/teams", formData);
      }

      setFormData({
        data_atividade: "",
        supervisor: "",
        status: "",
        eletricista_motorista: "",
        eletricista_parceiro: "",
        equipe: "",
        servico: "",
        placa_veiculo: "",
      });

      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao cadastrar equipe.");
    }
  };

  // Função para editar uma equipe
  const handleEdit = (team) => {
    setFormData(team);
    setEditId(team.id);
  };

  // Função para excluir uma equipe
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        await axios.delete(`http://localhost:5000/teams/${id}`);
        fetchTeams();
      } catch (error) {
        console.error("Erro ao excluir equipe:", error);
      }
    }
  };

  // Função para finalizar registros
  const handleFinalizar = async () => {
    if (window.confirm("Confirma que todos os registros estão revisados? Isso limpará a tela.")) {
      try {
        await axios.put("http://localhost:5000/teams/finalizar");
        setTeams([]);
        setFormData({
          data_atividade: "",
          supervisor: "",
          status: "",
          eletricista_motorista: "",
          eletricista_parceiro: "",
          equipe: "",
          servico: "",
          placa_veiculo: "",
        });
        alert("Registros finalizados com sucesso!");
      } catch (error) {
        console.error("Erro ao finalizar registros:", error);
        alert("Erro ao finalizar registros.");
      }
    }
  };

  // Função para exportar a tabela para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(teams);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipes Cadastradas");
    XLSX.writeFile(workbook, "equipes_cadastradas.xlsx");
  };

  // Se o usuário não estiver logado, exibe a tela de login
  if (!isLoggedIn) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="matricula"
              placeholder="Matrícula"
              value={loginData.matricula}
              onChange={(e) => setLoginData({ ...loginData, matricula: e.target.value })}
              required
              className="w-full p-2 border rounded-md"
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={loginData.senha}
              onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Se o usuário estiver logado, exibe a tela de cadastro
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
        Cadastro de Equipes
      </h1>
      <div className="flex justify-end gap-4 mt-4 mb-6">
        <button
          onClick={handleLogout}
          className="bg-white-600 text-white px-2 py-2 rounded-md hover:bg-white-700 flex items-center"
        >
          <img src={exitIcon} alt="Sair" className="w-12 h-12 mr-2" />
          
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="data_atividade"
            value={formData.data_atividade}
            onChange={(e) => setFormData({ ...formData, data_atividade: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
          <Select
            options={supervisorOptions}
            placeholder="Selecione o(a) Supervisor(a)"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "supervisor")}
            value={supervisorOptions.find(option => option.value === formData.supervisor)}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            options={statusOptions}
            placeholder="Selecione Status"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "status")}
            value={statusOptions.find(option => option.value === formData.status)}
            styles={minimalStyles}
            className="w-full"
          />
          <Select
            options={equipeOptions}
            placeholder="Selecione Equipe"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "equipe")}
            value={equipeOptions.find(option => option.value === formData.equipe)}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            options={eletricistaMotoristaOptions}
            placeholder="Selecione Eletricista Motorista"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "eletricista_motorista")}
            value={eletricistaMotoristaOptions.find(option => option.value === formData.eletricista_motorista)}
            styles={minimalStyles}
            className="w-full"
          />
          <Select
            options={eletricistaParceiroOptions}
            placeholder="Selecione Eletricista Parceiro(a)"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "eletricista_parceiro")}
            value={eletricistaParceiroOptions.find(option => option.value === formData.eletricista_parceiro)}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            options={servicoOptions}
            placeholder="Selecione Serviço"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "servico")}
            value={servicoOptions.find(option => option.value === formData.servico)}
            styles={minimalStyles}
            className="w-full"
          />
          <Select
            options={placaVeiculoOptions}
            placeholder="Selecione Placa"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "placa_veiculo")}
            value={placaVeiculoOptions.find(option => option.value === formData.placa_veiculo)}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          {editId ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
      <button
        onClick={fetchTeams}
        className="mt-4 w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500"
      >
        Buscar Equipes Pendentes
      </button>

      <button
        onClick={fetchFinalizedTeams}
        className="mt-4 w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
      >
        Buscar Equipes Finalizadas
      </button>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">Equipes Cadastradas</h2>
      <div className="overflow-x-auto mt-3">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="p-2 border">Data</th>
              <th className="p-2 border w-56">Supervisor(a)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Equipe</th>
              <th className="p-2 border">Eletricista Motorista</th>
              <th className="p-2 border">Eletricista Parceiro(a)</th>
              <th className="p-2 border">Serviço</th>
              <th className="p-2 border">Placa</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {teams.map((team) => (
              <tr key={team.id} className="text-center">
                <td className="p-2 border">{team.data_atividade}</td>
                <td className="p-2 border">{team.supervisor}</td>
                <td className="p-2 border">{team.status}</td>
                <td className="p-2 border">{team.equipe}</td>
                <td className="p-2 border">{team.eletricista_motorista}</td>
                <td className="p-2 border">{team.eletricista_parceiro}</td>
                <td className="p-2 border">{team.servico}</td>
                <td className="p-2 border">{team.placa_veiculo}</td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button onClick={() => handleEdit(team)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(team.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleFinalizar} className="mt-4 w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700">
        Finalizar
      </button>
      <div className="flex justify-start gap-4 mt-4">
        <button
          onClick={exportToExcel}
          className="bg-white-600 text-white px-4 py-2 rounded-md hover:bg-white-700 flex items-center"          
        >
           <img src={excelIcon} alt="Excel" className="w-12 h-12 mr-2" />
          
        </button>

      </div>
    </div>
  );
}

export default App;