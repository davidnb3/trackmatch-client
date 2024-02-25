import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrackMatches } from "../store/trackMatchesSlice";
import { useState } from "react";

export function PagePagination() {
  const dispatch = useDispatch();
  const totalPages = useSelector((state) => state.trackMatches.totalPages);
  const trackMatchesLoading = useSelector(
    (state) => state.trackMatches.loading
  );
  const [page, setPage] = useState(1);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      dispatch(fetchTrackMatches({ page: p }));
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(totalPages, startPage + 3);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || trackMatchesLoading}
          />
        </PaginationItem>
        {pageNumbers.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              onClick={() => handlePageChange(p)}
              isActive={p === page}
              disabled={p === page}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {endPage < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || trackMatchesLoading}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
