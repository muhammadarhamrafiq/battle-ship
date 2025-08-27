
class DOMManager{
    constructor(){
        this.ownContainer = document.getElementById('ownboard');
        this.oppContainer = document.getElementById('oppboard');
        this.alignmentContainer = document.getElementById("alignment");
        this.shipsToPlace = document.getElementById("shipsToPlace");
        this.shipsContainer = document.getElementById("ships-container");
        this.dragGuide = document.getElementById("drag-guide");
        this.alignment = document.getElementById("alignment");
        this.randomPlaceBtn = document.getElementById("randomPlaceBtn");
        this.startBtn = document.getElementById("startBtn");
        this.gameEndOverlay = document.getElementById("gameEndOverlay");
    }

    set(elem){
        this[elem] = elem || document.getElementById(elem);
    }

    get(elem){
        return this[elem] || document.getElementById(elem);
    }
}

export default DOMManager;