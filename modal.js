  function openImpressum() {
    document.getElementById("impressumModal").style.display = "block";
    document.addEventListener("keydown", handleEscapeKey);
  }
  function closeImpressum() {
    document.getElementById("impressumModal").style.display = "none";
    document.removeEventListener("keydown", handleEscapeKey);
  }
  function handleEscapeKey(event) {
    if (event.key === "Escape") {
      closeImpressum();
    }
  }
