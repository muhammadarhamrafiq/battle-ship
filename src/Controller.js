import DOMManager from "./ui/DOMManager";
import Renderer from "./ui/Renderer"
import EventController from "./ui/EventController"
import Player from "./logic/Player"
import GameController from "./controller/gameController"
import AIPlayer from "./logic/AIPlayer";

class Controller{
    #player
    #AI
    #gameController
    constructor(){
        this.DOM = new DOMManager();
        this.#player = new Player();
        this.#AI = new AIPlayer();
        this.#gameController = new GameController(this.#player, this.#AI, this.renderOwnBoard, this.renderOppBoard);

        this.init();
    }

    init(){
        Renderer.renderEmptyGrid(this.DOM.get('ownboard'));
        Renderer.renderEmptyGrid(this.DOM.get('oppboard'));
        Renderer.renderOwnBoard(this.#AI.getGameboard(), this.DOM.get('oppboard'));

        EventController.addDragStart(this.DOM.get('shipsToPlaceContainer'), this.DOM.get("dragGuide"));
        EventController.addDragEnd(this.DOM.get('ownboard'), this.DOM.get("dragGuide"));
        EventController.addAlignmentChange(this.DOM.get("alignment"));
        EventController.addPlacementMethod(this.DOM.get('ownboard'), this.placeShip, this.DOM.get('shipsToPlaceContainer'));
        EventController.addPlacementPreview(this.DOM.get('ownboard'));
        EventController.addRandomPlacement(this.DOM.get('randomPlaceBtn'), this.DOM.get('shipsToPlaceContainer'), this.placeShip);
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

    renderOppBoard = (gameBoard)=>{
        Renderer.renderOppBoard(gameBoard, this.DOM.get('oppboard'));
    }
}

export default Controller;