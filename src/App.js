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
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Estado inicial como false
  const [loginData, setLoginData] = useState({ matricula: "", senha: "" });
  const [loading, setLoading] = useState(false);
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

  // Mapeamento de matrícula para nome do supervisor
  const supervisorMapping = {
    "11101": "11101 - RONDINELE ARAUJO CARVALHO",
    "16032": "016032 - WAGNER AUGUSTO DA SILVA MAURO",
    "6061": "006061 - JULIO CESAR PEREIRA DA SILVA",
    "15540": "015540 - EDER JORDELINO GONCALVES CAETANO",
    "18505": "018505 - DIEGO RAFAEL DE MELO SILVA",
    // Adicione outros supervisores aqui
  };

  // Efeito para verificar se o usuário está logado
  useEffect(() => {
    // Verifica se o usuário está logado no localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  
    // Se o usuário estiver logado, preencha o supervisor automaticamente
    if (loggedIn) {
      const userRole = localStorage.getItem("userRole");
      const matricula = localStorage.getItem("matricula");
  
      if (userRole === "supervisor" && supervisorMapping[matricula]) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          supervisor: supervisorMapping[matricula],
        }));
      }
    }
  }, []); // Array de dependências vazio para executar apenas uma vez

  // Efeito para persistir o estado de login
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  // Função para lidar com o login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://composicao-sp-soc.onrender.com/login", loginData);
      if (response.data.message === "Login bem-sucedido") {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", response.data.user.role); // Salva o papel do usuário
        localStorage.setItem("matricula", String(loginData.matricula)); // Salva a matrícula do usuário
  
        // Se o usuário for supervisor, salva o nome do supervisor no localStorage
        if (response.data.user.role === "supervisor" && supervisorMapping[loginData.matricula]) {
          localStorage.setItem("supervisorName", supervisorMapping[loginData.matricula]);
        }
  
        toast.success("Login bem-sucedido!");
  
        // Se o usuário for supervisor, preenche o campo supervisor automaticamente
        if (response.data.user.role === "supervisor" && supervisorMapping[loginData.matricula]) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            supervisor: supervisorMapping[loginData.matricula],
          }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    // 1. Redefinir todos os estados locais
    setIsLoggedIn(false); // Estado de login
    setLoginData({ matricula: "", senha: "" }); // Dados de login
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
    }); // Dados do formulário
  
    // 2. Limpar o localStorage
    localStorage.clear(); // Remove tudo do localStorage
  };
  
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
    { value: "018505 - DIEGO RAFAEL DE MELO SILVA", label: "018505 - DIEGO RAFAEL DE MELO SILVA" },
    { value: "015540 - EDER JORDELINO GONCALVES CAETANO", label: "015540 - EDER JORDELINO GONCALVES CAETANO"},
    { value: "006061 - JULIO CESAR PEREIRA DA SILVA", label: "006061 - JULIO CESAR PEREIRA DA SILVA" },
    { value: "016032 - WAGNER AUGUSTO DA SILVA MAURO", label: "016032 - WAGNER AUGUSTO DA SILVA MAURO" },
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
    // Adicione mais mapeamentos conforme necessário
  };
  const [equipeOptionsCompleta, setEquipeOptionsCompleta] = useState([
    { value: "CCE001", label: "CCE001" },
    { value: "CCE002", label: "CCE002" },
    { value: "CCE003", label: "CCE003" },
    { value: "CCE004", label: "CCE004" }, 
  ]);  
  const [equipeOptions, setEquipeOptions] = useState(equipeOptionsCompleta);
  const [placaVeiculoOptionsCompleta, setPlacaVeiculoOptionsCompleta] = useState([
    { value: "EWF2J53", label: "EWF2J53" },
    { value: "EXS4G32", label: "EXS4G32" },
    { value: "FCY0E42", label: "FCY0E42" },
    { value: "FGA8E51", label: "FGA8E51" },
  ]);
  const [placaVeiculoOptions, setPlacaVeiculoOptions] = useState(placaVeiculoOptionsCompleta);
  const statusOptions = [
    { value: "AFASTADO", label: "AFASTADO" },
    { value: "ATESTADO", label: "ATESTADO" },
    { value: "BASE", label: "BASE" },
    { value: "CAMPO", label: "CAMPO" },
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
            !parceirosUtilizados.includes(eletricista.value) && // Remove os parceiros já cadastrados
            !motoristasUtilizados.includes(eletricista.value) // Remove os motoristas já cadastrados
        );
        setEletricistaParceiroOptions(updatedParceiroOptions);
      } else if (fieldName === "eletricista_parceiro") {
        // Remove o parceiro selecionado da lista de motoristas
        const updatedMotoristaOptions = eletricistasCompletos.filter(
          (eletricista) =>
            eletricista.value !== selectedOption.value && // Remove o parceiro selecionado
            !motoristasUtilizados.includes(eletricista.value) && // Remove os motoristas já cadastrados
            !parceirosUtilizados.includes(eletricista.value) // Remove os parceiros já cadastrados
        );
        setEletricistaMotoristaOptions(updatedMotoristaOptions);
      }
    }
  };

  const fetchEquipesPorData = async (data) => {
    try {
      const userRole = localStorage.getItem("userRole"); // Obtém o papel do usuário
      const matricula = localStorage.getItem("matricula"); // Obtém a matrícula do usuário
  
      const params = {
        data: data, // Filtra pela data selecionada
      };
  
      // Se o usuário for supervisor, adiciona o filtro de supervisor
      if (userRole === "supervisor" && supervisorMapping[matricula]) {
        params.supervisor = supervisorMapping[matricula];
      }
  
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams", { params });
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

  // Função para buscar equipes não finalizadas ou pendentes
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userRole"); // Obtém o papel do usuário
      const matricula = localStorage.getItem("matricula"); // Obtém a matrícula do usuário
      console.log("Matrícula no localStorage:", matricula, typeof matricula); // Verifica o valor e o tipo
  
      // Validação da data
      if (!formData.data_atividade) {
        toast.error("Por favor, selecione uma data.");
        return;
      }
  
      const params = {
        data: formData.data_atividade, // Filtra pela data selecionada
        role: userRole, // Envia o papel do usuário
      };
  
      // Se o usuário for supervisor, adiciona o filtro de supervisor
      if (userRole === "supervisor" && supervisorMapping[matricula]) {
        console.log("Valor no supervisorMapping:", supervisorMapping[matricula]);
        params.supervisor = supervisorMapping[matricula]; // Envia o valor completo do supervisor
      }
      console.log("Parâmetros enviados:", params); // Log dos parâmetros
  
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams", { params });
  
      if (response.data && Array.isArray(response.data)) {
        setTeams(response.data);
      } else {
        setTeams([]);
        toast.warning("Nenhuma equipe encontrada.");
      }
    } catch (error) {
      toast.error("Erro ao buscar equipes.");
      console.error("Erro ao buscar equipes:", error);
      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar equipes finalizadas
  const fetchFinalizedTeams = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userRole"); // Obtém o papel do usuário
      const matricula = localStorage.getItem("matricula"); // Obtém a matrícula do usuário
      console.log("Matrícula no localStorage:", matricula, typeof matricula); // Verifica o valor e o tipo
  
      // Validação da data
      if (!formData.data_atividade) {
        toast.error("Por favor, selecione uma data.");
        return;
      }
  
      const params = {
        data: formData.data_atividade, // Filtra pela data selecionada
        role: userRole, // Envia o papel do usuário
      };
  
      // Se o usuário for supervisor, adiciona o filtro de supervisor
      if (userRole === "supervisor" && supervisorMapping[matricula]) {
        params.supervisor = supervisorMapping[matricula]; // Envia o valor completo do supervisor
      }
  
      console.log("Parâmetros enviados:", params); // Log dos parâmetros
  
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams/finalizadas", { params });
      setTeams(response.data); // Atualiza a lista de equipes
    } catch (error) {
      toast.error("Erro ao buscar equipes finalizadas.");
      console.error("Erro ao buscar equipes finalizadas:", error);
      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
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
  };
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
        isDisabled={true} // Torna o campo somente leitura
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