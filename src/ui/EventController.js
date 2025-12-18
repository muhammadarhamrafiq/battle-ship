import { SHIPLENGTHS } from "../constants"
import BrowserCompatManager, { EventNormalizer, BrowserFeatures } from "../utils/browserCompat"

let shipToPlace = ""
let alignment = "horizontal"
let isDragging = false
const compatManager = new BrowserCompatManager()

class EventController{
    static addDragStart(container, guide){
        // Initialize compatibility manager
        compatManager.init();
        
        // Get appropriate event types for this browser
        const eventTypes = compatManager.getEventTypes();
        
        // Universal move handler for guide positioning
        const handleMove = (event) => {
            const coords = EventNormalizer.getCoordinates(event);
            guide.style.left = coords.pageX + 10 + "px";
            guide.style.top = coords.pageY + 10 + "px";
        };

        // Add listeners for all event types to ensure compatibility
        window.addEventListener("mousemove", handleMove);
        
        // Touch move with passive prevention for smooth dragging
        if (BrowserFeatures.hasTouchSupport()) {
            window.addEventListener("touchmove", handleMove, EventNormalizer.getEventOptions(false));
        }
        
        // Pointer move for modern browsers
        if (BrowserFeatures.hasPointerSupport()) {
            window.addEventListener("pointermove", handleMove);
        }

        // Universal start handler
        const handleStart = (event) => {
            const target = event.target.closest("[data-ship]");
            if (!target) return;
            
            shipToPlace = target.getAttribute("data-ship");
            guide.innerHTML = target.innerHTML;
            isDragging = true;
            
            // Add touch-friendly class
            if (BrowserFeatures.hasTouchSupport()) {
                guide.classList.add('touch-dragging');
            }
            
            EventNormalizer.preventDefault(event);
        };

        // Add start listeners
        container.addEventListener("mousedown", handleStart);
        
        if (BrowserFeatures.hasTouchSupport()) {
            container.addEventListener("touchstart", handleStart, EventNormalizer.getEventOptions(false));
        }
        
        if (BrowserFeatures.hasPointerSupport()) {
            container.addEventListener("pointerdown", handleStart);
        }
    }

    static addDragEnd(container, guide){
        // Universal end handler
        const handleEnd = (event) => {
            guide.innerHTML = "";
            shipToPlace = "";
            isDragging = false;
            guide.classList.remove('touch-dragging');
        };

        // Add end listeners for all event types
        window.addEventListener("mouseup", handleEnd);
        
        if (BrowserFeatures.hasTouchSupport()) {
            window.addEventListener("touchend", handleEnd);
            window.addEventListener("touchcancel", handleEnd);
        }
        
        if (BrowserFeatures.hasPointerSupport()) {
            window.addEventListener("pointerup", handleEnd);
            window.addEventListener("pointercancel", handleEnd);
        }
    }

    static addPlacementMethod(container, placeShip, shipsContainer){
        // Helper function to get target element from any event type
        const getTargetCell = (event) => {
            if (event.type.startsWith('touch')) {
                const coords = EventNormalizer.getCoordinates(event);
                const elementUnderTouch = EventNormalizer.getElementFromPoint(coords.x, coords.y);
                return elementUnderTouch?.closest("[data-row][data-column]");
            }
            return event.target.closest("[data-row][data-column]");
        };

        // Universal placement handler
        const handlePlacement = (event) => {
            const target = getTargetCell(event);
            if(!shipToPlace || !target) return;
            
            const row = parseInt(target.getAttribute("data-row"));
            const column = parseInt(target.getAttribute("data-column"));
            EventController.clearPlacementPreview(container);
            
            let placed = placeShip(shipToPlace, alignment, [column, row]);
            if(!placed) return;
            
            const shipToRemove = shipsContainer.querySelector(`[data-ship="${shipToPlace}"]`);
            if (shipToRemove) {
                shipToRemove.remove();
            }
        };

        // Add placement listeners
        container.addEventListener("mouseup", handlePlacement);
        
        if (BrowserFeatures.hasTouchSupport()) {
            container.addEventListener("touchend", handlePlacement);
        }
        
        if (BrowserFeatures.hasPointerSupport()) {
            container.addEventListener("pointerup", handlePlacement);
        }
    }

    static addAlignmentChange(select){
        select.addEventListener("change", (event)=>{
            alignment = event.target.value;
        })
    }

    static addPlacementPreview(container){
        // Helper function to get target element from any event type
        const getTargetCell = (event) => {
            if (event.type.startsWith('touch')) {
                const coords = EventNormalizer.getCoordinates(event);
                const elementUnderTouch = EventNormalizer.getElementFromPoint(coords.x, coords.y);
                return elementUnderTouch?.closest("[data-row][data-column]");
            }
            return event.target.closest("[data-row][data-column]");
        };

        // Universal preview handler
        const handlePreview = (event) => {
            const target = getTargetCell(event);
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
        };

        // Add preview listeners
        container.addEventListener("mousemove", handlePreview);
        
        if (BrowserFeatures.hasTouchSupport()) {
            container.addEventListener("touchmove", handlePreview, EventNormalizer.getEventOptions(false));
        }
        
        if (BrowserFeatures.hasPointerSupport()) {
            container.addEventListener("pointermove", handlePreview);
        }
    }

    static clearPlacementPreview(container){
        const previewCells = container.querySelectorAll(".placement-preview");
        previewCells.forEach(cell => cell.classList.remove("placement-preview"));
    }

    static addRandomPlacement(button, shipsContainer, placeShip){
        button.addEventListener("click", () => {
            shipsContainer.querySelectorAll("[data-ship]").forEach(ship => {
                const shipName = ship.getAttribute("data-ship");
                const alignment = Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical";
                let coords;
                let placed = false;

                while(!placed){
                    coords = [
                        Math.floor(Math.random() * 10),
                        Math.floor(Math.random() * 10)
                    ];
                    placed = placeShip(shipName, alignment, coords);
                }

                ship.remove();
            });
        });
    }

    static addStart(button, startGame){
        button.addEventListener("click", startGame);
    }

    static addAttackMethod(grid, attack){
        // Helper function to get target element from any event type
        const getTargetCell = (event) => {
            if (event.type.startsWith('touch')) {
                const coords = EventNormalizer.getCoordinates(event);
                const elementUnderTouch = EventNormalizer.getElementFromPoint(coords.x, coords.y);
                return elementUnderTouch?.closest("[data-row][data-column]");
            }
            return event.target.closest("[data-row][data-column]");
        };

        // Universal attack handler
        const handleAttack = (event) => {
            const target = getTargetCell(event);
            if(!target) return;

            const row = parseInt(target.getAttribute("data-row"));
            const column = parseInt(target.getAttribute("data-column"));
            attack([column, row]);
        };

        // Add attack listeners
        grid.addEventListener("click", handleAttack);
        
        // For touch devices, use touchend for better responsiveness
        if (BrowserFeatures.hasTouchSupport()) {
            grid.addEventListener("touchend", (event) => {
                // Prevent click event from firing on touch devices to avoid double-tap
                EventNormalizer.preventDefault(event);
                handleAttack(event);
            });
        }
        
        // Pointer events for modern browsers
        if (BrowserFeatures.hasPointerSupport()) {
            grid.addEventListener("pointerup", handleAttack);
        }
    }
}

export default EventController;