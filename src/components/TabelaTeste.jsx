// components/TabelaTeste.jsx
export default function TabelaTeste() {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="min-w-full bg-white border rounded-lg" style={{ tableLayout: 'auto' }}>
        <thead>
          <tr className="bg-gray-200 text-gray-700 text-xs">
            <th className="p-2 border whitespace-nowrap text-left">Supervisor(a)</th>
            <th className="p-2 border whitespace-nowrap text-left">Equipe</th>
            <th className="p-2 border whitespace-nowrap text-left">Motorista</th>
            <th className="p-2 border whitespace-nowrap text-left">Parceiro(a)</th>
            <th className="p-2 border whitespace-nowrap text-left">Serviço</th>
            <th className="p-2 border whitespace-nowrap text-left">Placa</th>
            <th className="p-2 border whitespace-nowrap text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-sm">
            <td className="p-2 border">Ana Silva</td>
            <td className="p-2 border">Equipe A</td>
            <td className="p-2 border">Carlos Oliveira de Silva Souza Alves Parceiro</td>
            <td className="p-2 border">Fernanda Costa Albuquerque Silva Costa</td>
            <td className="p-2 border">Instalação</td>
            <td className="p-2 border">ABC-1234</td>
            <td className="p-2 border text-green-500">Concluído</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}