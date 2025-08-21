import GameBoard from "../src/logic/GameBoard.js";
import { SHIPTYPES, SHIPSALIGNMENTS } from "../src/constants.js"

describe("GameBoard Class", ()=>{
    let gameboard
    beforeEach(()=>{
        gameboard = new GameBoard();
    })

    it("placement working", ()=>{
        const ship1 = gameboard.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Horizontal, [2,3])
        const ship2 = gameboard.placeShip(SHIPTYPES.Battleship, SHIPSALIGNMENTS.Vertical, [4,5])

        expect(ship1).toBe(true);
        expect(ship2).toBe(true);
    })

    it("accepting edged placements", ()=>{
        const ship1 = gameboard.placeShip(SHIPTYPES.Destroyer, SHIPSALIGNMENTS.Horizontal, [0,0])
        const ship2 = gameboard.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Vertical, [0,1])
        const ship3 = gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Horizontal, [8,9])
        const ship4 = gameboard.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Vertical, [9,0])

        expect(ship1).toBe(true);
        expect(ship2).toBe(true);
        expect(ship3).toBe(true);
        expect(ship4).toBe(true);
    })

    it("avoiding out of bounds placements",()=>{
        const ship1 = gameboard.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Horizontal, [6,9])
        const ship2 = gameboard.placeShip(SHIPTYPES.Battleship, SHIPSALIGNMENTS.Vertical, [9,7])
        const ship3 = gameboard.placeShip(SHIPTYPES.Destroyer, SHIPSALIGNMENTS.Horizontal, [9,9])
        const ship4 = gameboard.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Vertical, [10,0])
        const ship5 = gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Horizontal, [0,-10])

        expect(ship1).toBe(false);
        expect(ship2).toBe(false);
        expect(ship3).toBe(false);
        expect(ship4).toBe(false);
        expect(ship5).toBe(false);
    })

    it("avoiding overlapping placements", ()=>{
        const ship1 = gameboard.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Horizontal, [2,3])
        const ship2 = gameboard.placeShip(SHIPTYPES.Battleship, SHIPSALIGNMENTS.Vertical, [3,0])
        const ship3 = gameboard.placeShip(SHIPTYPES.Destroyer, SHIPSALIGNMENTS.Vertical, [1,2])

        expect(ship1).toBe(true);
        expect(ship2).toBe(false);
        expect(ship3).toBe(true);

    })

    it("avoid duplicate ships", ()=>{
        const ship1 = gameboard.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Horizontal, [2,3])
        const ship2 = gameboard.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Vertical, [3,0])

        expect(ship1).toBe(true);
        expect(ship2).toBe(false);
    })

    it("get all ships", ()=>{
        gameboard.placeShip(SHIPTYPES.Carrier, SHIPSALIGNMENTS.Horizontal, [2,3]);
        gameboard.placeShip(SHIPTYPES.Battleship, SHIPSALIGNMENTS.Vertical, [1,2]);
        gameboard.placeShip(SHIPTYPES.Destroyer, SHIPSALIGNMENTS.Horizontal, [2,2]);
        gameboard.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Horizontal, [4,5]);
        gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Vertical, [3,4]);

        const ships = gameboard.getAllShips();
        expect(ships.length).toBe(5);
    })

    it("get ship by its coordinates", ()=>{
        gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Vertical, [3,4]);

        const ship = gameboard.getShip([3,5]);
        expect(ship).toBeDefined();
        expect(ship.type).toBe("Patrol");
        expect(ship.occupies).toEqual([[3,4],[3,5]]);

    })

    it("track Attack and missed shots", ()=>{
        gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Vertical, [3,4]);
        gameboard.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Horizontal, [4,5]);

        const attack1 = gameboard.receiveAttack([7,1]);
        const attack2 = gameboard.receiveAttack([5,5]);

        expect(attack1).toBe(0); // Missed shot
        expect(attack2).toBe(1); // Hit shot
    })

    it("track already hit spots", ()=>{
        gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Vertical, [3,4]);
        gameboard.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Horizontal, [4,5]);

        const attack1 = gameboard.receiveAttack([3,4]); // Hit
        const attack2 = gameboard.receiveAttack([3,4]); // Already hit
        const attack3 = gameboard.receiveAttack([1,4]); // Missed
        const attack4 = gameboard.receiveAttack([4,5]); // Hit
        const attack5 = gameboard.receiveAttack([1,4]); // Missed
        
        expect(attack1).toBe(1); // Hit shot
        expect(attack2).toBe(-1); // Already hit
        expect(attack3).toBe(0); // Missed shot
        expect(attack4).toBe(1); // Hit shot
        expect(attack5).toBe(-1); // Already Missed shot
    })

    it("get sunk ships", ()=>{
        gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Vertical, [3,4]);
        gameboard.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Horizontal, [4,5]);

        expect(gameboard.getSunkShips().length).toBe(0);

        gameboard.receiveAttack([3,4]);
        gameboard.receiveAttack([3,5]);

        expect(gameboard.getSunkShips().length).toBe(1);

        gameboard.receiveAttack([4,5]);
        gameboard.receiveAttack([5,5]);

        expect(gameboard.getSunkShips().length).toBe(1);

        gameboard.receiveAttack([6,5]);

        expect(gameboard.getSunkShips().length).toBe(2);
    })

    it("isLost after all ships sunk", ()=>{
        gameboard.placeShip(SHIPTYPES.Patrol, SHIPSALIGNMENTS.Vertical, [3,4]);
        gameboard.placeShip(SHIPTYPES.Submarine, SHIPSALIGNMENTS.Horizontal, [4,5]);

        expect(gameboard.isLost()).toBe(false);

        gameboard.receiveAttack([3,4]);
        gameboard.receiveAttack([3,5]);
        gameboard.receiveAttack([4,5]);
        gameboard.receiveAttack([5,5]);
        gameboard.receiveAttack([6,5]);

        expect(gameboard.isLost()).toBe(true);

    })
})
