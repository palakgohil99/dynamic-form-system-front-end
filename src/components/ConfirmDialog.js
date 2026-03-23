const ConfirmDialog = ({ show, title, message, onConfirm, onCancel }) => {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-[380px] shadow-lg">
          <h2 className="text-lg font-semibold text-[#181D27] mb-2">{title}</h2>
          <p className="text-sm text-[#4B5563] mb-5">{message}</p>
  
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
  
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
            >
              Yes, Continue
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmDialog;
  