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
import { supervisorOptions } from "./components/supervisor";
import { eletricistasCompletos, br0MappingPorEstado } from "./components/eletricistas";
import { equipeOptionsCompleta } from "./components/equipes";
import { placaVeiculoOptionsCompleta } from "./components/PlacasVeiculos";
import { statusOptions } from "./components/status";
import { servicoOptionsPorEstado } from "./components/servicos";
import { Tooltip } from 'react-tooltip';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Estado inicial como false
  const [loginData, setLoginData] = useState({ matricula: "", senha: "" });
  const [loading, setLoading] = useState(false);

  const estadoAtual = localStorage.getItem("estado") || "SP";
  const [eletricistaMotoristaOptions, setEletricistaMotoristaOptions] = useState(
    eletricistasCompletos[estadoAtual]
  );
  const [eletricistaParceiroOptions, setEletricistaParceiroOptions] = useState(
    eletricistasCompletos[estadoAtual]
  );
  const [equipeOptions, setEquipeOptions] = useState(equipeOptionsCompleta[estadoAtual] || []);
  const [placaVeiculoOptions, setPlacaVeiculoOptions] = useState(placaVeiculoOptionsCompleta[estadoAtual]);
  const br0Mapping = br0MappingPorEstado[estadoAtual];


  const getServicosDisponiveis = () => {
  const estado = localStorage.getItem("estado") || "SP";
  return servicoOptionsPorEstado[estado] || [];
};


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

  const isDataAtividadeExpirada = (dataString) => {
    if (!dataString) return false;
    const hoje = new Date();
    const dataAtividade = new Date(dataString);
    const diffEmDias = (hoje - dataAtividade) / (1000 * 60 * 60 * 24);
    return diffEmDias > 2;
  };

  // Mapeamento de matrícula para nome do supervisor
  const supervisorMapping = {
    "11101" : "011101 - RONDINELE ARAUJO CARVALHO",
    "16032" : "016032 - WAGNER AUGUSTO DA SILVA MAURO",
    "6061"  : "006061 - JULIO CESAR PEREIRA DA SILVA",
    "15540" : "015540 - EDER JORDELINO GONCALVES CAETANO",
    "18505" : "018505 - DIEGO RAFAEL DE MELO SILVA",
    "4438"  : "004438 - JOSE OSCAR DO NASCIMENTO DE AZEVEDO",
    "15843" : "015843 - HUGO PACHECO DOS SANTOS", 
    "17451" : "017451 - WESLEY PEREIRA DE SOUZA GOMES",    
    "15729" : "015729 - TIAGO DE SOUZA MATTOS",
    "18089" : "018089 - SILVIA HELENA MARIOTINI DE ALCANTARA",
    "18273" : "018273 - JALISON NAVEGA",
    "18274" : "018274 - MARLON SILVA PINTO",
    "18275" : "018275 - FELIPE NATAL DIAS",
    "18276" : "018276 - RODOLPHO GOMES MOCAIBER",
    "18412" : "018412 - ADISON DOS SANTOS",
    "18466" : "018466 - JOAO BATISTA FRANCISCO",
    "18468" : "018468 - DANIEL PEIXOTO AREAS",
    "18761" : "018761 - GELSON ERIS MOREIRA PASSOS",
    "18575" : "018575 - MARCO ANTONIO DE NOVAES OLIVEIRA",
    "19231" : "019231 - RAFAEL BATISTA PIASSA",
    "19412" : "019412 - ROBSON JOSE DE QUEIROZ GUIMARAES",
    "19485" : "019485 - RENATO SANTIAGO SILVA",
    "19704" : "019704 - JORGE MICHAEL DE CASTRO PIRES",
    "20116" : "020116 - WANDERSON FERREIRA DA CONCEICAO"
  };

  // Efeito para verificar se o usuário está logado
useEffect(() => {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  setIsLoggedIn(loggedIn);

  if (loggedIn) {
    const userRole = localStorage.getItem("userRole");
    const matricula = localStorage.getItem("matricula");

    if (userRole === "supervisor" && supervisorMapping[matricula]) {
      // Define o estado baseado na matrícula do supervisor
      const estado = definirEstadoPorSupervisor(matricula);
      localStorage.setItem("estado", estado);
      
      setFormData(prevFormData => ({
        ...prevFormData,
        supervisor: supervisorMapping[matricula],
      }));

      // Atualiza as opções baseadas no estado
      setEletricistaMotoristaOptions(eletricistasCompletos[estado] || []);
      setEletricistaParceiroOptions(eletricistasCompletos[estado] || []);
      setEquipeOptions(equipeOptionsCompleta[estado] || []);
      setPlacaVeiculoOptions(placaVeiculoOptionsCompleta[estado] || []);
    }
  }
}, []);

  // Efeito para persistir o estado de login
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

