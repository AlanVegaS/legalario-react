
function Button({ text, onClick, type }: { text: string, onClick: () => void, type: "button" | "submit" }) {
    return (
        <button type={type} onClick={onClick} className="px-3 py-1 bg-gray-900 text-sm font-medium rounded-md text-white hover:bg-gray-700 transition-colors cursor-pointer ">
            {text}
        </button>
    );
}

export default Button