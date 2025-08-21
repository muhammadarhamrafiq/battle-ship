
class DOMManager{
    constructor(){
        this.ownContainer = document.getElementById('ownboard');
        this.oppContainer = document.getElementById('oppboard');
    }

    set(elem){
        this[elem] = elem || document.getElementById(elem);
    }

    get(elem){
        return this[elem] || document.getElementById(elem);
    }
}

export default DOMManager;