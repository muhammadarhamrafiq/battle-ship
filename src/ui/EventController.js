import { SHIPLENGTHS } from "../constants"

let shipToPlace = ""
let alignment = "horizontal"

class EventController{
    static addDragStart(container, guide){
        window.addEventListener("mousemove", (event)=>{
            guide.style.left = event.pageX + 10 + "px";
            guide.style.top = event.pageY + 10 + "px";
        })

        container.addEventListener("mousedown", (event)=>{
            const target = event.target.closest("[data-ship]");
            shipToPlace = target.getAttribute("data-ship");
            guide.innerHTML = target.innerHTML;
            event.preventDefault();
        })
    }

    static addDragEnd(container, guide){
        window.addEventListener("mouseup", (event)=>{
            guide.innerHTML = "";
            shipToPlace = ""
        })
    }

    static addPlacementMethod(container, placeShip){
        container.addEventListener("mouseup", (event)=>{
            const target = event.target.closest("[data-row][data-column]");
            if(!shipToPlace) return;
            const row = parseInt(target.getAttribute("data-row"));
            const column = parseInt(target.getAttribute("data-column"));
            EventController.clearPlacementPreview(container);
            placeShip(shipToPlace, alignment, [column, row]);
        })
    }

    static addAlignmentChange(select){
        select.addEventListener("change", (event)=>{
            alignment = event.target.value;
        })
    }

    static addPlacementPreview(container){
        container.addEventListener("mousemove", (event)=>{
            const target = event.target.closest("[data-row][data-column]");
            if(!shipToPlace || !target) return;
            const row = target.getAttribute("data-row");
            const column = target.getAttribute("data-column");

            EventController.clearPlacementPreview(container);
            const shipLength = SHIPLENGTHS[shipToPlace];

            for(let i = 0; i < shipLength; i++){
                const r = alignment === "horizontal" ? parseInt(row) : parseInt(row) + i;
                const c = alignment === "horizontal" ? parseInt(column) + i : parseInt(column);
                const cell = container.querySelector(`[data-row="${r}"][data-column="${c}"]`);
                if(cell) cell.classList.add("placement-preview");
            }
        })
    }

    static clearPlacementPreview(container){
        const previewCells = container.querySelectorAll(".placement-preview");
        previewCells.forEach(cell => cell.classList.remove("placement-preview"));
    }
}

export default EventController;