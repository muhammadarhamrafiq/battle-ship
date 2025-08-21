import Player from "./Player.js";
import { SHIPTYPES, SHIPSALIGNMENTS } from "../constants.js";
import Ship from "./Ship.js";

class AIPlayer extends Player {
    #attacked

    constructor(){
        super();
        this.#attacked = new Set();
        this.#placeShips();
    }

    attack(){
        let coords;
        while(true){
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);

            if(this.#attacked.has(`${x},${y}`)) continue;

            this.#attacked.add(`${x},${y}`);
            coords = [x, y];
            break;
        }

        document.dispatchEvent(new CustomEvent("attack" , {
            detail: {
                attacker: this,
                coords,
            }
        }))
    }

    #placeShips(){
        for(const shiptype of Object.values(SHIPTYPES)){
            while(true){
                const alignment = SHIPSALIGNMENTS[Math.floor(Math.random() * SHIPSALIGNMENTS.length)];
                const start = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];

                if(this.placeShip(shiptype, alignment, start)) break;
            }
        }
    }
}