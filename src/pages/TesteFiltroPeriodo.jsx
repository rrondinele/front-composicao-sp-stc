import DateRangeModalSelector from "../components/DateRangeModalSelector";

export default function TestePage() {
  const handleRangeChange = (range) => {
    console.log("Período selecionado:", range);
  };

  return (
    <div className="p-10">
      <h2 className="text-lg font-bold mb-4">Teste de Filtro de Período</h2>
      <DateRangeModalSelector onRangeChange={handleRangeChange} />
    </div>
  );
}
