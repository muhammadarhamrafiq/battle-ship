/** @jest-environment jsdom */
import AIPlayer from "../src/logic/AIPlayer.js";
import { SHIPTYPES } from "../src/constants.js";

describe("AIPlayer", () => {
  it("should be defined and place all ships on creation", () => {
    const ai = new AIPlayer();
    const ships = ai.getGameboard().getAllShips();
    expect(ships.length).toBe(Object.keys(SHIPTYPES).length); // 5
  });

  it("attack() should dispatch an 'attack' event with attacker and coords", (done) => {
    const ai = new AIPlayer();

    function handler(e) {
      try {
        expect(e).toBeDefined();
        expect(e.detail).toBeDefined();
        expect(e.detail.attacker).toBe(ai);
        const [x, y] = e.detail.coords;
        expect(Number.isInteger(x)).toBe(true);
        expect(Number.isInteger(y)).toBe(true);
        document.removeEventListener("attack", handler);
        done();
      } catch (err) {
        document.removeEventListener("attack", handler);
        done(err);
      }
    }

    document.addEventListener("attack", handler);
    ai.attack();
  });

  it("successive attack() calls should not emit duplicate coords", () => {
    const ai = new AIPlayer();
    const received = [];
    const captured = new Set();

    // capture dispatched events
    function handler(e) {
      const coords = e.detail.coords.join(",");
      received.push(coords);
      captured.add(coords);
    }

    document.addEventListener("attack", handler);

    // perform many attacks (up to 100 unique cells)
    for (let i = 0; i < 50; i++) {
      ai.attack();
    }

    document.removeEventListener("attack", handler);

    // all emitted coords should be unique
    expect(received.length).toBe(captured.size);
  }, 10000);
});