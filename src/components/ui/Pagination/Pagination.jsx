import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../Buttons";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

export default function Pagination({ pages, onPageChange, data }) {
  const timeout = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [showAll, setShowAll] = useState(true);

  const length = data.length;
  const totalPages = Math.ceil(length / pages);

  const handlePageChange = useCallback(
    (page = currentPage) => {
      onPageChange({
        pages,
        currentPage: page,
        paginatedData: data.slice(page * pages, page * pages + pages),
      });
      if (page !== undefined && page !== currentPage) setCurrentPage(page);
    },
    [currentPage, pages, setCurrentPage, onPageChange]
  );

  return (
    <div className="flex-box items-center justify-center">
      {length > pages && (
        <Button
          text={showAll ? "Show Paginated" : "Show All"}
          color={"var(--color-green)"}
          size="small"
          onClick={() => {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(
              () =>
                setShowAll((prev) => {
                  if (!prev)
                    onPageChange({ pages, currentPage, paginatedData: data });
                  else handlePageChange();
                  return !prev;
                }),
              5
            );
          }}
        />
      )}
      {!showAll && length > pages && (
        <div className="flex-box gap-1.5 items-center">
          <Button
            text={<ArrowBigLeft size={20} />}
            color={"var(--color-green)"}
            size="small"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          />
          <span className="text-[0.8rem]">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            text={<ArrowBigRight size={20} />}
            color={"var(--color-green)"}
            size="small"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          />
        </div>
      )}
    </div>
  );
}
