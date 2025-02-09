import Link from "next/link";
import { JSX } from "react";

interface TableUserProps {
    columns: { key: string; label: string; alwaysVisible?: boolean }[];
    data: Record<string, any>[];
    actions?: {
      label: string;
      href?: (row: Record<string, any>) => string;
      onClick?: (row: Record<string, any>) => void;
      className?: string;
    }[];
}

export default function TableUser({ columns, data, actions }: TableUserProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto w-full border-collapse shadow-lg">
        <thead className="h-16">
          <tr className="bg-[#20458A] text-white text-center font-sans">
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`px-4 py-2 border border-gray-300 ${
                  col.alwaysVisible ? "" : "hidden lg:table-cell"
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-2 border border-gray-300">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-gray-100 hover:bg-gray-200">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-2 border border-gray-300 font-sans ${
                    col.alwaysVisible ? "" : "hidden lg:table-cell"
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex gap-2 text-center justify-center items-center">
                    {actions.map((action, actionIndex) => (
                      action.href ? (
                        <Link key={actionIndex} href={action.href(row)}>
                          <button className={action.className}>{action.label}</button>
                        </Link>
                      ) : (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick && action.onClick(row)}
                          className={action.className}
                        >
                          {action.label}
                        </button>
                      )
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
