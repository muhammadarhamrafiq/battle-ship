import EventController from "./EventController";

class Renderer {
  static renderEmptyGrid(gridContainer) {
    for (let i = 0; i < 100; i++) {
      const row = Math.floor(i / 10);
      const column = i % 10;
      const cell = document.createElement("div");

      cell.className = "h-full w-full border-t border-l border-t-black/50 border-l-black/50";
      if (row == 9) cell.classList.add("border-b", "border-b-black/50");
      if (column == 9) cell.classList.add("border-r", "border-r-black/50");

      cell.setAttribute("data-row", row);
      cell.setAttribute("data-column", column);
      gridContainer.appendChild(cell);
    }
  }

  static renderOwnBoard(gameboard, grid) {
    /**
     * Render the ships on the board
     * if the cell is in the ships not in hits mark it as occupied
     * if the cell is in hits and ships mark is as hitted
     * if the cell is among the hits not in ships mark it as missed
     * if the cell is among the sank ships mark it as the sank ships
     */
    const hits = gameboard.hits;
    const shipsLocations = gameboard.getAllShips().flatMap(ship => ship.occupies);
    const missed = hits.filter(hit => shipsLocations.every(([x, y]) => hit[0] !== x || hit[1] !== y));
    const hitted = hits.filter(hit => shipsLocations.some(([x, y]) => hit[0] === x && hit[1] === y));
    const occupied = shipsLocations.filter(location => hits.every(([x, y]) => x !== location[0] || y !== location[1]));
    const sunkShips = gameboard.getSunkShips().flatMap(ship => ship.occupies);

    // Mark occupied Cells
    occupied.forEach(([x, y]) => {
      const cell = grid.querySelector(`[data-row="${y}"][data-column="${x}"]`);
      if (cell) {
        cell.setAttribute("data-status", "occupied");
      }
    });

    // Mark missed Cells
    missed.forEach(([x, y]) => {
      const cell = grid.querySelector(`[data-row="${y}"][data-column="${x}"]`);
      if (cell) {
        cell.setAttribute("data-status", "missed");
      }
    });

    // Mark hitted Cells
    hitted.forEach(([x, y]) => {
      const cell = grid.querySelector(`[data-row="${y}"][data-column="${x}"]`);
      if (cell) {
        cell.setAttribute("data-status", "hitted");
      }
    });

    // Mark sunk Ships
    sunkShips.forEach(([x, y]) => {
      const cell = grid.querySelector(`[data-row="${y}"][data-column="${x}"]`);
      if (cell) {
        cell.setAttribute("data-status", "sunk");
      }
    });

  }

  static renderOppBoard(gameBoard, grid) {
    /**
     * Same as the renderOwnBoard methods but skip render occupied cells
    */

    const hits = gameBoard.hits;
    const shipsLocations = gameBoard.getAllShips().flatMap(ship => ship.occupies);
    const missed = hits.filter(hit => shipsLocations.every(([x, y]) => hit[0] !== x || hit[1] !== y));
    const hitted = hits.filter(hit => shipsLocations.some(([x, y]) => hit[0] === x && hit[1] === y));
    const occupied = shipsLocations.filter(location => hits.every(([x, y]) => x !== location[0] || y !== location[1]));
    const sunkShips = gameBoard.getSunkShips().flatMap(ship => ship.occupies);

    // Mark missed Cells
    missed.forEach(([x, y]) => {
      const cell = grid.querySelector(`[data-row="${y}"][data-column="${x}"]`);
      if (cell) {
        cell.setAttribute("data-status", "missed");
      }
    });

    // Mark hitted Cells
    hitted.forEach(([x, y]) => {
      const cell = grid.querySelector(`[data-row="${y}"][data-column="${x}"]`);
      if (cell) {
        cell.setAttribute("data-status", "hitted");
      }
    });

    // Mark sunk Ships
    sunkShips.forEach(([x, y]) => {
      const cell = grid.querySelector(`[data-row="${y}"][data-column="${x}"]`);
      if (cell) {
        cell.setAttribute("data-status", "sunk");
      }
    });
  }

  static gameEnded(isPlayerWinner, gameEndOverlay){
    const message = isPlayerWinner ? "You win!" : "You lose!";
    gameEndOverlay.querySelector("p").textContent = message;
    gameEndOverlay.setAttribute("data-open", "true");
    gameEndOverlay.querySelector("button").onclick = ()=>{
      location.reload();
    }
  }
}


export default Renderer;