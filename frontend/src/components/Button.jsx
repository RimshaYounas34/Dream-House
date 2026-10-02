function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
    >
      {children}
    </button>
  );
}

export default Button;