import Ship from "../src/logic/Ship.js";
import { SHIPTYPES } from "../src/constants.js";

describe("Ship Class", ()=>{
    it("Ship class should be defined" , ()=>{
        expect(Ship).toBeDefined();
    })

    it("Ship should be instantiated with a length", ()=>{
        let ship = new Ship(SHIPTYPES.Carrier, [[2,2], [2,3], [2,4], [2,5], [2,6]]);
        expect(ship.length).toBe(5);
    })

    const ship = new Ship(SHIPTYPES.Destroyer , [[2,2], [2,3], [2,4]]);

    it("Ship should have hit method", ()=>{
        expect(typeof ship.hit).toBe("function");
    })

    it("Ship should have the isSunk method", ()=>{
        expect(typeof ship.isSunk).toBe("function");
    })

    it("Ship should be able to sunk after the conrect number of hits", ()=>{
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    })
})