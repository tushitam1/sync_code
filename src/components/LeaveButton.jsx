function LeaveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-lg !bg-red-600 hover:!bg-red-500 !text-white font-medium transition-colors border-0"
    >
      Leave
    </button>
  )
}

export default LeaveButton