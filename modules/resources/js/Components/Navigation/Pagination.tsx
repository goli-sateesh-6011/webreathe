import { Inertia } from "@inertiajs/inertia";
type PaginationProps = {
  currentPage: number;
  lastPage: number;
};

type PaginationButtonProps = {
  label: string | number;
  clickHandler: () => void;
  active?: boolean;
  disabled?: boolean;
  hidden?: boolean;
};

export default function Pagination({ currentPage, lastPage }: PaginationProps) {
  const toPreviousPage = () => handlePageChange(currentPage - 1, lastPage);
  const toNextPage = () => handlePageChange(currentPage + 1, lastPage);

  return (
    <ul className="pagination">
      {/* Previous button */}
      <PaginationButton
        label="Previous"
        clickHandler={toPreviousPage}
        disabled={currentPage < 2}
      />

      {/* Previous page jump */}
      <PaginationButton
        label={currentPage - 2}
        clickHandler={() => handlePageChange(currentPage - 2, lastPage)}
        hidden={currentPage <= 2}
      />

      {/* Numeric previous page */}
      <PaginationButton
        label={currentPage - 1}
        clickHandler={toPreviousPage}
        hidden={currentPage === 1}
      />

      {/* Current Page */}
      <PaginationButton
        label={currentPage}
        clickHandler={() => {}}
        active={true}
      />

      {/* Numeric Next page */}
      <PaginationButton
        label={currentPage + 1}
        clickHandler={toNextPage}
        hidden={currentPage === lastPage}
      />

      {/* Next page jump */}
      <PaginationButton
        label={currentPage + 2}
        clickHandler={() => handlePageChange(currentPage + 2, lastPage)}
        hidden={lastPage - currentPage < 2}
      />

      {/* Next button */}
      <PaginationButton
        label="Next"
        clickHandler={toNextPage}
        disabled={currentPage === lastPage}
      />
    </ul>
  );
}

function PaginationButton({
  label,
  clickHandler,
  active,
  disabled,
  hidden,
}: PaginationButtonProps) {
  if (hidden) return null;

  return (
    <li className="page-item">
      <button
        className={`page-link ${active && "active"} ${disabled && "disabled"}`}
        onClick={clickHandler}
        disabled={disabled}
      >
        {label}
      </button>
    </li>
  );
}

function handlePageChange(page: number, lastPage: number) {
  if (page > lastPage || page < 1) return;

  const url = new URL(window.location.href);
  url.searchParams.set("page", page.toString());

  Inertia.visit(url.toString(), {
    preserveScroll: true,
    preserveState: true,
  });
}
