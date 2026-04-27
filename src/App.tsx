import { useWebSocket } from "./hooks/useWebsocket";
import { TransactionsTable } from "./components/TransactionsTable";
import { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import Button from "./components/Button";
import Toast from "./components/Toast";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastData, setToastData] = useState<{ id: string, state: string } | null>(null);
  const { transactions, connected } = useWebSocket(import.meta.env.VITE_WS_URL, (data) => {
    setToastData(data);
  });

  const handleProcessPendingTransactions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/transactions/async-process`, {
        method: "POST",
      });
      const result = await response.json();
      console.log("processed transactions:", result);
    } catch (error) {
      console.error("Error processing pending transactions:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">Item transactions</h1>
          <div className="flex items-end">
            <span className={`bg-gray-900 text-sm font-medium px-3 py-1 rounded-full ${connected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {connected ? "● Online" : "○ Offline"}
            </span>
          </div>
        </div>
        <div className="flex justify-around gap-2 mb-6">
          <Button text="Process Pending Transactions" onClick={() => { handleProcessPendingTransactions() }} type="button" />
          <Button text="New Transaction" onClick={() => setIsModalOpen(true)} type="button" />
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex justify-center items-center p-4">
              <div className="bg-white p-6 rounded-lg">
                <TransactionForm setIsOpen={setIsModalOpen} />
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          {transactions ? (
            <TransactionsTable data={transactions.data} total={transactions.total} />
          ) : (
            <p className="p-8 text-center text-gray-400">Esperando datos del WebSocket...</p>
          )}
        </div>
      </div>
      {toastData && (
        <Toast 
          id={toastData.id} 
          state={toastData.state} 
          onClose={() => setToastData(null)} 
        />
      )}
    </div>
  );
}

export default App;
