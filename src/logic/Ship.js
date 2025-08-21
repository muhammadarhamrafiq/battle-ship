import { SHIPLENGTHS } from "../constants.js";


class Ship{
    #length
    #hits
    #type
    #occupies

    constructor(type, occupies){
        this.#type = type;
        this.#occupies = occupies;
        this.#length = SHIPLENGTHS[type];
        this.#hits = 0;
    }

    hit(){
        this.#hits++;
    }

    isSunk(){
        return this.#hits >= this.#length;
    }

    get length(){
        return this.#length;
    }

    get type(){
        return this.#type;
    }

    get occupies(){
        return this.#occupies;
    }
}

export default Ship;