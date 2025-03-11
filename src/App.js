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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [loginData, setLoginData] = useState({ username: "", password: "" });
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

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

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
    { value: "015540 - EDER JORDELINO GONCALVES CAETANO", label: "EDER JORDELINO GONCALVES CAETANO" },
    { value: "006061 - JULIO CESAR PEREIRA DA SILVA", label: "006061 - JULIO CESAR PEREIRA DA SILVA" },
    { value: "016032 - WAGNER AUGUSTO DA SILVA MAURO", label: "016032 - WAGNER AUGUSTO DA SILVA MAURO" },
  ];

  const [eletricistasCompletos, setEletricistasCompletos] = useState([
    [
      { value: "015644 - ADEILDO JOSE DE LIMA JUNIOR", label: "015644 - ADEILDO JOSE DE LIMA JUNIOR" },
      { value: "017968 - ADILSON NUNES DA SILVA", label: "017968 - ADILSON NUNES DA SILVA" },
      { value: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA", label: "015646 - ALBERTO MIRANDA SCUOTEGUAZZA" },
      { value: "008811 - ALESSANDRO LUIZ DA SILVA", label: "008811 - ALESSANDRO LUIZ DA SILVA" },
      { value: "015521 - ALEX GOMES PINHEIRO", label: "015521 - ALEX GOMES PINHEIRO" },
      { value: "011689 - ALEX MUNIZ SANTANA", label: "011689 - ALEX MUNIZ SANTANA" },
      { value: "017400 - ALEXANDRO DOS SANTOS PEREIRA", label: "017400 - ALEXANDRO DOS SANTOS PEREIRA" },
      { value: "016054 - ANDCLER FERNANDES DE SOUZA", label: "016054 - ANDCLER FERNANDES DE SOUZA" },
      { value: "009050 - ANDERSON BATISTA SANTOS", label: "009050 - ANDERSON BATISTA SANTOS" },
      { value: "015285 - ANDERSON BRAZ SOARES DE FREITAS ", label: "015285 - ANDERSON BRAZ SOARES DE FREITAS " },
      { value: "009893 - ANDERSON CLEITON MUNIZ SANTANA", label: "009893 - ANDERSON CLEITON MUNIZ SANTANA" },
      { value: "017949 - BRENO SOUZA DA SILVA", label: "017949 - BRENO SOUZA DA SILVA" },
      { value: "015645 - CAIO ROSCHEL DOS SANTOS", label: "015645 - CAIO ROSCHEL DOS SANTOS" },
      { value: "015245 - CLAUDINEI DIAS DA SILVA", label: "015245 - CLAUDINEI DIAS DA SILVA" },
      { value: "017763 - CRISTYAN LORRAN DOS SANTOS COSTA", label: "017763 - CRISTYAN LORRAN DOS SANTOS COSTA" },
      { value: "017327 - DANIEL MORAES DOS SANTOS", label: "017327 - DANIEL MORAES DOS SANTOS" },
      { value: "017900 - DAWID NERY VIEIRA", label: "017900 - DAWID NERY VIEIRA" },
      { value: "017895 - DENILSON EVANGELISTA DOS SANTOS", label: "017895 - DENILSON EVANGELISTA DOS SANTOS" },
      { value: "016051 - DOUGLAS APARECIDO DE ASSIS", label: "016051 - DOUGLAS APARECIDO DE ASSIS" },
      { value: "009083 - EDENILSON DE PAULA LANA", label: "009083 - EDENILSON DE PAULA LANA" },
      { value: "017899 - EDUARDO DE OLIVEIRA MOREIRA", label: "017899 - EDUARDO DE OLIVEIRA MOREIRA" },
      { value: "017896 - EDUARDO LOPES DA SILVA", label: "017896 - EDUARDO LOPES DA SILVA" },
      { value: "017395 - EDSON CIPRIANO MEIRELES DA SILVA", label: "017395 - EDSON CIPRIANO MEIRELES DA SILVA" },
      { value: "013113 - ELSON DOUGLAS DOS ANJOS BARRETO", label: "013113 - ELSON DOUGLAS DOS ANJOS BARRETO" },
      { value: "008606 - EMERSON SOARES RODRIGUES", label: "008606 - EMERSON SOARES RODRIGUES" },
      { value: "015105 - FABIO FERREIRA ALVES", label: "015105 - FABIO FERREIRA ALVES" },
      { value: "015932 - FABIO HOLANDA", label: "015932 - FABIO HOLANDA" },
      { value: "015104 - FABIO ROBERTO DA SILVA MORAIS", label: "015104 - FABIO ROBERTO DA SILVA MORAIS" },
      { value: "017967 - FELIPE GOMES CONCEICAO", label: "017967 - FELIPE GOMES CONCEICAO" },
      { value: "008671 - FERNANDO DOS SANTOS LIMA", label: "008671 - FERNANDO DOS SANTOS LIMA" },
      { value: "017897 - FERNANDO SANTOS ASSUNCAO", label: "017897 - FERNANDO SANTOS ASSUNCAO" },
      { value: "015286 - GERIVALDO CAVALCANTE DA SILVA", label: "015286 - GERIVALDO CAVALCANTE DA SILVA" },
      { value: "011621 - GIVANILDO ROSA FERNANDES", label: "011621 - GIVANILDO ROSA FERNANDES" },
      { value: "016050 - HENRIQUE DE SOUZA AZEVEDO", label: "016050 - HENRIQUE DE SOUZA AZEVEDO" },
      { value: "008580 - HERBE MANOEL DE OLIVEIRA", label: "008580 - HERBE MANOEL DE OLIVEIRA" },
      { value: "011675 - ISAC GOMES PEREIRA", label: "011675 - ISAC GOMES PEREIRA" },
      { value: "015648 - JANDISON ROGERIO DA SILVA", label: "015648 - JANDISON ROGERIO DA SILVA" },
      { value: "017973 - JOAO VITOR PERES BARBOSA", label: "017973 - JOAO VITOR PERES BARBOSA" },
      { value: "016049 - JONATAS CARDOSO SILVA SANTOS", label: "016049 - JONATAS CARDOSO SILVA SANTOS" },
      { value: "015520 - JOSE ADRIANO RODRIGUES DA SILVA", label: "015520 - JOSE ADRIANO RODRIGUES DA SILVA" },
      { value: "009047 - JOSE MAITON MEIRELES DE SOUSA", label: "009047 - JOSE MAITON MEIRELES DE SOUSA" },
      { value: "017402 - JULIANO RODRIGO DA SILVA", label: "017402 - JULIANO RODRIGO DA SILVA" },
      { value: "017898 - JULIO DE SOUSA GARDINO", label: "017898 - JULIO DE SOUSA GARDINO" },
      { value: "017764 - LEANDRO DIAS DOS SANTOS", label: "017764 - LEANDRO DIAS DOS SANTOS" },
      { value: "008601 - LEANDRO VICENTE MOREIRA DA SILVA", label: "008601 - LEANDRO VICENTE MOREIRA DA SILVA" },
      { value: "015934 - LOURISMAR DA SILVA VILAS BOAS", label: "015934 - LOURISMAR DA SILVA VILAS BOAS" },
      { value: "017396 - LOURIVALDO MENEZES NASCIMENTO", label: "017396 - LOURIVALDO MENEZES NASCIMENTO" },
      { value: "017466 - LUAN VITOR EUGENIO DE LIMA MOR", label: "017466 - LUAN VITOR EUGENIO DE LIMA MOR" },
      { value: "011800 - LUCAS DO NASCIMENTO ARAUJO", label: "011800 - LUCAS DO NASCIMENTO ARAUJO" },
      { value: "017397 - LUCIANO OLIVEIRA DA SILVA NETO", label: "017397 - LUCIANO OLIVEIRA DA SILVA NETO" },
      { value: "008686 - MAICON FERREIRA ALVES", label: "008686 - MAICON FERREIRA ALVES" },
      { value: "015642 - MARCELO VITOR FEITOZA", label: "015642 - MARCELO VITOR FEITOZA" },
      { value: "016058 - NATALIA DE MELO LOCHIDIO GOMES", label: "016058 - NATALIA DE MELO LOCHIDIO GOMES" },
      { value: "008727 - NILSON SANTOS DE SOUZA", label: "008727 - NILSON SANTOS DE SOUZA" },
      { value: "017762 - OLIVIE NSINGI FELIX DOMINGOS", label: "017762 - OLIVIE NSINGI FELIX DOMINGOS" },
      { value: "015116 - RAPHAEL PRADO DOS REIS", label: "015116 - RAPHAEL PRADO DOS REIS" },
      { value: "017976 - RAFAEL CARVALHO SOUSA LIMA", label: "017976 - RAFAEL CARVALHO SOUSA LIMA" },
      { value: "017398 - RAFAEL DA CONCEICAO SOUZA", label: "017398 - RAFAEL DA CONCEICAO SOUZA" },
      { value: "015103 - RENAN MARTINS DOS SANTOS", label: "015103 - RENAN MARTINS DOS SANTOS" },
      { value: "008720 - RENAN SOUZA MAIA", label: "008720 - RENAN SOUZA MAIA" },
      { value: "008612 - RICARDO APARECIDO GOMES FERREIRA", label: "008612 - RICARDO APARECIDO GOMES FERREIRA" },
      { value: "017765 - ROBERT PELLIZARI", label: "017765 - ROBERT PELLIZARI" },
      { value: "017972 - ROGERIO DIAS DA SILVA", label: "017972 - ROGERIO DIAS DA SILVA" },
      { value: "008657 - RUBENS DOS SANTOS BISPO", label: "008657 - RUBENS DOS SANTOS BISPO" },
      { value: "016057 - VENICIUS DA CONCEICAO SILVA", label: "016057 - VENICIUS DA CONCEICAO SILVA" },
      { value: "017966 - VICTOR GABRIEL GONÇALVES DOS SANTOS", label: "017966 - VICTOR GABRIEL GONÇALVES DOS SANTOS" },
      { value: "017965 - VITOR HUGO EMIDIO DOS SANTOS", label: "017965 - VITOR HUGO EMIDIO DOS SANTOS" },
      { value: "016056 - VINICIUS GOMES MAIA RIBEIRO", label: "016056 - VINICIUS GOMES MAIA RIBEIRO" },
      { value: "008721 - WAGNER DE JESUS CAVALCANTE", label: "008721 - WAGNER DE JESUS CAVALCANTE" },
      { value: "017325 - WEBSTER ESTEVES SANTIAGO", label: "017325 - WEBSTER ESTEVES SANTIAGO" },
      { value: "008594 - WILLIAM OLIVEIRA DOS SANTOS", label: "008594 - WILLIAM OLIVEIRA DOS SANTOS" },
      { value: "016059 - WILLIAN CARLOS DA SILVA", label: "016059 - WILLIAN CARLOS DA SILVA" },
  ]
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
    "016054 - ANDCLER FERNANDES DE SOUZA": "BR0358198148",
    "009050 - ANDERSON BATISTA SANTOS": "BR0340133908",
    "015285 - ANDERSON BRAZ SOARES DE FREITAS ": "BR0425211488",
    "009893 - ANDERSON CLEITON MUNIZ SANTANA": "BR0329440448",
    "017949 - BRENO SOUZA DA SILVA": "BR0433513408",
    "015645 - CAIO ROSCHEL DOS SANTOS": "BR0263691668",
    "015245 - CLAUDINEI DIAS DA SILVA": "BR0438512618",
    "017327 - DANIEL MORAES DOS SANTOS": "BR0334460808",
    "008718 - DAVID PETRI DO VALE ARAUJO": "BR0265183588",
    "017900 - DAWID NERY VIEIRA": "BR0258223928",
    "017895 - DENILSON EVANGELISTA DOS SANTOS": "BR0414916718",
    "016051 - DOUGLAS APARECIDO DE ASSIS": "BR0362651168",
    "009083 - EDENILSON DE PAULA LANA": "BR0363965218",
    "017896 - EDUARDO LOPES DA SILVA": "BR0362195078",
    "017395 - EDSON CIPRIANO MEIRELES DA SILVA": "BR0427670368",
    "013113 - ELSON DOUGLAS DOS ANJOS BARRETO": "BR0385658088",
    "008606 - EMERSON SOARES RODRIGUES": "BR0329427068",
    "015105 - FABIO FERREIRA ALVES": "BR0326863988",
    "015932 - FABIO HOLANDA": "BR0427206638",
    "015104 - FABIO ROBERTO DA SILVA MORAIS": "BR0303654548",
    "017967 - FELIPE GOMES CONCEICAO": "BR0351879418",
    "008671 - FERNANDO DOS SANTOS LIMA": "BR0354825498",
    "017897 - FERNANDO SANTOS ASSUNCAO": "BR0332709188",
    "015286 - GERIVALDO CAVALCANTE DA SILVA": "BR0340133908",
    "011621 - GIVANILDO ROSA FERNANDES": "BR0478608378",
    "016050 - HENRIQUE DE SOUZA AZEVEDO": "BR0153681188",
    "008580 - HERBE MANOEL DE OLIVEIRA": "BR0219600188",
    "011675 - ISAC GOMES PEREIRA": "BR0435135858",
    "015648 - JANDISON ROGERIO DA SILVA": "BR0286139398",
    "017973 - JOAO VITOR PERES BARBOSA": "BR0403437648",
    "016049 - JONATAS CARDOSO SILVA SANTOS": "BR0405285688",
    "015520 - JOSE ADRIANO RODRIGUES DA SILVA": "BR0060692695",
    "009047 - JOSE MAITON MEIRELES DE SOUSA": "BR0216554658",
    "017402 - JULIANO RODRIGO DA SILVA": "BR0294069428",
    "017898 - JULIO DE SOUSA GARDINO": "BR0315303078",
    "017764 - LEANDRO DIAS DOS SANTOS": "BR0226041058",
    "008601 - LEANDRO VICENTE MOREIRA DA SILVA": "BR0493944358",
    "015934 - LOURISMAR DA SILVA VILAS BOAS": "BR0320615988",
    "017396 - LOURIVALDO MENEZES NASCIMENTO": "BR0393745658",
    "017466 - LUAN VITOR EUGENIO DE LIMA MOR": "BR0463377738",
    "011800 - LUCAS DO NASCIMENTO ARAUJO": "BR0395209568",
    "017397 - LUCIANO OLIVEIRA DA SILVA NETO": "BR0352562938",
    "008686 - MAICON FERREIRA ALVES": "BR0342381488",
    "015642 - MARCELO VITOR FEITOZA": "BR0424278058",
    "016058 - NATALIA DE MELO LOCHIDIO GOMES": "BR0251987478",
    "008727 - NILSON SANTOS DE SOUZA": "BR0476745758",
    "017762 - OLIVIE NSINGI FELIX DOMINGOS": "BR0435840538",
    "015116 - RAPHAEL PRADO DOS REIS": "BR0326863988",
    "017976 - RAFAEL CARVALHO SOUSA LIMA": "BR0447433028",
    "017398 - RAFAEL DA CONCEICAO SOUZA": "BR0448708998",
    "017765 - ROBERT PELLIZARI": "BR0216756398",
    "017972 - ROGERIO DIAS DA SILVA": "BR0053171544",
    "015103 - RENAN MARTINS DOS SANTOS": "BR0309447338",
    "008720 - RENAN SOUZA MAIA": "BR0383217878",
    "008612 - RICARDO APARECIDO GOMES FERREIRA": "BR0320638618",
    "008657 - RUBENS DOS SANTOS BISPO": "BR0225911378",
    "017966 - VICTOR GABRIEL GONÇALVES DOS SANTOS": "BR0470936298",
    "017965 - VITOR HUGO EMIDIO DOS SANTOS": "BR0455006708",
    "016056 - VINICIUS GOMES MAIA RIBEIRO": "BR0323831788",
    "008721 - WAGNER DE JESUS CAVALCANTE": "BR0308705298",
    "017325 - WEBSTER ESTEVES SANTIAGO": "BR0459132728",
    "008594 - WILLIAM OLIVEIRA DOS SANTOS": "BR0466630348",
    "016059 - WILLIAN CARLOS DA SILVA": "BR0130153638",
    // Adicione mais mapeamentos conforme necessário
  };

  const [equipeOptionsCompleta, setEquipeOptionsCompleta] = useState([
    { value: "CCE001", label: "CCE001" },
    { value: "CCE002", label: "CCE002" },
    { value: "CCE003", label: "CCE003" },
    { value: "CCE004", label: "CCE004" },
    { value: "CCE005", label: "CCE005" },
    { value: "CCE009", label: "CCE009" },
    { value: "CCE010", label: "CCE010" },
    { value: "CCE011", label: "CCE011" },
    { value: "CCE012", label: "CCE012" },
    { value: "CCE014", label: "CCE014" },
    { value: "CCE015", label: "CCE015" },
    { value: "CCE017", label: "CCE017" },
    { value: "CCE020", label: "CCE020" },
    { value: "CCE021", label: "CCE021" },
    { value: "CCE022", label: "CCE022" },
    { value: "CCE025", label: "CCE025" },
    { value: "CCE027", label: "CCE027" },
    { value: "CCE029", label: "CCE029" },
    { value: "CCE035", label: "CCE035" },
    { value: "CCE041", label: "CCE041" },
    { value: "CCE043", label: "CCE043" },
    { value: "CCE050", label: "CCE050" },
    { value: "CCE055", label: "CCE055" },
    { value: "CCE056", label: "CCE056" },
    { value: "CCE058", label: "CCE058" },
    { value: "CCE065", label: "CCE065" },
    { value: "CCE085", label: "CCE085" },
    { value: "CCE088", label: "CCE088" },
    { value: "CCE099", label: "CCE099" },
    { value: "CCE0201", label: "CCE201" },
    { value: "CCE0202", label: "CCE202" },
    { value: "CCE0203", label: "CCE203" },
    { value: "CCE0204", label: "CCE204" },
    { value: "CCE0205", label: "CCE205" },
    { value: "CCE0206", label: "CCE206" },
    { value: "CCE0207", label: "CCE207" },
    { value: "CCE0208", label: "CCE208" },
    { value: "CCE0209", label: "CCE209" },  
  ]);  
  const [equipeOptions, setEquipeOptions] = useState(equipeOptionsCompleta);

  const [placaVeiculoOptionsCompleta, setPlacaVeiculoOptionsCompleta] = useState([
    { value: "EWF2J53", label: "EWF2J53" },
    { value: "EXS4G32", label: "EXS4G32" },
    { value: "FCY0E42", label: "FCY0E42" },
    { value: "FGA8E51", label: "FGA8E51" },
    { value: "FJH0F61", label: "FJH0F61" },
    { value: "FME0C92", label: "FME0C92" },
    { value: "FPH1F62", label: "FPH1F62" },
    { value: "FPT8I03", label: "FPT8I03" },
    { value: "FRB3C91", label: "FRB3C91" },
    { value: "GAI5I64", label: "GAI5I64" },
    { value: "GAU3H62", label: "GAU3H62" },
    { value: "GJD4A61", label: "GJD4A61" },
    { value: "PNS5J93", label: "PNS5J93" },
    { value: "RFS3I62", label: "RFS3I62" },
    { value: "RIC4C46", label: "RIC4C46" },
    { value: "RMI6F95", label: "RMI6F95" },
    { value: "SRX4H55", label: "SRX4H55" },
    { value: "SRX5J18", label: "SRX5J18" },
    { value: "SSR2C57", label: "SSR2C57" },
    { value: "SSR3D48", label: "SSR3D48" },
    { value: "SST1A89", label: "SST1A89" },
    { value: "SST2E41", label: "SST2E41" },
    { value: "SSU3H12", label: "SSU3H12" },
    { value: "SSV2H32", label: "SSV2H32" },
    { value: "SSW3I63", label: "SSW3I63" },
    { value: "SSY3C73", label: "SSY3C73" },
    { value: "STA3H11", label: "STA3H11" },
    { value: "STE1I67", label: "STE1I67" },
    { value: "STH8G37", label: "STH8G37" },
    { value: "STH9B92", label: "STH9B92" },
    { value: "STV9F52", label: "STV9F52" },
    { value: "SUY2B81", label: "SUY2B81" },
    { value: "SVC6G32", label: "SVC6G32" },
    { value: "SVH0F64", label: "SVH0F64" },
    { value: "SWN9I72", label: "SWN9I72" },
    { value: "SWS9I71", label: "SWS9I71" },
    { value: "RMI6F35", label: "RMI6F35" },
    { value: "RMG6106", label: "RMG6106" },
    { value: "TIT3D32", label: "TIT3D32" },
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