import Ship from "./Ship.js";
import { SHIPLENGTHS, SHIPSALIGNMENTS } from "../constants.js"


class GameBoard{
    #ships;
    #hits;

    constructor(){
        this.#ships = [];
        this.#hits = [];
    }

    placeShip(type, alignment, start){
        const shipData ={
            type: type,
            occupies: this.#calculateOccupiedCells(start, SHIPLENGTHS[type], alignment)
        }

        /**
         * Validate Location within the bounderies
         * Validate Location is not already occupied
         * Validate Ship is not a duplicate
        */

        if(!this.#isInBounds(shipData.occupies)) return false;
        if(this.#isOverlaping(shipData.occupies)) return false;
        if(this.#isShipDuplicate(shipData.type)) return false;

        this.#ships.push(new Ship(shipData.type, shipData.occupies));
        return true;
    }

    getAllShips(){
        return this.#ships.map(ship=>{
            return {
                type: ship.type,
                occupies: ship.occupies,
                isSunk: ship.isSunk()
            }
        });
    }

    getShip(location){
        return this.#ships.find(ship => ship.occupies.some(
            cell => cell[0] === location[0] && cell[1] === location[1]
        ))
    }

    receiveAttack(location){
        const alreadyHitted = this.#hits.some(
            cell => cell[0] === location[0] && cell[1] === location[1]
        )
        if(alreadyHitted) return -1;

        this.#hits.push(location);
        const ship = this.getShip(location);
        if(ship){
            ship.hit();
            return 1;
        }else{
            return 0;
        }
    }

    getSunkShips(){
        return this.#ships.filter(ship => ship.isSunk()).map(ship => ({
            type: ship.type,
            occupies: ship.occupies
        }));
    }

    isLost(){
        return this.#ships.every(ship => ship.isSunk());
    }

    // Helper Methods 
    #calculateOccupiedCells(start, length, alignment){
        const occupied = [];
        for(let i = 0; i < length; i++){
            occupied.push(
                [
                    start[0] + (alignment === SHIPSALIGNMENTS.Horizontal ? i : 0),
                    start[1] + (alignment ===  SHIPSALIGNMENTS.Vertical ? i : 0)
                ]
            )
        }
        return occupied;
    }

    #isInBounds(occupied){
        return occupied.every(cell => cell[0] >= 0 && cell[0] < 10 && cell[1] >= 0 && cell[1] < 10);
    }

    #isOverlaping(occupied){
        return occupied.some(
            ([x , y]) => this.#ships.some(
                ship => ship.occupies.some(
                    ([sx, sy]) => sx === x && sy === y
                )
            )
        )
    }

    #isShipDuplicate(type){
        return this.#ships.some(ship => ship.type === type);
    }

    get hits(){
        return this.#hits
    }
}


export default GameBoard;