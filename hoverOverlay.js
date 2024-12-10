document.addEventListener("DOMContentLoaded", function() {
    const hoverOverlay = document.getElementById("hoverOverlay");

    function updateHoverOverlay(e) {
        hoverOverlay.style.left = `${e.offsetX}px`;
        hoverOverlay.style.top = `${e.offsetY}px`;
    }

    const drawingCanvas = document.getElementById("drawingCanvas");

    drawingCanvas.addEventListener("mousemove", (e) => {
        updateHoverOverlay(e);
    });

    drawingCanvas.addEventListener("mouseout", () => {
        hoverOverlay.style.display = "none";
    });

    drawingCanvas.addEventListener("mouseover", () => {
        hoverOverlay.style.display = "block";
    });
});
