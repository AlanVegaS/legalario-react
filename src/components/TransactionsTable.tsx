import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Transaction } from "../hooks/useWebsocket";

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("user_id", { header: "Usuario" }),
  columnHelper.accessor("amount", { header: "Monto" }),
  columnHelper.accessor("transaction_type", { header: "Tipo" }),
  columnHelper.accessor("state", {
    header: "Estado",
    cell: (info) => {
      const state = info.getValue();
      const colors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        completed: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[state ?? ""] ?? "bg-gray-100 text-gray-800"}`}>
          {state ?? "—"}
        </span>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Fecha",
    cell: (info) => info.getValue() ?? "—",
  }),
];

interface Props {
  data: Transaction[];
  total: number;
}

export function TransactionsTable({ data, total }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

  });

  return (
    <div className="p-4">
      <div className="mb-3 text-sm text-gray-500">
        Total en cola: <span className="font-semibold text-gray-800">{total}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  Sin transacciones
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
