import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangeModalSelector({ onRangeChange }) {
  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  
const handleQuickSelect = (period) => {
  const today = new Date();
  let startDate = today;
  let endDate = today;

  switch (period) {
    case "today":
      break;
    case "yesterday":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = new Date(startDate);
      break;
    case "last7days":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      break;
    case "thismonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    default:
      break;
  }

  const newRange = [{ startDate, endDate, key: "selection" }];
  setRange(newRange);
  onRangeChange(newRange[0]);
  setShowModal(false);
};

const handleApply = () => {
  onRangeChange(range[0]);
  setShowModal(false);
};

  return (
    <div className="relative inline-block text-left">
      {/* Botão principal */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Selecionar Período
      </button>

      {/* Modal */}
      {showModal && (
        <div className="absolute z-20 mt-2 bg-white border shadow-lg rounded p-4 transform scale-90 text-sm">
          {/* Quick Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleQuickSelect("today")}
              className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              Hoje
            </button>
            <button
              onClick={() => handleQuickSelect("yesterday")}
              className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              Ontem
            </button>
            <button
              onClick={() => handleQuickSelect("last7days")}
              className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"            
            >
              Últimos 7 dias
            </button>
            <button
              onClick={() => handleQuickSelect("thismonth")}
              className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              Este Mês
            </button>
          </div>

          {/* Calendário Range */}
            <DateRange
              ranges={range}
              onChange={(item) => setRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
            />

          {/* Botões de ação */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
