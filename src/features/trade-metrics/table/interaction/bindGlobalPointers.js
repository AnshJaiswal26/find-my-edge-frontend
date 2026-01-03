export function bindGlobalPointer(from, onMove, onUp) {
  function move(e) {
    onMove(e[from]);
  }
  function up() {
    onUp();
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  }
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
