import Gameboard from "./GameBoard.js"


class Player{
    #gameboard

    constructor(){
        this.#gameboard = new Gameboard();    
    }

    getGameboard(){
        return this.#gameboard;
    }

    placeShip(type, alignment, coordinates) {
        return this.#gameboard.placeShip(type, alignment, coordinates);
    }

    receiveAttack(coordinates){
        return this.#gameboard.receiveAttack(coordinates);
    }

    hasAllShips(){
        return this.#gameboard.getAllShips().length === 5;
    }

    reset(){
        this.#gameboard = new Gameboard();
    }
}

export default Player;