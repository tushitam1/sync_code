function CrossButton({ onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Leave room"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )
  }
  
  export default CrossButton