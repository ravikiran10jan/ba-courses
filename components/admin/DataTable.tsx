"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminForms } from "@/lib/content";

const dt = getAdminForms().dataTable;

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = searchable
    ? data.filter((item) =>
        columns.some((col) => {
          const value = item[col.key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full max-w-sm bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 focus:border-[#FF1493] transition-colors"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[#444444]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#111111] border-b border-[#444444]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-[#999999] font-semibold text-xs uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-[#999999]"
                >
                  {dt.noData}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-[#444444]/50 transition-colors hover:bg-white/[0.02]",
                    index % 2 === 0 ? "bg-black" : "bg-[#111111]/30"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-white">
                      {col.render
                        ? col.render(item)
                        : (item[col.key] as React.ReactNode) ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-[#999999]">
            {dt.showingLabel} {startIndex + 1}-
            {Math.min(startIndex + pageSize, filteredData.length)} {dt.ofLabel}{" "}
            {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#444444] text-[#999999] hover:text-white hover:border-[#666666] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              {dt.prev}
            </button>
            <span className="text-[#999999] px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#444444] text-[#999999] hover:text-white hover:border-[#666666] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {dt.next}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
