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
        const alignments = Object.values(SHIPSALIGNMENTS);
        for(const shiptype of Object.values(SHIPTYPES)){
            while(true){
                const alignment = alignments[Math.floor(Math.random() * alignments.length)];
                const start = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];

                if(this.placeShip(shiptype, alignment, start)) break;
            }
        }
    }
}

export default AIPlayer;