// Função para mapear matrícula para estado
const definirEstadoPorSupervisor = (matricula) => {
  const supervisoresRJ = ["17451", "15843", "4438", "15729"];
  const supervisoresRJB = [
    "18089", "18273", "18274", "18275", "18276", 
    "18412", "18466", "18468", "18761", "18575",
    "19231", "19412", "19485", "19704", "20116"
  ];
  
  if (supervisoresRJ.includes(matricula)) {
    return "RJ";
  } else if (supervisoresRJB.includes(matricula)) {
    return "RJB";
  } else {
    return "SP";
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
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", response.data.user.role);
      localStorage.setItem("matricula", String(loginData.matricula));

      // 🟡 AQUI: salva o estado (SP ou RJ) com base na matrícula
      const estado = definirEstadoPorSupervisor(loginData.matricula);
      localStorage.setItem("estado", estado);

      // Limpa a lista de equipes visíveis
      setTeams([]);
      
      // Reseta o estado de edição
      setEditId(null);

      // Se o usuário for supervisor, salva o nome do supervisor
      const supervisorName = response.data.user.role === "supervisor" && supervisorMapping[loginData.matricula] 
        ? supervisorMapping[loginData.matricula] 
        : "";

      if (supervisorName) {
        localStorage.setItem("supervisorName", supervisorName);
      }

      toast.success("Login bem-sucedido!");

      // Limpa todos os campos, mantendo apenas o supervisor se aplicável
      setFormData({
        data_atividade: "",
        supervisor: supervisorName, // Mantém apenas se for supervisor
        status: "",
        eletricista_motorista: "",
        br0_motorista: "",
        eletricista_parceiro: "",
        br0_parceiro: "",
        equipe: "",
        servico: "",
        placa_veiculo: "",
      });

      // Reseta as opções de seleção para os valores padrão
      setEletricistaMotoristaOptions(eletricistasCompletos[estado] || []);
      setEletricistaParceiroOptions(eletricistasCompletos[estado] || []);
      setEquipeOptions(equipeOptionsCompleta[estado] || []);
      setPlacaVeiculoOptions(placaVeiculoOptionsCompleta[estado] || []);
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
    const supervisor = formData.supervisor;
    const estado = localStorage.getItem("estado") || "SP";
  
    setFormData({
      data_atividade: "",
      supervisor: supervisor,
      status: null,
      eletricista_motorista: null,
      br0_motorista: "",
      eletricista_parceiro: null,
      br0_parceiro: "",
      equipe: null,
      servico: null,
      placa_veiculo: null,
    });
  
    setEletricistaMotoristaOptions(eletricistasCompletos[estado]);
    setEletricistaParceiroOptions(eletricistasCompletos[estado]);
    setEquipeOptions(equipeOptionsCompleta[estado]);
    setPlacaVeiculoOptions(placaVeiculoOptionsCompleta[estado]);
  };

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
  
  const handleSelectChange = async (selectedOption, fieldName) => {
    // Atualiza o formData com o valor selecionado
    let updatedFormData = { ...formData, [fieldName]: selectedOption.value };
  
    // Se o campo "status" for alterado e for diferente de "CAMPO", definir valores como "N/A"
    if (fieldName === "status" && selectedOption.value !== "CAMPO") {
      updatedFormData = {
        ...updatedFormData, // Mantém os valores existentes
        eletricista_motorista: "N/A", // Preenche "Eletricista_Motorista" com "N/A"
        equipe: "N/A", // Preenche "Equipe" com "N/A"
        servico: "N/A", // Preenche "Servico" com "N/A"
        placa_veiculo: "N/A", // Preenche "Placa" com "N/A"        
      };
    }  
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
        const updatedParceiroOptions = eletricistasCompletos[estadoAtual].filter(
          (eletricista) =>
            eletricista.value !== selectedOption.value &&
            !parceirosUtilizados.includes(eletricista.value) &&
            !motoristasUtilizados.includes(eletricista.value)
        );
        setEletricistaParceiroOptions(updatedParceiroOptions);
      } else if (fieldName === "eletricista_parceiro") {
        const updatedMotoristaOptions = eletricistasCompletos[estadoAtual].filter(
          (eletricista) =>
            eletricista.value !== selectedOption.value &&
            !motoristasUtilizados.includes(eletricista.value) &&
            !parceirosUtilizados.includes(eletricista.value)
        );
        setEletricistaMotoristaOptions(updatedMotoristaOptions);
      }
    }
  };
  // Adicione esta função para verificar se os campos devem estar desabilitados
  const shouldDisableFields = () => {
    return formData.status && formData.status !== "CAMPO";
  };

  const fetchEquipesPorData = async (data) => {
    try {
      const params = {
        data: data, // Filtra apenas pela data selecionada
      };
  
      const response = await axios.get("https://composicao-sp-soc.onrender.com/teams", { params });
      return response.data; // Retorna as equipes cadastradas na data
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
      return []; // Retorna um array vazio em caso de erro
    }
  };

  const atualizarListasDeSelecao = (equipesCadastradas) => {
    // Extrai todos os eletricistas já utilizados (motoristas e parceiros)
    const todosEletricistasUtilizados = [
      ...equipesCadastradas.map(e => e.eletricista_motorista),
      ...equipesCadastradas.map(e => e.eletricista_parceiro)
    ].filter(e => e && e !== "N/A"); // Remove valores nulos e "N/A"
  
    // Filtra as opções disponíveis removendo os já utilizados
    const eletricistasDisponiveis = eletricistasCompletos[estadoAtual].filter(
      e => !todosEletricistasUtilizados.includes(e.value)
    );
  
    // Atualiza ambas as listas com os mesmos valores disponíveis
    setEletricistaMotoristaOptions(eletricistasDisponiveis);
    setEletricistaParceiroOptions(eletricistasDisponiveis);
  
    // Atualiza também as outras listas (equipe e placa) se necessário
    const equipesUtilizadas = equipesCadastradas.map(e => e.equipe).filter(Boolean);
    const placasUtilizadas = equipesCadastradas.map(e => e.placa_veiculo).filter(Boolean);
  
    setEquipeOptions(equipeOptionsCompleta[estadoAtual].filter(e => !equipesUtilizadas.includes(e.value)));
    setPlacaVeiculoOptions(placaVeiculoOptionsCompleta[estadoAtual].filter(p => !placasUtilizadas.includes(p.value)));
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

  // Função para buscar equipes não finalizadas ou pendentes
const fetchTeams = async () => {
  setLoading(true);
  try {
    const userRole = localStorage.getItem("userRole"); // Obtém o papel do usuário
    const matricula = localStorage.getItem("matricula"); // Obtém a matrícula do usuário

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
      params.supervisor = supervisorMapping[matricula]; // Usa o mapeamento para enviar o valor completo
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

  // Função para enviar o formulário de cadastro/edição
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      // Prepara os dados para envio
      const dadosParaEnvio = {
        ...formData,
        // Se status não for CAMPO, envia equipe como string vazia ao invés de N/A
        equipe: formData.status !== "CAMPO" ? "" : formData.equipe,
        servico: formData.status !== "CAMPO" ? "" : formData.servico,
        placa_veiculo: formData.status !== "CAMPO" ? "" : formData.placa_veiculo
      };
  
      const url = editId 
        ? `https://composicao-sp-soc.onrender.com/teams/${editId}` 
        : "https://composicao-sp-soc.onrender.com/teams";
      const method = editId ? "put" : "post";
  
      const response = await axios[method](url, dadosParaEnvio);
  
      if (response.status === 201 || response.status === 200) {
        toast.success(editId ? "Equipe atualizada com sucesso!" : "Equipe cadastrada com sucesso!");
        setEditId(null);
        
        // Busca as equipes cadastradas na mesma data
        const equipesCadastradas = await fetchEquipesPorData(formData.data_atividade);
        
        // Atualiza as listas de seleção com base nas equipes cadastradas
        atualizarListasDeSelecao(equipesCadastradas);
        
        // Limpa apenas os campos que devem ser resetados
        setFormData((prevFormData) => ({
          ...prevFormData,
          eletricista_motorista: null,
          br0_motorista: "",
          eletricista_parceiro: null,
          br0_parceiro: "",
          equipe: null,
          placa_veiculo: null,
        }));

        // Recarrega as opções de acordo com o estado atual
        const estado = localStorage.getItem("estado") || "SP";
        setEletricistaMotoristaOptions(eletricistasCompletos[estado]);
        setEletricistaParceiroOptions(eletricistasCompletos[estado]);
        setEquipeOptions(equipeOptionsCompleta[estado]);
        setPlacaVeiculoOptions(placaVeiculoOptionsCompleta[estado]);
        
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

  const handleEdit = async (team) => {
    const estado = localStorage.getItem("estado") || "SP";

    const currentOptions = {
      equipe: { value: team.equipe, label: team.equipe },
      motorista: { value: team.eletricista_motorista, label: team.eletricista_motorista },
      parceiro: { value: team.eletricista_parceiro, label: team.eletricista_parceiro },
      placa: { value: team.placa_veiculo, label: team.placa_veiculo }
    };
  
    // 2. Atualiza as opções incluindo os valores atuais
    setEquipeOptions([
      currentOptions.equipe,
      ...equipeOptionsCompleta[estado].filter(o => o.value !== team.equipe)
    ]);
  
    setEletricistaMotoristaOptions([
      currentOptions.motorista,
      ...eletricistasCompletos[estado].filter(o => o.value !== team.eletricista_motorista)
    ]);
  
    setEletricistaParceiroOptions([
      currentOptions.parceiro,
      ...eletricistasCompletos[estado].filter(o => o.value !== team.eletricista_parceiro)
    ]);
  
    setPlacaVeiculoOptions([
      currentOptions.placa,
      ...placaVeiculoOptionsCompleta[estado].filter(o => o.value !== team.placa_veiculo)
    ]);
  
    // 3. Atualiza o formData
    setFormData({
      ...team,
      br0_motorista: br0Mapping[team.eletricista_motorista] || "",
      br0_parceiro: br0Mapping[team.eletricista_parceiro] || ""
    });
  
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

      // Resetar os campos do formulário, mantendo o supervisor
      setFormData((prevFormData) => ({
        ...prevFormData, // Mantém todos os valores anteriores
        data_atividade: "",
        status: "",
        eletricista_motorista: "",
        br0_motorista: "",
        eletricista_parceiro: "",
        br0_parceiro: "",
        equipe: "",
        servico: "",
        placa_veiculo: "",
        finalizado: false,
      }));

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
    // Mapeia apenas as colunas visíveis e formata a data corretamente
    const visibleColumns = teams.map(team => {
      // Corrige o problema da data adicionando um dia (se necessário)
      const dataAtividade = new Date(team.data_atividade);
      
      // Ajusta para o fuso horário local (Brasil)
      const dataAjustada = new Date(dataAtividade.getTime() + dataAtividade.getTimezoneOffset() * 60000);
      
      // Formata como DD/MM/AAAA
      const dataFormatada = dataAjustada.toLocaleDateString('pt-BR');
      
      return [
        dataFormatada, // Data já formatada corretamente
        team.supervisor,
        team.status,
        team.eletricista_motorista,
        team.br0_motorista,
        team.eletricista_parceiro,
        team.br0_parceiro,
        team.equipe,
        team.servico,
        team.placa_veiculo,
      ];
    });

    // Adiciona cabeçalhos personalizados
    const header = [
      "Data Atividade",
      "Supervisor",
      "Status",
      "Eletricista Motorista",
      "Matricula Distribuidora Motorista",
      "Eletricista Parceiro",
      "Matricula Distribuidora Parceiro(a)",
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
                Matrícula
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
                Senha
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
            Esqueceu a senha? 
            <a 
            href="https://wa.me/551122558877"
            className="text-blue-400 hover:underline ml-2"
            target="_blank" 
            rel="noopener noreferrer"
            >
              Clique Aqui
            </a>
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
    data-tooltip-id="clear-tooltip"
    data-tooltip-content="Limpar formulário"
    onClick={handleClearForm}
    className="bg-white-600 text-white px-2 py-2 rounded-md hover:bg-white-700 flex items-center"
    //title="Limpar formulário"
  >
    <img src={clearIcon} alt="Limpar" className="w-12 h-12 mr-2" />
  </button>
  <Tooltip id="clear-tooltip" />

  {/* Botão Sair (extremo direito) */}
  <button
    data-tooltip-id="clear-tooltip"
    data-tooltip-content="Sair"
    onClick={handleLogout}
    className="bg-white-600 text-white px-2 py-2 rounded-md hover:bg-white-700 flex items-center"
    //title="Sair"
  >
    <img src={exitIcon} alt="Sair" className="w-12 h-12 mr-2" />
  </button>
  <Tooltip id="clear-tooltip" />
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
        options={supervisorOptions[estadoAtual] || []}
        placeholder="Selecione o(a) Supervisor(a)"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "supervisor")}
        value={
          (supervisorOptions[estadoAtual] || []).find(
            (option) => option.value === formData.supervisor
          ) || null
        }
        styles={minimalStyles}
        className="w-full"
        isDisabled={true}
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
        onChange={(selectedOption) =>
          handleSelectChange(selectedOption, "equipe")
        }
        value={
          formData.equipe
            ? equipeOptions.find(option => option.value === formData.equipe)
            : null
        }
        styles={minimalStyles}
        className="w-full"
        isDisabled={shouldDisableFields() || loading}
      />

      {/* Campo: Eletricista Motorista */}
      <Select
        options={eletricistaMotoristaOptions}
        placeholder="Selecione Eletricista Motorista"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "eletricista_motorista")}
        value={
          eletricistaMotoristaOptions.find(option => option.value === formData.eletricista_motorista) || null
        }
        styles={minimalStyles}
        className="w-full"
        isDisabled={shouldDisableFields() || loading}
      />
      {/* Campo: BR0 Motorista */}
      <input
        type="text"
        name="br0_motorista"
        placeholder="Matricula Distribuidora Motorista"
        value={formData.br0_motorista}
        readOnly
        className="w-full p-2 border rounded-md bg-gray-100"
      />
      {/* Campo: Eletricista Parceiro */}
      <Select
        options={eletricistaParceiroOptions}
        placeholder="Selecione Eletricista Parceiro(a)"
        onChange={(selectedOption) =>
          handleSelectChange(selectedOption, "eletricista_parceiro")
        }
        value={
          formData.eletricista_parceiro
            ? eletricistaParceiroOptions.find(option => option.value === formData.eletricista_parceiro)
            : null
        }
        styles={minimalStyles}
        className="w-full"
      />
      {/* Campo: BR0 Parceiro */}
      <input
        type="text"
        name="br0_parceiro"
        placeholder="Matricula Distribuidora Parceiro(a)"
        value={formData.br0_parceiro}
        readOnly
        className="w-full p-2 border rounded-md bg-gray-100"
      />
      {/* Campo: Serviço */}
      <Select
        options={getServicosDisponiveis()}
        placeholder="Selecione Serviço"
        onChange={(selectedOption) => handleSelectChange(selectedOption, "servico")}
        value={
          formData.servico
            ? getServicosDisponiveis().find(option => option.value === formData.servico)
            : null
        }
        styles={minimalStyles}
        className="w-full"
        isDisabled={shouldDisableFields() || loading}
      />

      {/* Campo: Placa do Veículo */}
      <Select
        options={placaVeiculoOptions}
        placeholder="Selecione Placa"
        onChange={(selectedOption) =>
          handleSelectChange(selectedOption, "placa_veiculo")
        }
        value={
          formData.placa_veiculo
            ? placaVeiculoOptions.find(option => option.value === formData.placa_veiculo)
            : null
        }
        styles={minimalStyles}
        className="w-full"
        isDisabled={shouldDisableFields() || loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          //disabled={loading}
          disabled={loading || isDataAtividadeExpirada(formData.data_atividade)}
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
                  //disabled={loading}
                  disabled={loading || isDataAtividadeExpirada(team.data_atividade)}
                  aria-label={`Editar equipe ${team.equipe}`}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs"
                  //disabled={loading}
                  disabled={loading || isDataAtividadeExpirada(team.data_atividade)}
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
          data-tooltip-id="clear-tooltip"
          data-tooltip-content="Exportar em Excel"
          onClick={exportToExcel}
          className="bg-white-600 text-white px-4 py-2 rounded-md hover:bg-white-700 flex items-center"
          //title="Exportar em Excel"
        >
          <img src={excelIcon} alt="Excel" className="w-12 h-12 mr-2" />
        </button>
        <Tooltip id="clear-tooltip" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;