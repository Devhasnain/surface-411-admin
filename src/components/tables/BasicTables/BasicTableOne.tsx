import { ReactNode } from "react";

import { Table, TableCell, TableHeader, TableRow, } from "../../ui/table";


type Props = {
  head: string[];
  children:ReactNode
};

export default function BasicTableOne({ head, children }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {head?.map((item, index) => (
                <TableCell
                  isHeader
                  key={index}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          {children}
        </Table>
      </div>
    </div>
  );
}
