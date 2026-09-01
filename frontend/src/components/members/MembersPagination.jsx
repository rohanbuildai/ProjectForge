import Icon from "../landing/icons";
import "./MembersPagination.css";

function MembersPagination({ total = 0, perPage =  10, page =  1, totalPages =  1, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = Math.min((page - 1) * perPage +  1, total);
  const end = Math.min(page * perPage, total);

  const pages = Array.from({ length: totalPages }, (_, index) => index +  1);

  return (
    <nav className="mb-pagination" aria-label="Members pagination">
      <span className="mb-pagination-info">
        Showing {start}–{end} of {total} members
      </span>

      <div className="mb-pagination-controls">
        <button
          type="button"
          className="mb-pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon name="arrowLeft" size={14} />
          Previous
        </button>

        <div className="mb-pagination-numbers" role="group" aria-label="Page numbers">
          {pages.map((number) => (
            <button
              type="button"
              key={number}
              className={`mb-pagination-number ${number === page ? "is-active" : ""}`}
              aria-current={number === page ? "page" : undefined}
              aria-label={`Page ${number}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mb-pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <Icon name="arrowRight" size={14} />
        </button>
      </div>
    </nav>
  );
}

export default MembersPagination;