import DOMManager from "./DOMManager";
import Renderer from "./Renderer"

class UIManager{
    constructor(){
        this.DOM = new DOMManager();
        this.renderer = new Renderer();

        this.init();
    }

    init(){
        this.renderer.renderEmptyGrid(this.DOM.get('ownboard'));
        this.renderer.renderEmptyGrid(this.DOM.get('oppboard'));
    }
}

export default UIManager;