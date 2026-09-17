import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";


interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // Current page ke aaspas kitne numbers dikhane hain
}

export const AppPagination: React.FC<AppPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  // Safe boundary check: Agar 1 ya usse kam page ho toh pagination rendering skip karein
  if (totalPages <= 1) return null;

  // Professional Core Truncation Logic
  const generatePaginationRange = () => {
    const totalPageNumbersToShow = siblingCount + 5; // First + Last + Current + Sibilings + Dots

    // Case 1: Agar total pages scale threshold se kam hain, toh saare numbers dikhaein
    if (totalPageNumbersToShow >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Dots kab dikhani hain uski evaluation conditions
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: Sirf right side par dots hon (Current page shuruat ke kareeb ho)
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "DOTS", totalPages];
    }

    // Case 3: Sirf left side par dots hon (Current page aakhiri pages ke kareeb ho)
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "DOTS", ...rightRange];
    }

    // Case 4: Dono left aur right sides par dots hon (Current page bilkul center mein ho)
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
    }

    return [];
  };

  const paginationRange = generatePaginationRange();

  return (
    <div className="flex items-center justify-between border-t border-border/65 pt-4 px-2 select-none font-sans">
      {/* Total Data Tracker Summary View */}
      <div className="hidden sm:flex text-xs font-semibold text-text-secondary">
        Page <span className="text-text font-black mx-1">{currentPage}</span> of{" "}
        <span className="text-text font-black mx-1">{totalPages}</span> tiers
      </div>

      {/* Main Core Controller Action Nodes */}
      <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
        
        {/* Previous Navigation Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center p-2 rounded-xl border border-gray-300 bg-surface text-gray-500 hover:text-blue-500 hover:border-blue/40 disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:border-gray-400 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon height={18} width={18} className="stroke-[2.5]" />
        </button>

        {/* Dynamic Computed Range Builder Loop */}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "DOTS") {
            return (
              <div
                key={`dots-${index}`}
                className="w-9 h-9 flex items-center justify-center text-text-muted"
              >
                ...
                {/* <MoreHorizontal size={14} /> */}
              </div>
            );
          }

          const isCurrentActivePage = pageNumber === currentPage;

          return (
            <button
              key={`page-${pageNumber}`}
              onClick={() => onPageChange(pageNumber as number)}
              className={`w-9 h-9 text-xs font-black rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                isCurrentActivePage
                  ? "bg-blue-500 text-white shadow-md shadow-blue/10"
                  : "border border-gray-200 bg-white hover:bg-blue-500 text-gray-500 hover:border-blue-500 hover:text-white"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next Navigation Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center p-2 rounded-xl border border-gray-300 bg-surface text-gray-500 hover:text-gray-500 hover:border-blue/40 disabled:opacity-40 disabled:hover:text-gray-500 disabled:hover:border-gray-500 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowRightIcon  height={18} width={18} className="stroke-[2.5]" />
        </button>

      </div>
    </div>
  );
};