import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MetricCard } from '../components/tMetrics';
import { Users, UserX, Activity } from 'lucide-react';

const BASE_URL = "https://composicao-sp-soc.onrender.com";

const statusColors = {
  CAMPO: "bg-green-100 text-green-800",
  FALTA: "bg-red-100 text-red-800",
  OUTRO: "bg-gray-100 text-gray-800",
};


export default function PainelAbsenteismo() {
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dados, setDados] = useState([]);
  const [absenteismo, setAbsenteismo] = useState({ total: 0, completas: 0, ausentes: 0, percentual: "0" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch(`${BASE_URL}/teams/finalizadas?data=${data}`);
        const json = await res.json();
        setDados(json);
      } catch (err) {
        console.error("Erro ao buscar equipes:", err);
      }
    }

    async function fetchAbsenteismo() {
      try {
        const res = await fetch(`${BASE_URL}/absenteismo?data=${data}`);
        const stats = await res.json();
        setAbsenteismo(stats);
      } catch (err) {
        console.error("Erro ao calcular absenteísmo:", err);
      }
    }

    fetchDados();
    fetchAbsenteismo();
  }, [data]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${BASE_URL}/composicao/export?data=${data}`;
    link.download = `composicao_${data}.xlsx`;
    link.click();
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
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [dados, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const getSortClass = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <Link to="/" className="text-blue-600 underline text-sm mb-4 inline-block">
        ← Voltar para Cadastro
      </Link>

      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Painel de Absenteísmo</h1>

      <div className="flex justify-between items-center gap-4 mb-6">
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Equipes"
          value={absenteismo.completas}
          icon={<Users />} // Exemplo com ícone de usuários (substitua pelo ícone adequado)
          iconBg="bg-green-50"
          iconColor="text-green-500"
        >
          <span className="text-gray-500 text-xs">Equipes completas</span>
        </MetricCard>

        <MetricCard
          title="Ausências"
          value={absenteismo.ausentes}
          icon={<UserX />} // Ícone de usuário com X (substitua conforme sua biblioteca)
          iconBg="bg-red-50"
          iconColor="text-red-500"
        >
          <span className="text-gray-500 text-xs">Colaboradores ausentes</span>
        </MetricCard>

        <MetricCard
          title="Absenteísmo"
          value={`${absenteismo.percentual}%`}
          icon={<Activity />} // Ícone de atividade/gráfico
          iconBg="bg-yellow-50"
          iconColor="text-yellow-500"
        >
          <span className="text-gray-500 text-xs">Percentual total</span>
        </MetricCard>
      </div>



      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="overflow-x-auto shadow-md border border-gray-100 rounded bg-gradient-to-br from-white to-gray-50"
      >
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                {[
                  { key: "data_atividade", label: "Data" },
                  { key: "supervisor", label: "Supervisor (a)" },
                  { key: "equipe", label: "Equipe" },
                  { key: "eletricista_motorista", label: "Eletricista Motorista" },
                  { key: "eletricista_parceiro", label: "Eletricista Parceiro (a)" },
                  { key: "servico", label: "Serviço" },
                  { key: "placa_veiculo", label: "Placa" },
                  { key: "status", label: "Status" },
                ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => requestSort(key)}
                  className={`p-3 border-b border-gray-200 text-left cursor-pointer hover:bg-gray-200 relative`}
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
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    Nenhuma equipe encontrada.
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-2 border-b border-gray-100">{item.data_atividade}</td>

                    <td className="p-2 border-b border-gray-100 text-left overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap">
                      {item.supervisor}
                    </td>

                    <td className="p-2 border-b border-gray-100">{item.equipe}</td>

                    <td className="p-2 border-b border-gray-100 text-left overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap">
                      {item.eletricista_motorista}
                    </td>

                    <td className="p-2 border-b border-gray-100 text-left overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap">
                      {item.eletricista_parceiro}
                    </td>

                    <td className="p-2 border-b border-gray-100">{item.servico}</td>
                    <td className="p-2 border-b border-gray-100">{item.placa_veiculo}</td>

                    <td
                      className={`p-2 border-b border-gray-100 font-semibold rounded text-center ${statusColors[item.status] || statusColors.OUTRO}`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>







      <button
        onClick={handleDownload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Exportar Excel
      </button>
    </div>
  );
}