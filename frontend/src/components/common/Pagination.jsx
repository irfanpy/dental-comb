import React from "react";

const Pagination = ({ pagination, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={pagination.page === 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </button>
      <span>
        Page {pagination.page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={pagination.page >= totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;