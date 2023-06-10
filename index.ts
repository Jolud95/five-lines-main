const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
interface RawTileValue {
    transform(): Tile;
}

interface Input {
    handle(player: Player, map: Map): void;
}

interface Tile {
    isAir(): boolean;

    isLock1(): boolean;

    isLock2(): boolean;

    draw(g: CanvasRenderingContext2D, x: number, y: number): void;

    moveHorizontal(player: Player, dx: number, map: Map): void;

    moveVertical(player: Player, dy: number, map: Map): void;

    update(x: number, y: number, map: Map): void;

    getBlockOnTopState(): FallingState;
}

interface FallingState {
    drop(tile: Tile, x: number, y: number, map: Map): void;

    moveHorizontal(player: Player, tile: Tile, dx: number, map: Map): void;
}

interface RemoveStrategy {
    check(tile: Tile): boolean;
}
class AirValue implements RawTileValue {
    transform() {
        return new AirTile();
    }
}
class FluxValue implements RawTileValue {
    transform() {
        return new FluxTile();
    }
}
class UnbreakableValue implements RawTileValue {
    transform() {
        return new UnbreakableTile();
    }
}
class PlayerValue implements RawTileValue {
    transform() {
        return new PlayerTile();
    }
}
class StoneValue implements RawTileValue {
    transform() {
        return new StoneTile(new Resting());
    }
}
class FallingStoneValue implements RawTileValue {
    transform() {
        return new StoneTile(new Resting());
    }
}
class BoxValue implements RawTileValue {
    transform() {
            return new BoxTile(new Resting());
    }
}
class FallingBoxValue implements RawTileValue {
    transform() {
        return new BoxTile(new Falling());
    }
}
class Key1Value implements RawTileValue {
    transform() {
        return new KeyTile(YELLOW_KEY);
    }
}
class Lock1Value implements RawTileValue {
    transform() {
        return new LockTile(YELLOW_KEY);
    }
}
class Key2Value implements RawTileValue {
    transform() {
        return new KeyTile(BLUE_KEY);
    }
}
class Lock2Value implements RawTileValue {
    transform() {
        return new LockTile(BLUE_KEY);
    }
}

class RawTile {
    static readonly AIR = new RawTile(new AirValue());
    static readonly FLUX = new RawTile(new FluxValue());
    static readonly UNBREAKABLE = new RawTile(new UnbreakableValue());
    static readonly PLAYER = new RawTile(new PlayerValue());
    static readonly STONE = new RawTile(new StoneValue());
    static readonly FALLING_STONE = new RawTile(new FallingStoneValue());
    static readonly BOX = new RawTile(new BoxValue());
    static readonly FALLING_BOX = new RawTile(new FallingBoxValue());
    static readonly KEY1 = new RawTile(new Key1Value());
    static readonly LOCK1 = new RawTile(new Lock1Value());
    static readonly KEY2 = new RawTile(new Key2Value());
    static readonly LOCK2 = new RawTile(new Lock2Value());

    private constructor(private value: RawTileValue) { }
    transform() {
        return this.value.transform();
    }
}

class AirTile implements Tile {
    isAir() {
        return true;
    }

    isLock1() {
        return false;
    }

    isLock2() {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {

    }

    moveHorizontal(player: Player, dx: number, map: Map) {
        player.move(dx, 0, map)
    }

    moveVertical(player: Player, dy: number, map: Map) {
        player.move(0, dy, map)
    }

    getBlockOnTopState() {
        return new Falling();
    }

    update(x: number, y: number) {
    }
}

class FluxTile implements Tile {
    isAir() {
        return false;
    }

    isLock1() {
        return false;
    }

    isLock2() {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#ccffcc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(player: Player, dx: number, map: Map) {
        player.move(dx, 0, map)
    }

    moveVertical(player: Player, dy: number, map: Map) {
        player.move(0, dy, map)
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number) {
    }
}

class UnbreakableTile implements Tile {
    isAir() {
        return false;
    }

    isLock1() {
        return false;
    }

    isLock2() {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#999999";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(player: Player, dx: number) {
    }

    moveVertical(player: Player, dy: number) {
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number) {
    }
}

class PlayerTile implements Tile {
    isAir() {
        return false;
    }

    isLock1() {
        return false;
    }

    isLock2() {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
    }

    moveHorizontal(player: Player, dx: number) {
    }

