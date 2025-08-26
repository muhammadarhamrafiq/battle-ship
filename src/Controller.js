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
        EventController.addStart(this.DOM.get('startBtn'), this.startGame);
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
        Renderer.renderOwnBoard(gameBoard, this.DOM.get('oppboard'));
    }

    startGame = ()=>{
        if(this.started) return;
        this.started = true;

        this.#gameController.startGame();
        EventController.addAttackMethod(this.DOM.get('oppboard'), (coords)=>{
            document.dispatchEvent(new CustomEvent("attack", {
                detail: {
                    attacker: this.#player,
                    coords,
                }
            }))
        });

        // Listen for game over
        document.addEventListener("gameOver", (event)=>{
            const winner = event.detail.winner;
            alert(`${winner} wins!`);
        })
    }
}

export default Controller;