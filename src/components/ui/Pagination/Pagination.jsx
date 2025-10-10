import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, IconButton } from "../Buttons";
import { ArrowBigLeft, ArrowBigRight, Icon } from "lucide-react";

export default function Pagination({
  pages,
  onPageChange,
  data,
  layout = "chart",
}) {
  const timeout = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [showAll, setShowAll] = useState(true);

  const isChart = layout === "chart";

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

  const handleShowAll = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(
      () =>
        setShowAll((prev) => {
          !prev
            ? onPageChange({ pages, currentPage, paginatedData: data })
            : handlePageChange();
          return !prev;
        }),
      5
    );
  }, [onPageChange, handlePageChange, pages, currentPage, data, setShowAll]);

  const pageText = (
    <span>
      Page {currentPage + 1} of {totalPages}
    </span>
  );

  const config = [
    { icon: ArrowBigLeft, count: currentPage - 1, disabled: 0 },
    { icon: ArrowBigRight, count: currentPage + 1, disabled: totalPages - 1 },
  ];

  return (
    <div className="flex-box items-center justify-center">
      {!isChart && length > pages && (
        <>
          <Button
            text={showAll ? "Show Paginated" : "Show All"}
            color={"var(--color-green)"}
            size="small"
            onClick={handleShowAll}
          />
          {!showAll && (
            <div className="flex-box gap-1.5 items-center">
              {pageText}
              {config.map((item) => (
                <Button
                  text={<item.icon size={20} />}
                  color={"var(--color-green)"}
                  size="small"
                  onClick={() => handlePageChange(item.count)}
                  disabled={currentPage === item.disabled}
                />
              ))}
            </div>
          )}
        </>
      )}

      {isChart && length > pages && (
        <div className="flex-box rounded-[4px] bg-[var(--color-bg-chart-toolbar)] text-[0.77rem] flex-1">
          <IconButton
            icon={showAll ? "Show Paginated" : "Show All"}
            onClick={handleShowAll}
            className={"rounded-none"}
          />
          {!showAll && (
            <div className="flex-box gap-4 items-center">
              {pageText}
              {config.map((item) => (
                <IconButton
                  icon={<item.icon size={17} />}
                  onClick={() => handlePageChange(item.count)}
                  disabled={currentPage === item.disabled}
                  className={"rounded-none"}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