    moveVertical(player: Player, dy: number) {
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number) {
    }
}

class StoneTile implements Tile {
    private fallStrategy: FallStrategy

    constructor(private falling: FallingState) {
        this.fallStrategy = new FallStrategy(falling);
    }

    isAir() {
        return false;
    }

    isLock1() {
        return false;
    }

    isLock2() {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#0000cc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(player: Player, dx: number, map: Map) {
        this.fallStrategy.moveHorizontal(player, this, dx, map);
    }

    moveVertical(player: Player, dy: number) {
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number, map: Map) {
        this.fallStrategy.update(x, y, this, map);
    }
}

class BoxTile implements Tile {
    private fallStrategy: FallStrategy

    constructor(private falling: FallingState) {
        this.fallStrategy = new FallStrategy(falling);
    }

    isAir() {
        return false;
    }

    isLock1() {
        return false;
    }

    isLock2() {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#8b4513";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(player: Player, dx: number, map: Map) {
        this.fallStrategy.moveHorizontal(player, this, dx, map);
    }

    moveVertical(player: Player, dy: number) {
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number, map: Map) {
        this.fallStrategy.update(x, y, this, map);
    }
}

class KeyTile implements Tile {
    constructor(
        private keyConf: KeyConfiguration) {
    }

    isAir() {
        return false;
    }

    isLock1() {
        return false;
    }

    isLock2() {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        this.keyConf.setColor(g);
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(player: Player, dx: number, map: Map) {
        this.keyConf.removeLock(map);
        player.move(dx, 0, map)
    }

    moveVertical(player: Player, dy: number, map: Map) {
        this.keyConf.removeLock(map);
        player.moveVertical(dy, map)
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number) {
    }
}

class LockTile implements Tile {
    constructor(
        private keyConf: KeyConfiguration) {
    }

    isAir() {
        return false;
    }

    isLock1() {
        return this.keyConf.is1();
    }

    isLock2() {
        return !this.keyConf.is1();
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        this.keyConf.setColor(g);
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(player: Player, dx: number) {
    }

    moveVertical(player: Player, dy: number) {
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number) {
    }
}

class FallStrategy {
    constructor(private falling: FallingState) {
    }

    update(x: number, y: number, tile: Tile, map: Map) {
        this.falling = map.getBlockOnTopState(x, y + 1);
        this.falling.drop(tile, x, y, map)
    }

    moveHorizontal(player: Player, tile: Tile, dx: number, map: Map) {
        this.falling.moveHorizontal(player, tile, dx, map);
    }
}

class Falling implements FallingState {
    drop(tile: Tile, x: number, y: number, map: Map) {
        map.drop(tile, x, y);
    }

    moveHorizontal(player: Player, tile: Tile, dx: number) {
    }
}

class Resting implements FallingState {
    drop(tile: Tile, x: number, y: number) {
    }

    moveHorizontal(player: Player, tile: Tile, dx: number, map: Map) {
        player.pushHorizontal(tile, dx, map);
    }
}


class Right implements Input {
    handle(player: Player, map: Map) {
        player.moveHorizontal(1, map);
    }
}

class Left implements Input {
    handle(player: Player, map: Map) {
        player.moveHorizontal(-1, map);
    }
}

class Up implements Input {

    handle(player: Player, map: Map) {
        player.moveVertical(-1, map);
    }
}

class Down implements Input {

    handle(player: Player, map: Map) {
        player.moveVertical(1, map);
    }
}


class RemoveLock1 implements RemoveStrategy {
    check(tile: Tile) {
        return tile.isLock1()
    }
}

class RemoveLock2 implements RemoveStrategy {
    check(tile: Tile) {
        return tile.isLock2()
    }
}


class KeyConfiguration {
    constructor(
        private color: string,
        private _1: boolean,
        private removeStrategy: RemoveStrategy) {
    }

    setColor(g: CanvasRenderingContext2D) {
        g.fillStyle = this.color;
    }

    is1() {
        return this._1;
    }

    removeLock(map: Map) {
        map.remove(this.removeStrategy);
    }
}

const YELLOW_KEY =
    new KeyConfiguration("#ffcc00", true,
        new RemoveLock1());

const BLUE_KEY =
    new KeyConfiguration("#00ccff", false,
        new RemoveLock2());


class Player {
    private x = 1;
    private y = 1;

