import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDados = [...dados].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : "";
    const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
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

      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-green-100 p-4 rounded-lg text-center shadow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-gray-600">Equipes</p>
          <h2 className="text-2xl font-bold text-green-800">{absenteismo.completas}</h2>
        </motion.div>
        <motion.div
          className="bg-red-100 p-4 rounded-lg text-center shadow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-gray-600">Ausências</p>
          <h2 className="text-2xl font-bold text-red-800">{absenteismo.ausentes}</h2>
        </motion.div>
        <motion.div
          className="bg-yellow-100 p-4 rounded-lg text-center shadow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-600">% Absenteísmo</p>
          <h2 className="text-2xl font-bold text-yellow-800">{absenteismo.percentual}%</h2>
        </motion.div>
      </div>

      <div className="mt-3 w-full max-w-[1800px] mx-auto">
        <div className="overflow-x-auto shadow-sm border rounded-lg">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full bg-white">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-200 text-gray-700 text-xs">
                  <th
                    onClick={() => handleSort("data_atividade")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Data {renderSortIcon("data_atividade")}
                  </th>
                  <th
                    onClick={() => handleSort("supervisor")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Supervisor (a) {renderSortIcon("supervisor")}
                  </th>
                  <th
                    onClick={() => handleSort("equipe")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Equipe {renderSortIcon("equipe")}
                  </th>
                  <th
                    onClick={() => handleSort("eletricista_motorista")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Eletricista Motorista {renderSortIcon("eletricista_motorista")}
                  </th>
                  <th
                    onClick={() => handleSort("eletricista_parceiro")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Eletricista Parceiro (a) {renderSortIcon("eletricista_parceiro")}
                  </th>
                  <th
                    onClick={() => handleSort("servico")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Serviço {renderSortIcon("servico")}
                  </th>
                  <th
                    onClick={() => handleSort("placa_veiculo")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Placa {renderSortIcon("placa_veiculo")}
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="p-2 border cursor-pointer select-none whitespace-nowrap text-left hover:bg-gray-100"
                  >
                    Status {renderSortIcon("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {sortedDados.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      Nenhuma equipe encontrada.
                    </td>
                  </tr>
                ) : (
                  sortedDados.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border whitespace-nowrap">{item.data_atividade}</td>
                      <td className="p-2 border whitespace-nowrap text-left overflow-hidden text-ellipsis max-w-[200px]">
                        {item.supervisor}
                      </td>
                      <td className="p-2 border whitespace-nowrap">{item.equipe}</td>
                      <td className="p-2 border whitespace-nowrap text-left overflow-hidden text-ellipsis max-w-[200px]">
                        {item.eletricista_motorista}
                      </td>
                      <td className="p-2 border whitespace-nowrap text-left overflow-hidden text-ellipsis max-w-[200px]">
                        {item.eletricista_parceiro}
                      </td>
                      <td className="p-2 border whitespace-nowrap">{item.servico}</td>
                      <td className="p-2 border whitespace-nowrap">{item.placa_veiculo}</td>
                      <td
                        className={`p-2 border whitespace-nowrap text-left font-semibold rounded ${
                          statusColors[item.status] || statusColors.OUTRO
                        }`}
                      >
                        {item.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Baixar Excel
      </button>
    </div>
  );
}
