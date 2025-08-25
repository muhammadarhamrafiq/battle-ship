import EventController from "./EventController";

class Renderer {
  static renderEmptyGrid(gridContainer) {
    for (let i = 0; i < 100; i++) {
      const row = Math.floor(i / 10);
      const column = i % 10;
      const cell = document.createElement("div");
      
      cell.className = "h-full w-full border-t border-l border-t-black/50 border-l-black/50";
      if(row == 9) cell.classList.add("border-b", "border-b-black/50");
      if(column == 9) cell.classList.add("border-r", "border-r-black/50");

      cell.setAttribute("data-row", row);
      cell.setAttribute("data-column", column);
      gridContainer.appendChild(cell);
    }

  }
}


export default Renderer;