    draw(g: CanvasRenderingContext2D) {
        g.fillStyle = "#ff0000";
        g.fillRect(
            this.x * TILE_SIZE,
            this.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE);
    }

    moveHorizontal(dx: number, map: Map) {
        map.moveHorizontal(this, this.x, this.y, dx);
    }

    moveVertical(dy: number, map: Map) {
        map.moveVertical(this, this.x, this.y, dy);
    }

    move(dx: number, dy: number, map: Map) {
        this.moveToTile(this.x + dx, this.y + dy, map);
    }

    pushHorizontal(tile: Tile, dx: number, map: Map) {
        map.pushHorizontal(this, tile, this.x, this.y, dx);
    }

    moveToTile(newx: number, newy: number, map: Map) {
        map.movePlayer(this.x, this.y, newx, newy);
        this.x = newx;
        this.y = newy;
    }
}

let player = new Player();

const RAW_TILES = [
    RawTile.AIR,
    RawTile.FLUX,
    RawTile.UNBREAKABLE,
    RawTile.PLAYER,
    RawTile.STONE,
    RawTile.FALLING_STONE,
    RawTile.BOX,
    RawTile.FALLING_BOX,
    RawTile.KEY1,
    RawTile.LOCK1,
    RawTile.KEY2,
    RawTile.LOCK2
];

let rawMap: number[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 3, 0, 1, 1, 2, 0, 2],
    [2, 4, 2, 6, 1, 2, 0, 2],
    [2, 8, 4, 1, 1, 2, 0, 2],
    [2, 4, 1, 1, 1, 9, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
];
class Map {
    private map: Tile[][];
    constructor() {
        this.map = new Array(rawMap.length);
        for (let y = 0; y < rawMap.length; y++) {
            this.map[y] = new Array(rawMap[y].length);
            for (let x = 0; x < rawMap[y].length; x++)
                this.map[y][x] = RAW_TILES[rawMap[y][x]].transform();
        }
    }

    update() {
        for (let y = this.map.length - 1; y >= 0; y--)
            for (let x = 0; x < this.map[y].length; x++)
                this.map[y][x].update(x, y, this);
    }

    draw(g: CanvasRenderingContext2D) {
        for (let y = 0; y < this.map.length; y++)
            for (let x = 0; x < this.map[y].length; x++)
                this.map[y][x].draw(g, x, y);
    }

    drop(tile: Tile, x: number, y: number) {
        this.map[y + 1][x] = tile;
        this.map[y][x] = new AirTile();
    }

    getBlockOnTopState(x: number, y: number) {
        return this.map[y][x].getBlockOnTopState();
    }

    isAir(x: number, y: number) {
        return this.map[y][x].isAir();
    }

    movePlayer(x: number, y: number, newx: number, newy: number) {
        this.map[y][x] = new AirTile();
        this.map[newy][newx] = new
        PlayerTile();
    }

    moveHorizontal(player: Player, x: number, y: number, dx: number) {
        this.map[y][x + dx].moveHorizontal(player, dx, this);
    }

    moveVertical(player: Player, x: number, y: number, dy: number) {
        this.map[y + dy][x].moveVertical(player, dy, this);
    }

    pushHorizontal(player: Player, tile: Tile, x: number, y: number, dx: number) {
        if (this.map[y][x + dx + dx].isAir()
            && !this.map[y + 1][x + dx].isAir()) {
            this.map[y][x + dx + dx] = tile;
            player.moveToTile(x + dx, y, this);
        }
    }

    remove(shouldRemove: RemoveStrategy) {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map.length; x++) {
                if (shouldRemove.check(this.map[y][x])) {
                    this.map[y][x] = new AirTile();
                }
            }
        }
    }

}

let map = new Map();

let inputs: Input[] = [];

function handleInputs() {
    while (inputs.length > 0) {
        let input = inputs.pop();
        input.handle(player, map)
    }
}

function update() {
    handleInputs();
    map.update();
}

function createGraphics() {
    let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
    let g = canvas.getContext("2d");
    g.clearRect(0, 0, canvas.width, canvas.height);
    return g;
}

function draw() {
    let g = createGraphics();
    map.draw(g);
    player.draw(g);
}

function gameLoop() {
    let before = Date.now();
    update();
    draw();
    let after = Date.now();
    let frameTime = after - before;
    let sleep = SLEEP - frameTime;
    setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
    gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
    if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
    else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
    else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
    else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

