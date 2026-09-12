import "./modal.css";

function Modal({ titulo, aberto, onFechar, children }) {
  if (!aberto) return null;

  return (
    <div style={overlayStyle} className="modal">
      <div style={modalStyle}>
        <div className="modal-heading">
            <h2>{titulo}</h2>

            <button onClick={onFechar} >
                X
            </button>
        </div>

        <hr></hr>
        
        {children}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.64)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "400px",
  position: "relative",
  zIndex: 2
};

export default Modal;