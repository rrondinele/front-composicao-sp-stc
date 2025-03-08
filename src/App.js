import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import * as XLSX from "xlsx";
import exitIcon from "./exit.png"; // Importando o ícone de logout
import excelIcon from "./excel.png"; // Importando o ícone de logout
import { toast, ToastContainer } from "react-toastify"; // Para feedback visual
import "react-toastify/dist/ReactToastify.css"; // Estilos do toast

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
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento

  // Opções para os campos de seleção
  const supervisorOptions = [
    { value: "016032 - WAGNER AUGUSTO DA SILVA MAURO", label: "016032 - WAGNER AUGUSTO DA SILVA MAURO" },
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
    { value: "015644 - ADEILDO JOSE DE LIMA JUNIOR", label: "015644 - ADEILDO JOSE DE LIMA JUNIOR" },
    { value: "017968 - ADILSON NUNES DA SILVA", label: "017968 - ADILSON NUNES DA SILVA" },
    { value: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA", label: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA" },
    { value: "008811 - ALESSANDRO LUIZ DA SILVA", label: "008811 - ALESSANDRO LUIZ DA SILVA" },
  ];

  const eletricistaParceiroOptions = [
    { value: "015644 - ADEILDO JOSE DE LIMA JUNIOR", label: "015644 - ADEILDO JOSE DE LIMA JUNIOR" },
    { value: "017968 - ADILSON NUNES DA SILVA", label: "017968 - ADILSON NUNES DA SILVA" },
    { value: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA", label: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA" },
    { value: "008811 - ALESSANDRO LUIZ DA SILVA", label: "008811 - ALESSANDRO LUIZ DA SILVA" },
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
        toast.error(`Por favor, preencha o campo: ${field.replace("_", " ")}`);
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
    setLoading(true);
    try {
      const response = await axios.post("https://composicao-sp-soc.onrender.com/login", loginData);
      if (response.data.message === "Login bem-sucedido") {
        setIsLoggedIn(true);
        toast.success("Login bem-sucedido!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ matricula: "", senha: "" });
    toast.info("Logout realizado com sucesso!");
  };

  // Função para buscar equipes
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams", {
        params: {
          data: formData.data_atividade,
        },
      });
      setTeams(response.data);
    } catch (error) {
      toast.error("Erro ao buscar equipes.");
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar equipes finalizadas
  const fetchFinalizedTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams/finalizadas", {
        params: {
          data: formData.data_atividade,
        },
      });
      setTeams(response.data);
    } catch (error) {
      toast.error("Erro ao buscar equipes finalizadas.");
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar o formulário de cadastro/edição
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`https://composicao-sp-soc.onrender.com/teams/${editId}`, formData);
        toast.success("Equipe atualizada com sucesso!");
        setEditId(null);
      } else {
        await axios.post("https://composicao-sp-soc.onrender.com/teams", formData);
        toast.success("Equipe cadastrada com sucesso!");
      }

      // Resetar apenas os campos que devem ser limpos
      setFormData((prevFormData) => ({
        ...prevFormData, // Mantém os campos que não devem ser resetados
        eletricista_motorista: "", // Reseta o eletricista motorista
        eletricista_parceiro: "", // Reseta o eletricista parceiro
        equipe: "", // Reseta a equipe
        placa_veiculo: "", // Reseta a placa do veículo
      }));

      fetchTeams(); // Atualiza a lista de equipes
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao cadastrar equipe.");
    } finally {
      setLoading(false);
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
      setLoading(true);
      try {
        await axios.delete(`https://composicao-sp-soc.onrender.com/teams/${id}`);
        toast.success("Equipe excluída com sucesso!");
        fetchTeams();
      } catch (error) {
        toast.error("Erro ao excluir equipe.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para finalizar registros
  const handleFinalizar = async () => {
    if (window.confirm("Confirma que todos os registros estão revisados? Isso limpará a tela.")) {
      setLoading(true);
      try {
        await axios.put("https://composicao-sp-soc.onrender.com/teams/finalizar");

        // Resetar todos os campos do formulário
        setFormData({
          data_atividade: "",
          supervisor: "",
          status: "",
          eletricista_motorista: "",
          eletricista_parceiro: "",
          equipe: "",
          servico: "",
          placa_veiculo: "",
          finalizado: false,
        });

        setTeams([]); // Limpa a lista de equipes
        toast.success("Registros finalizados com sucesso!");
      } catch (error) {
        toast.error("Erro ao finalizar registros.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para exportar a tabela para Excel
  const exportToExcel = () => {
    // Mapeia apenas as colunas visíveis e formata a data
    const visibleColumns = teams.map(team => [
      new Date(team.data_atividade).toLocaleDateString('pt-BR'), // Formata a data para DD/MM/AAAA
      team.supervisor,
      team.status,
      team.eletricista_motorista,
      team.eletricista_parceiro,
      team.equipe,
      team.servico,
      team.placa_veiculo,
    ]);

    // Adiciona cabeçalhos personalizados
    const header = [
      "Data Atividade",
      "Supervisor",
      "Status",
      "Eletricista Motorista",
      "Eletricista Parceiro",
      "Equipe",
      "Serviço",
      "Placa Veículo",
    ];

    // Cria a planilha com cabeçalhos personalizados
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...visibleColumns]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipes Cadastradas");
    XLSX.writeFile(workbook, "equipes_cadastradas.xlsx");
    toast.success("Tabela exportada para Excel com sucesso!");
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
        <ToastContainer />
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
            value={supervisorOptions.find(option => option.value === formData.supervisor) || null}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            options={statusOptions}
            placeholder="Selecione Status"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "status")}
            value={statusOptions.find(option => option.value === formData.status) || null}
            styles={minimalStyles}
            className="w-full"
          />
          <Select
            options={equipeOptions}
            placeholder="Selecione Equipe"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "equipe")}
            value={equipeOptions.find(option => option.value === formData.equipe) || null}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            options={eletricistaMotoristaOptions}
            placeholder="Selecione Eletricista Motorista"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "eletricista_motorista")}
            value={eletricistaMotoristaOptions.find(option => option.value === formData.eletricista_motorista) || null}
            styles={minimalStyles}
            className="w-full"
          />
          <Select
            options={eletricistaParceiroOptions}
            placeholder="Selecione Eletricista Parceiro(a)"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "eletricista_parceiro")}
            value={eletricistaParceiroOptions.find(option => option.value === formData.eletricista_parceiro) || null}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            options={servicoOptions}
            placeholder="Selecione Serviço"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "servico")}
            value={servicoOptions.find(option => option.value === formData.servico) || null}
            styles={minimalStyles}
            className="w-full"
          />
          <Select
            options={placaVeiculoOptions}
            placeholder="Selecione Placa"
            onChange={(selectedOption) => handleSelectChange(selectedOption, "placa_veiculo")}
            value={placaVeiculoOptions.find(option => option.value === formData.placa_veiculo) || null}
            styles={minimalStyles}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Carregando..." : editId ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
      <button
        onClick={fetchTeams}
        className="mt-4 w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500"
        disabled={loading}
      >
        {loading ? "Carregando..." : "Buscar Equipes Pendentes"}
      </button>

      <button
        onClick={fetchFinalizedTeams}
        className="mt-4 w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
        disabled={loading}
      >
        {loading ? "Carregando..." : "Buscar Equipes Finalizadas"}
      </button>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">Equipes Cadastradas</h2>
      <div className="overflow-x-auto mt-3">
  <table className="min-w-full bg-white border rounded-lg" style={{ tableLayout: 'auto' }}>
    <thead>
      <tr className="bg-gray-200 text-gray-700 text-sm">
        <th className="p-2 border whitespace-nowrap">Data</th>
        <th className="p-2 border whitespace-nowrap">Supervisor(a)</th>
        <th className="p-2 border whitespace-nowrap">Status</th>
        <th className="p-2 border whitespace-nowrap">Equipe</th>
        <th className="p-2 border whitespace-nowrap">Eletricista Motorista</th>
        <th className="p-2 border whitespace-nowrap">Eletricista Parceiro(a)</th>
        <th className="p-2 border whitespace-nowrap">Serviço</th>
        <th className="p-2 border whitespace-nowrap">Placa</th>
        <th className="p-2 border whitespace-nowrap">Ações</th>
      </tr>
    </thead>
    <tbody className="text-sm">
      {teams.map((team) => (
        <tr key={team.id} className="text-center">
          <td className="p-2 border whitespace-nowrap">{team.data_atividade}</td>
          <td className="p-2 border whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
            {team.supervisor}
          </td>
          <td className="p-2 border whitespace-nowrap">{team.status}</td>
          <td className="p-2 border whitespace-nowrap">{team.equipe}</td>
          <td className="p-2 border whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
            {team.eletricista_motorista}
          </td>
          <td className="p-2 border whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
            {team.eletricista_parceiro}
          </td>
          <td className="p-2 border whitespace-nowrap">{team.servico}</td>
          <td className="p-2 border whitespace-nowrap">{team.placa_veiculo}</td>
          <td className="p-2 border whitespace-nowrap flex gap-2 justify-center">
            <button
              onClick={() => handleEdit(team)}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
              disabled={loading}
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(team.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              disabled={loading}
            >
              Excluir
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <button
        onClick={handleFinalizar}
        className="mt-4 w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Carregando..." : "Finalizar"}
      </button>
      <div className="flex justify-start gap-4 mt-4">
        <button
          onClick={exportToExcel}
          className="bg-white-600 text-white px-4 py-2 rounded-md hover:bg-white-700 flex items-center"
        >
          <img src={excelIcon} alt="Excel" className="w-12 h-12 mr-2" />
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;