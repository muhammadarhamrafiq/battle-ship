import Player from "../src/logic/Player.js";
import { SHIPTYPES, SHIPSALIGNMENTS } from "../src/constants.js";

describe("Player", ()=>{
    let player = new Player();

    it("should have a gameboard", ()=>{
        expect(player.getGameboard()).toBeDefined();
    })

    it("should be able to place ships" , ()=>{
        const ship1 = player.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Horizontal, [0, 0]);
        const ship2 = player.placeShip(SHIPTYPES.Battleship, SHIPSALIGNMENTS.Vertical, [1, 1]);
        const ship3 = player.placeShip(SHIPTYPES.Destroyer, SHIPSALIGNMENTS.Horizontal, [2, 2]);
        const ship4 = player.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Vertical, [3, 3]);
        const ship5 = player.placeShip(SHIPTYPES.PatrolBoat, SHIPSALIGNMENTS.Horizontal, [4, 4]);

        expect(ship1).toBe(true);
        expect(ship2).toBe(true);
        expect(ship3).toBe(true);
        expect(ship4).toBe(true);
        expect(ship5).toBe(true);
    })

    it("should be able to recieve attack" , ()=>{
        const attack1 = player.receiveAttack([0,0]);
        const attack2 = player.receiveAttack([0,1]);
        const attack3 = player.receiveAttack([1,1]);
        const attack4 = player.receiveAttack([0,0]);

        expect(attack1).toBe(1);
        expect(attack2).toBe(0);
        expect(attack3).toBe(1);
        expect(attack4).toBe(-1);
    })

})