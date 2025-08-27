import AIPlayer from "../logic/AIPlayer.js"

class GameController{
    #players;
    #turn;

    constructor(player1, player2, renderOwnBoard, renderOppBoard){
        this.#players = [player1, player2];
        this.#turn = 0;
        this.renderOwnBoard = renderOwnBoard
        this.renderOppBoard = renderOppBoard
    }

    startGame(){
        if(this.#players.some(player => player.hasAllShips() === false)) return;

        document.addEventListener("attack" , (event) => {
            this.handleAttack(event.detail);
        })
    }

    handleAttack({attacker, coords}){
        if(attacker !== this.#players[this.#turn]) return;
        const defender = this.#players[(this.#turn + 1)%2];

        debugger;
        const res = defender.receiveAttack(coords);
        if(res === -1) return // if attack on already hitted spot

        this.renderBoards();

        if(res === 0) {
            this.#turn = (this.#turn + 1) % 2; // switch turn if shot missed
        }

        // If the game is over
        if(defender.getGameboard().isLost()) {
            document.dispatchEvent(new CustomEvent("gameOver", { detail: { 
                winner: attacker
            }}));
            return;
        }

        // If it's the AI's turn
        if(this.#players[this.#turn] instanceof AIPlayer) {
            this.#players[this.#turn].attack();
        }
    }

    renderBoards(){
        if(this.#players[1] instanceof AIPlayer){
            this.renderOwnBoard(this.#players[0].getGameboard());
            this.renderOppBoard(this.#players[1].getGameboard());
        }else{
            this.renderOwnBoard(this.#players[this.#turn].getGameboard());
            this.renderOppBoard(this.#players[(this.#turn + 1) % 2].getGameboard());
        }
    }

    restart(){
        this.#players.forEach(player => player.reset());
        this.#turn = 0;
    }

    get CurrentPlayer(){
        return this.#players[this.#turn];
    }
}

export default GameController;