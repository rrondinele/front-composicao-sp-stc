import React, { useState,useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import * as XLSX from "xlsx";
import cenegedtIcon from "./ceneged.png"; // Importando o ícone ceneged
import exitIcon from "./exit.png"; // Importando o ícone logout
import clearIcon from "./clear.png"; // Importando o ícone Clear
import excelIcon from "./excel.png"; // Importando o ícone excel
import { toast, ToastContainer } from "react-toastify"; // Para feedback visual
import "react-toastify/dist/ReactToastify.css"; // Estilos do toast

function App() {
  //const [isLoggedIn, setIsLoggedIn] = useState(false); // Defina como true para ignorar o login

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);


  const [loginData, setLoginData] = useState({ matricula: "", senha: "" });
  const [formData, setFormData] = useState({
    data_atividade: "",
    supervisor: "",
    status: "",
    eletricista_motorista: "",
    br0_motorista: "", 
    eletricista_parceiro: "",
    br0_parceiro: "", 
    equipe: "",
    servico: "",
    placa_veiculo: "",
  });

  const [teams, setTeams] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento

   useEffect(() => {
    setFormData({
      data_atividade: "",
      supervisor: "",
      status: "",
      eletricista_motorista: "",
      br0_motorista: "",
      eletricista_parceiro: "",
      br0_parceiro: "",
      equipe: "",
      servico: "",
      placa_veiculo: "",
    });
  }, []);
  
  // Função para limpar o formulário
  const handleClearForm = () => {
    setFormData({
      data_atividade: "",
      supervisor: "",
      status: "",
      eletricista_motorista: "",
      br0_motorista: "",
      eletricista_parceiro: "",
      br0_parceiro: "",
      equipe: "",
      servico: "",
      placa_veiculo: "",
    });
  };

  // Opções para os campos de seleção
  const supervisorOptions = [
    { value: "016032 - WAGNER AUGUSTO DA SILVA MAURO", label: "016032 - WAGNER AUGUSTO DA SILVA MAURO" },
    { value: "1111-PEDRO", label: "1111-PEDRO" },
    { value: "2222-ANA", label: "2222-ANA" },
  ];

  const [eletricistasCompletos, setEletricistasCompletos] = useState([
    { value: "015644 - ADEILDO JOSE DE LIMA JUNIOR", label: "015644 - ADEILDO JOSE DE LIMA JUNIOR" },
    { value: "017968 - ADILSON NUNES DA SILVA", label: "017968 - ADILSON NUNES DA SILVA" },
    { value: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA", label: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA" },
    { value: "008811 - ALESSANDRO LUIZ DA SILVA", label: "008811 - ALESSANDRO LUIZ DA SILVA" },
    // Adicione outros eletricistas aqui
  ]);
  
  const [eletricistaMotoristaOptions, setEletricistaMotoristaOptions] = useState(eletricistasCompletos);
  const [eletricistaParceiroOptions, setEletricistaParceiroOptions] = useState(eletricistasCompletos);

  const br0Mapping = {
    "015644 - ADEILDO JOSE DE LIMA JUNIOR": "BR0320023558",
    "017968 - ADILSON NUNES DA SILVA": "BR0298512908",
    "015646 - ALBERTO MIRANDA SCUOTEGUAZZA": "BR0286139398",
    "008811 - ALESSANDRO LUIZ DA SILVA": "BR0225606358",
    "015521 - ALEX GOMES PINHEIRO": "BR0490393838",
    "011689 - ALEX MUNIZ SANTANA": "BR0427895538",
    // Adicione mais mapeamentos conforme necessário
  };

  const [equipeOptionsCompleta, setEquipeOptionsCompleta] = useState([
    { value: "CCE001", label: "CCE001" },
    { value: "CCE002", label: "CCE002" },
    { value: "CCE003", label: "CCE003" },
    { value: "CCE004", label: "CCE004" },
    { value: "CCE005", label: "CCE005" },  ]);  
  const [equipeOptions, setEquipeOptions] = useState(equipeOptionsCompleta);

  const [placaVeiculoOptionsCompleta, setPlacaVeiculoOptionsCompleta] = useState([
    { value: "EWF2J53", label: "EWF2J53" },
    { value: "EXS4G32", label: "EXS4G32" },
    { value: "FCY0E42", label: "FCY0E42" },
    { value: "FGA8E51", label: "FGA8E51" },
    { value: "FJH0F61", label: "FJH0F61" },
  ]);

  const [placaVeiculoOptions, setPlacaVeiculoOptions] = useState(placaVeiculoOptionsCompleta);

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

  const servicoOptions = [
    { value: "AFERICAO", label: "AFERICAO" },
    { value: "CORTE", label: "CORTE" },
    { value: "LIGACAO NOVA", label: "LIGACAO NOVA" },
    { value: "PROJETO RAMAL", label: "PROJETO RAMAL" },
    { value: "RELIGA", label: "RELIGA" },
    { value: "TMA", label: "TMA" },
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

  // Funcao Buscar as equipes cadastradas para a data selecionada. + Atualizar as listas de seleção com base nas equipes cadastradas.
  const handleDateChange = async (e) => {
    const dataSelecionada = e.target.value;
    setFormData({ ...formData, data_atividade: dataSelecionada });
  
    if (dataSelecionada) {
      const equipesCadastradas = await fetchEquipesPorData(dataSelecionada);
      atualizarListasDeSelecao(equipesCadastradas);
    }
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

  const handleSelectChange = async (selectedOption, fieldName) => {
    // Atualiza o formData com o valor selecionado
    const updatedFormData = { ...formData, [fieldName]: selectedOption.value };
  
    // Preenche automaticamente o campo BR0 Motorista ou BR0 Parceiro
    if (fieldName === "eletricista_motorista") {
      updatedFormData.br0_motorista = br0Mapping[selectedOption.value] || "";
    } else if (fieldName === "eletricista_parceiro") {
      updatedFormData.br0_parceiro = br0Mapping[selectedOption.value] || "";
    }
  
    // Atualiza o estado do formData
    setFormData(updatedFormData);
  
    // Busca os registros do banco para a data selecionada
    if (formData.data_atividade) {
      const equipesCadastradas = await fetchEquipesPorData(formData.data_atividade);
  
      // Extrai os eletricistas já cadastrados (motoristas e parceiros)
      const motoristasUtilizados = equipesCadastradas.map((equipe) => equipe.eletricista_motorista);
      const parceirosUtilizados = equipesCadastradas.map((equipe) => equipe.eletricista_parceiro);
  
      // Filtra as listas de eletricistas com base nos registros do banco e na seleção atual
      if (fieldName === "eletricista_motorista") {
        // Remove o motorista selecionado da lista de parceiros
        const updatedParceiroOptions = eletricistasCompletos.filter(
          (eletricista) =>
            eletricista.value !== selectedOption.value && // Remove o motorista selecionado
            !parceirosUtilizados.includes(eletricista.value) // Remove os parceiros já cadastrados
        );
        setEletricistaParceiroOptions(updatedParceiroOptions);
      } else if (fieldName === "eletricista_parceiro") {
        // Remove o parceiro selecionado da lista de motoristas
        const updatedMotoristaOptions = eletricistasCompletos.filter(
          (eletricista) =>
            eletricista.value !== selectedOption.value && // Remove o parceiro selecionado
            !motoristasUtilizados.includes(eletricista.value) // Remove os motoristas já cadastrados
        );
        setEletricistaMotoristaOptions(updatedMotoristaOptions);
      }
    }
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
  localStorage.removeItem("isLoggedIn"); // 🔹 Agora remove do localStorage
  setLoginData({ matricula: "", senha: "" });
  toast.info("Logout realizado com sucesso!");
};

  const fetchEquipesPorData = async (data) => {
    try {
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams", {
        params: {
          data: data, // Filtra as equipes pela data
        },
      });
      return response.data; // Retorna as equipes cadastradas na data
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
      return []; // Retorna um array vazio em caso de erro
    }
  };

  const atualizarListasDeSelecao = (equipesCadastradas) => {
    // Extrai os valores já utilizados
    const equipesUtilizadas = equipesCadastradas.map((equipe) => equipe.equipe);
    const motoristasUtilizados = equipesCadastradas.map((equipe) => equipe.eletricista_motorista);
    const parceirosUtilizados = equipesCadastradas.map((equipe) => equipe.eletricista_parceiro);
    const placasUtilizadas = equipesCadastradas.map((equipe) => equipe.placa_veiculo);
  
    // Filtra as opções disponíveis
    const equipesDisponiveis = equipeOptionsCompleta.filter(
      (equipe) => !equipesUtilizadas.includes(equipe.value)
    );
    const motoristasDisponiveis = eletricistasCompletos.filter(
      (motorista) => !motoristasUtilizados.includes(motorista.value) && !parceirosUtilizados.includes(motorista.value)
    );
    const parceirosDisponiveis = eletricistasCompletos.filter(
      (parceiro) => !parceirosUtilizados.includes(parceiro.value) && !motoristasUtilizados.includes(parceiro.value)
    );
    const placasDisponiveis = placaVeiculoOptionsCompleta.filter(
      (placa) => !placasUtilizadas.includes(placa.value)
    );
  
    // Atualiza os estados das listas de seleção
    setEquipeOptions(equipesDisponiveis);
    setEletricistaMotoristaOptions(motoristasDisponiveis);
    setEletricistaParceiroOptions(parceirosDisponiveis);
    setPlacaVeiculoOptions(placasDisponiveis);
  };

  // Função para buscar equipes
  const fetchTeams = async () => {
    setLoading(true); // Ativa o estado de carregamento
    try {
      // Define os parâmetros da requisição
      const params = {};
      if (formData.data_atividade) {
        // Adiciona o filtro por data apenas se formData.data_atividade estiver preenchido
        params.data = formData.data_atividade;
      }
  
      // Faz a requisição ao backend
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams", {
        params, // Passa os parâmetros da requisição
      });
  
      // Atualiza o estado teams com os dados retornados
      if (response.data && Array.isArray(response.data)) {
        setTeams(response.data);
      } else {
        // Se response.data não for um array, define teams como um array vazio
        setTeams([]);
        toast.warning("Nenhuma equipe encontrada.");
      }
    } catch (error) {
      // Exibe uma mensagem de erro em caso de falha na requisição
      toast.error("Erro ao buscar equipes.");
      console.error("Erro ao buscar equipes:", error);
    } finally {
      setLoading(false); // Desativa o estado de carregamento
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
      const url = editId 
        ? `https://composicao-sp-soc.onrender.com/teams/${editId}` 
        : "https://composicao-sp-soc.onrender.com/teams";
      const method = editId ? "put" : "post";
  
      const response = await axios[method](url, formData);
  
      if (response.status === 201 || response.status === 200) {
        toast.success(editId ? "Equipe atualizada com sucesso!" : "Equipe cadastrada com sucesso!");
        setEditId(null);
  
        // Busca as equipes cadastradas na mesma data
        const equipesCadastradas = await fetchEquipesPorData(formData.data_atividade);
  
        // Atualiza as listas de seleção com base nas equipes cadastradas
        atualizarListasDeSelecao(equipesCadastradas);
  
        // Limpa apenas os campos que devem ser resetados
        setFormData((prevFormData) => ({
          ...prevFormData, // Mantém os campos que não devem ser limpos
          eletricista_motorista: "", // Reseta o eletricista motorista
          br0_motorista: "", // Reseta o BR0 motorista
          eletricista_parceiro: "", // Reseta o eletricista parceiro
          br0_parceiro: "", // Reseta o BR0 parceiro
          equipe: "", // Reseta a equipe
          placa_veiculo: "", // Reseta a placa do veículo
        }));
  
        // Atualiza a lista de equipes
        fetchTeams();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao cadastrar/atualizar equipe.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team) => {
    setFormData({
      data_atividade: team.data_atividade, // Data da atividade
      supervisor: team.supervisor, // Supervisor
      status: team.status, // Status
      eletricista_motorista: team.eletricista_motorista, // Eletricista Motorista
      br0_motorista: br0Mapping[team.eletricista_motorista] || "", // BR0 Motorista
      eletricista_parceiro: team.eletricista_parceiro, // Eletricista Parceiro
      br0_parceiro: br0Mapping[team.eletricista_parceiro] || "", // BR0 Parceiro
      equipe: team.equipe, // Equipe
      servico: team.servico, // Serviço
      placa_veiculo: team.placa_veiculo, // Placa do Veículo
    });
    setEditId(team.id); // Define o ID da equipe que está sendo editada
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
          br0_motorista: "",
          eletricista_parceiro: "",
          br0_parceiro: "",
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
      team.br0_motorista,
      team.eletricista_parceiro,
      team.br0_parceiro,
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
      "BR0 Motorista",
      "Eletricista Parceiro",
      "BR0 Parceiro",
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
<div className="min-h-screen flex items-center justify-center bg-gray-900">
  <div className="p-8 max-w-md w-full bg-gray-800 shadow-lg rounded-lg mt-[-350px]">
    <h1 className="text-3xl font-semibold text-white text-center mb-6">
      Login
    </h1>
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="matricula" className="block text-sm font-medium text-gray-300">
        {/*Matrícula*/}
        </label>
        <input
          type="text"
          id="matricula"
          name="matricula"
          placeholder="Digite sua matrícula"
          value={loginData.matricula}
          onChange={(e) => setLoginData({ ...loginData, matricula: e.target.value })}
          required
          className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-300">
          {/*Senha*/}
        </label>
        <input
          type="password"
          id="senha"
          name="senha"
          placeholder="Digite sua senha"
          value={loginData.senha}
          onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
          required
          className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </div>
    </form>
    <p className="text-gray-400 text-sm text-center mt-4">
          Esqueceu a senha? <a href="#" className="text-blue-400 hover:underline">Pergunte ao Pavão</a>
        </p>
    <ToastContainer />
  </div>
</div>
    );
  }

  // Se o usuário estiver logado, exibe a tela de cadastro
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
          <img src={cenegedtIcon} alt="Ceneged" className="w-12 h-12 mr-2" />
      <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
        Composição de Equipes
      </h1>
      <div className="flex justify-between mt-4 mb-6">
  {/* Botão Limpar (extremo esquerdo) */}
  <button
    onClick={handleClearForm}
    className="bg-white-600 text-white px-2 py-2 rounded-md hover:bg-white-700 flex items-center"
  >
    <img src={clearIcon} alt="Limpar" className="w-12 h-12 mr-2" />
  </button>

  {/* Botão Sair (extremo direito) */}
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
        onChange={handleDateChange} 
        required
        className="w-full p-2 border rounded-md"
      />

      {/* Campo: Supervisor */}
      <Select
        options={supervisorOptions}
        placeholder="Selecione o(a) Supervisor(a)"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "supervisor")}
        value={supervisorOptions.find(option => option.value === formData.supervisor) || null}
        styles={minimalStyles}
        className="w-full"
      />

      {/* Campo: Status */}
      <Select
        options={statusOptions}
        placeholder="Selecione Status"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "status")}
        value={statusOptions.find(option => option.value === formData.status) || null}
        styles={minimalStyles}
        className="w-full"
      />

      {/* Campo: Equipe */}
      <Select
        options={equipeOptions}
        placeholder="Selecione Equipe"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "equipe")}
        value={equipeOptions.find(option => option.value === formData.equipe) || null}
        styles={minimalStyles}
        className="w-full"
      />

      {/* Campo: Eletricista Motorista */}
      <Select
        options={eletricistaMotoristaOptions}
        placeholder="Selecione Eletricista Motorista"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "eletricista_motorista")}
        value={eletricistaMotoristaOptions.find(option => option.value === formData.eletricista_motorista) || null}
        styles={minimalStyles}
        className="w-full"
      />

      {/* Campo: BR0 Motorista */}
      <input
        type="text"
        name="br0_motorista"
        placeholder="BR0 Motorista"
        value={formData.br0_motorista}
        readOnly
        className="w-full p-2 border rounded-md bg-gray-100"
      />

      {/* Campo: Eletricista Parceiro */}
      <Select
        options={eletricistaParceiroOptions}
        placeholder="Selecione Eletricista Parceiro(a)"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "eletricista_parceiro")}
        value={eletricistaParceiroOptions.find(option => option.value === formData.eletricista_parceiro) || null}
        styles={minimalStyles}
        className="w-full"
      />

      {/* Campo: BR0 Parceiro */}
      <input
        type="text"
        name="br0_parceiro"
        placeholder="BR0 Parceiro"
        value={formData.br0_parceiro}
        readOnly
        className="w-full p-2 border rounded-md bg-gray-100"
      />

      {/* Campo: Serviço */}
      <Select
        options={servicoOptions}
        placeholder="Selecione Serviço"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "servico")}
        value={servicoOptions.find(option => option.value === formData.servico) || null}
        styles={minimalStyles}
        className="w-full"
      />

      {/* Campo: Placa do Veículo */}
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
      <tr className="bg-gray-200 text-gray-700 text-xs">
        <th className="p-2 border whitespace-nowrap text-left">Data</th>
        <th className="p-2 border whitespace-nowrap text-left">Supervisor(a)</th>
        <th className="p-2 border whitespace-nowrap text-left">Status</th>
        <th className="p-2 border whitespace-nowrap text-left">Equipe</th>
        <th className="p-2 border whitespace-nowrap text-left">Eletricista Motorista</th>
        <th className="p-2 border whitespace-nowrap text-left">Eletricista Parceiro(a)</th>
        <th className="p-2 border whitespace-nowrap text-left">Serviço</th>
        <th className="p-2 border whitespace-nowrap text-left">Placa</th>
        <th className="p-2 border whitespace-nowrap text-center">Ações</th>
      </tr>
    </thead>
    <tbody className="text-xs">
      {teams && teams.length > 0 ? (
        teams.map((team) => (
          <tr key={team.id}>
            <td className="p-2 border whitespace-nowrap text-left">{team.data_atividade}</td>
            <td className="p-2 border whitespace-nowrap text-left overflow-hidden text-ellipsis max-w-[200px]">
              {team.supervisor}
            </td>
            <td className="p-2 border whitespace-nowrap text-left">{team.status}</td>
            <td className="p-2 border whitespace-nowrap text-left">{team.equipe}</td>
            <td className="p-2 border whitespace-nowrap text-left overflow-hidden text-ellipsis max-w-[200px]">
              {team.eletricista_motorista}
            </td>
            <td className="p-2 border whitespace-nowrap text-left overflow-hidden text-ellipsis max-w-[200px]">
              {team.eletricista_parceiro}
            </td>
            <td className="p-2 border whitespace-nowrap text-left">{team.servico}</td>
            <td className="p-2 border whitespace-nowrap text-left">{team.placa_veiculo}</td>
            <td className="p-2 border whitespace-nowrap text-center">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(team)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-xs"
                  disabled={loading}
                  aria-label={`Editar equipe ${team.equipe}`}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs"
                  disabled={loading}
                  aria-label={`Excluir equipe ${team.equipe}`}
                >
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="p-2 border text-center text-gray-500">
            Nenhuma equipe cadastrada.
          </td>
        </tr>
      )}
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