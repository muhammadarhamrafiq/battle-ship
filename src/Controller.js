import DOMManager from "./ui/DOMManager";
import Renderer from "./ui/Renderer"
import EventController from "./ui/EventController"
import player from "./logic/Player"
import GameController from "./controller/gameController"

class Controller{
    #player
    #gameController
    constructor(){
        this.DOM = new DOMManager();
        this.init();
        this.#player = new player();
        this.#gameController = new GameController(this.#player);
    }

    init(){
        Renderer.renderEmptyGrid(this.DOM.get('ownboard'));
        Renderer.renderEmptyGrid(this.DOM.get('oppboard'));

        EventController.addDragStart(this.DOM.get('shipsToPlaceContainer'), this.DOM.get("dragGuide"));
        EventController.addDragEnd(this.DOM.get('ownboard'), this.DOM.get("dragGuide"));
        EventController.addAlignmentChange(this.DOM.get("alignment"));
        EventController.addPlacementMethod(this.DOM.get('ownboard'), this.placeShip);
        EventController.addPlacementPreview(this.DOM.get('ownboard'));
    }

    placeShip = (ship, alignment, coords)=>{
        const placed = this.#player.placeShip(ship, alignment, coords);
        if(!placed) return false;
        Renderer.renderOwnBoard(this.#player.getGameboard(), this.DOM.get('ownboard'));
        return true;
    }

    renderOwnBoard = (gameBoard)=>{
        Renderer.renderOwnBoard(gameBoard, this.DOM.get('ownboard'));
    }
}

export default Controller;