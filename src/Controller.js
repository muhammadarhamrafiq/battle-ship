import DOMManager from "./ui/DOMManager";
import Renderer from "./ui/Renderer"
import EventController from "./ui/EventController"

class UIManager{
    constructor(){
        this.DOM = new DOMManager();
        this.init();
    }

    init(){
        Renderer.renderEmptyGrid(this.DOM.get('ownboard'));
        Renderer.renderEmptyGrid(this.DOM.get('oppboard'));

        EventController.addDragStart(this.DOM.get('shipsToPlaceContainer'), this.DOM.get("dragGuide"));
        EventController.addDragEnd(this.DOM.get('ownboard'), this.DOM.get("dragGuide"));
        EventController.addAlignmentChange(this.DOM.get("alignment"));
        EventController.addPlacementMethod(this.DOM.get('ownboard'));
        EventController.addPlacementPreview(this.DOM.get('ownboard'));
    }
}

export default UIManager;