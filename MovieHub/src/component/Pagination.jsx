const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const range = 2;
  const pages = [];

  let startPage = Math.max(1, currentPage - range);
  let endPage = Math.min(totalPages, currentPage + range);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="w-full flex justify-center py-8 mt-8">
      <div className="w-[95%] max-w-4xl rounded-xl px-6 py-4 text-slate-300 shadow-lg">
        <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 transition hover:text-white disabled:opacity-40 cursor-pointer"
        >
          ← Previous
        </button>

        <div className="hidden sm:flex items-center gap-5">
          {pages.map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative px-1 text-sm font-medium transition-all duration-300 cursor-pointer ${
                currentPage === page
                  ? "text-blue-400"
                  : "hover:text-white"
              }`}
            >
              {page}
              {currentPage === page && (
                <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-400 rounded-full transition-all duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="sm:hidden text-sm text-slate-400">
          Page <span className="text-white">{currentPage}</span> of{" "}
          <span className="text-white">{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 transition hover:text-white disabled:opacity-40 cursor-pointer"
        >
          Next →
        </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
