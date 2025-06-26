import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MetricCard } from '../components/tMetrics';
import { Users, UserX, Activity } from 'lucide-react';
import DateRangeModalSelector from '../components/DateRangeModalSelector';

const BASE_URL = "https://composicao-sp-soc.onrender.com";

const statusColors = {
  CAMPO: "bg-green-100 text-green-800",
  FALTA: "bg-red-100 text-red-800",
  OUTRO: "bg-gray-100 text-gray-800",
};

export default function PainelAbsenteismo({ estado }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedEstado, setSelectedEstado] = useState(estado || 'ALL');
  const isEstadoFixo = !!estado;
  const [dados, setDados] = useState([]);
  const [absenteismo, setAbsenteismo] = useState({ total: 0, completas: 0, ausentes: 0, percentual: "0" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const start = format(startDate, "yyyy-MM-dd");
      const end = format(endDate, "yyyy-MM-dd");

      // Rota /teams/finalizadas usa 'data=INICIO,FIM'
      const queryStringTeams = `data=${start},${end}${selectedEstado !== 'ALL' ? `&estado=${selectedEstado}` : ''}`;

      // Rota /absenteismo usa 'startDate=INICIO&endDate=FIM'
      const queryStringAbsenteismo = `startDate=${start}&endDate=${end}${selectedEstado !== 'ALL' ? `&estado=${selectedEstado}` : ''}`;

      const [dadosRes, absenteismoRes] = await Promise.all([
        fetch(`${BASE_URL}/teams/finalizadas?${queryStringTeams}`),
        fetch(`${BASE_URL}/absenteismo?${queryStringAbsenteismo}`)
      ]);

      const [dadosJson, absenteismoJson] = await Promise.all([
        dadosRes.json(),
        absenteismoRes.json()
      ]);

      setDados(dadosJson);
      setAbsenteismo(absenteismoJson);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [startDate, endDate, selectedEstado]);


const handleDownload = async () => {
  const start = format(startDate, "yyyy-MM-dd");
  const end = format(endDate, "yyyy-MM-dd");
  const queryString = `data=${start},${end}${selectedEstado !== 'ALL' ? `&estado=${selectedEstado}` : ''}`;

  try {
    const response = await fetch(`${BASE_URL}/composicao/export?${queryString}`);
    if (!response.ok) throw new Error("Erro ao baixar o Excel");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `composicao_${start}_a_${end}_${selectedEstado}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);
  }
};

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return dados;
    return [...dados].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [dados, sortConfig]);

  const textoPeriodo =
  dataRange.startDate.getTime() === dataRange.endDate.getTime()
    ? format(dataRange.startDate, "dd/MM/yyyy")
    : `${format(dataRange.startDate, "dd/MM/yyyy")} - ${format(dataRange.endDate, "dd/MM/yyyy")}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="w-full max-w-[1700px] mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-yellow-500" />
              Painel de Absenteísmo
            </h1>
            <p className="text-sm text-gray-500">Acompanhamento de equipes e ausências</p>
          </div>
          <div>
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <UserX className="w-4 h-4" />
              Exportar Excel
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1700px] mx-auto px-6 py-6">
        {/* FILTROS */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div>
            <DateRangeModalSelector
              onRangeChange={({ startDate, endDate }) => {
                setStartDate(startDate);
                setEndDate(endDate);
              }}
            />
            <p className="text-sm text-gray-500 mt-1">
              Período selecionado:{" "}
              <span className="font-medium text-gray-700">{textoPeriodo}</span>
            </p>
          </div>

          {!isEstadoFixo && (
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="ALL">Todos os Estados</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="RJB">RJB</option>
            </select>
          )}
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Equipes"
            value={absenteismo.completas}
            icon={<Users />}
            iconBg="bg-green-50"
            iconColor="text-green-500"
          >
            <span className="text-gray-500 text-xs">Equipes completas</span>
          </MetricCard>

          <MetricCard
            title="Ausências"
            value={absenteismo.ausentes}
            icon={<UserX />}
            iconBg="bg-red-50"
            iconColor="text-red-500"
          >
            <span className="text-gray-500 text-xs">Colaboradores ausentes</span>
          </MetricCard>

          <MetricCard
            title="Absenteísmo"
            value={`${absenteismo.percentual}%`}
            icon={<Activity />}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-500"
          >
            <span className="text-gray-500 text-xs">Percentual total</span>
          </MetricCard>
        </div>

        {/* TABELA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="overflow-x-auto shadow-md border border-gray-100 rounded bg-gradient-to-br from-white to-gray-50"
        >
          <div className="max-h-[700px] overflow-y-auto">
            <table className="min-w-full text-[12px] text-gray-800">
              <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600 uppercase text-[10px] tracking-wide">
                <tr>
                  {[
                    { key: "data_atividade", label: "Data" },
                    { key: "supervisor", label: "Supervisor (a)" },
                    { key: "equipe", label: "Equipe" },
                    { key: "eletricista_motorista", label: "Motorista" },
                    { key: "eletricista_parceiro", label: "Parceiro (a)" },
                    { key: "servico", label: "Serviço" },
                    { key: "placa_veiculo", label: "Placa" },
                    { key: "status", label: "Status" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => requestSort(key)}
                      className="p-3 border-b border-gray-200 text-left cursor-pointer hover:bg-gray-200 relative"
                    >
                      {label}
                      {sortConfig.key === key && (
                        <span className="absolute right-2">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">
                      <div className="flex justify-center items-center py-10">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600 text-sm">Carregando equipes...</span>
                      </div>
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      Nenhuma equipe encontrada.
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="p-2 border-b border-gray-100">{item.data_atividade}</td>
                      <td className="p-2 border-b border-gray-100">{item.supervisor}</td>
                      <td className="p-2 border-b border-gray-100">{item.equipe}</td>
                      <td className="p-2 border-b border-gray-100">{item.eletricista_motorista}</td>
                      <td className="p-2 border-b border-gray-100">{item.eletricista_parceiro}</td>
                      <td className="p-2 border-b border-gray-100">{item.servico}</td>
                      <td className="p-2 border-b border-gray-100">{item.placa_veiculo}</td>
                      <td className={`p-2 border-b border-gray-100 font-semibold text-center rounded ${statusColors[item.status] || statusColors.OUTRO}`}>
                        {item.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
