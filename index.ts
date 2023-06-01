const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
    AIR,
    FLUX,
    UNBREAKABLE,
    PLAYER,
    STONE, FALLING_STONE,
    BOX, FALLING_BOX,
    KEY1, LOCK1,
    KEY2, LOCK2
}

interface Input {
    handle(player: Player): void;
}

interface Tile {
    isAir(): boolean;

    isLock1(): boolean;

    isLock2(): boolean;

    draw(g: CanvasRenderingContext2D, x: number, y: number): void;

    moveHorizontal(player: Player, dx: number): void;

    moveVertical(player: Player, dy: number): void;

    update(x: number, y: number): void;

    getBlockOnTopState(): FallingState;
}

interface FallingState {
    drop(tile: Tile, x: number, y: number): void;

    moveHorizontal(player: Player, tile: Tile, dx: number): void;
}

interface RemoveStrategy {
    check(tile: Tile): boolean;
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

    moveHorizontal(player: Player, dx: number) {
        player.move(dx, 0)
    }

    moveVertical(player: Player, dy: number) {
        player.move(0, dy)
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

    moveHorizontal(player: Player, dx: number) {
        player.move(dx, 0)
    }

    moveVertical(player: Player, dy: number) {
        player.move(0, dy)
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

    moveHorizontal(player: Player, dx: number) {
        this.fallStrategy.moveHorizontal(player, this, dx);
    }

    moveVertical(player: Player, dy: number) {
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number) {
        this.fallStrategy.update(x, y, this);
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

    moveHorizontal(player: Player, dx: number) {
        this.fallStrategy.moveHorizontal(player, this, dx);
    }

    moveVertical(player: Player, dy: number) {
    }

    getBlockOnTopState() {
        return new Resting();
    }

    update(x: number, y: number) {
        this.fallStrategy.update(x, y, this);
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
    moveHorizontal(player: Player, dx: number) {
        this.keyConf.removeLock();
        player.move(dx, 0)
    }

    moveVertical(player: Player, dy: number) {
        this.keyConf.removeLock();
        player.moveVertical(dy)
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

    update(x: number, y: number, tile: Tile) {
        this.falling = map[y + 1][x].getBlockOnTopState();
        this.falling.drop(tile, x, y)
    }

    moveHorizontal(player: Player, tile: Tile, dx: number) {
        this.falling.moveHorizontal(player, tile, dx);
    }
}

class Falling implements FallingState {
    drop(tile: Tile, x: number, y: number) {
        map[y + 1][x] = tile;
        map[y][x] = new AirTile();
    }

    moveHorizontal(player: Player, tile: Tile, dx: number) {
    }
}

class Resting implements FallingState {
    drop(tile: Tile, x: number, y: number) {
    }

    moveHorizontal(
        player: Player, tile: Tile, dx: number) {
        player.pushHorizontal(tile, dx);
    }
}


class Right implements Input {
    handle(player: Player) {
        player.moveHorizontal(1);
    }
}

class Left implements Input {
    handle(player: Player) {
        player.moveHorizontal(-1);
    }
}

class Up implements Input {

    handle(player: Player) {
        player.moveVertical( -1);
    }
}

class Down implements Input {

    handle(player: Player) {
        player.moveVertical( 1);
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

    removeLock() {
        remove(this.removeStrategy);
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

    moveHorizontal(dx: number) {
        map[this.y][this.x + dx]
            .moveHorizontal(this, dx);
    }

    moveVertical(dy: number) {
        map[this.y + dy][this.x]
            .moveVertical(this, dy);
    }

    move(dx: number, dy: number) {
        this.moveToTile(this.x + dx, this.y + dy);
    }

    pushHorizontal(tile: Tile, dx: number) {
        if (map[this.y]
                [this.x + dx + dx].isAir()
            && !map[this.y + 1]
                [this.x + dx].isAir()) {
            map[this.y][this.x + dx + dx] = tile;
            this.moveToTile(this.x + dx, this.y);
        }
    }

    private moveToTile(newx: number, newy: number) {
        map[this.y][this.x] = new AirTile();
        map[newy][newx] = new PlayerTile();
        this.x = newx;
        this.y = newy;
    }
}

let player = new Player();


let rawMap: RawTile[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 3, 0, 1, 1, 2, 0, 2],
    [2, 4, 2, 6, 1, 2, 0, 2],
    [2, 8, 4, 1, 1, 2, 0, 2],
    [2, 4, 1, 1, 1, 9, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
];
let map: Tile[][];
let inputs: Input[] = [];

function assertExhausted(x: never): never {
    throw new Error("Unexpected object: " + x);
}

function transformTile(tile: RawTile) {
    switch (tile) {
        case RawTile.AIR:
            return new AirTile();
        case RawTile.PLAYER:
            return new PlayerTile();
        case RawTile.UNBREAKABLE:
            return new UnbreakableTile();
        case RawTile.STONE:
            return new StoneTile(new Resting());
        case RawTile.FALLING_STONE:
            return new StoneTile(new Falling());
        case RawTile.BOX:
            return new BoxTile(new Falling());
        case RawTile.FALLING_BOX:
            return new BoxTile(new Resting());
        case RawTile.FLUX:
            return new FluxTile();
        case RawTile.KEY1:
            return new KeyTile(YELLOW_KEY);
        case RawTile.LOCK1:
            return new LockTile(YELLOW_KEY);
        case RawTile.KEY2:
            return new KeyTile(BLUE_KEY);
        case RawTile.LOCK2:
            return new LockTile(BLUE_KEY);
        default:
            assertExhausted(tile);
    }
}

function transformMap() {
    map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
        map[y] = new Array(rawMap[y].length);
        for (let x = 0; x < rawMap[y].length; x++) {
            map[y][x] = transformTile(rawMap[y][x]);
        }
    }
}

function remove(shouldRemove: RemoveStrategy) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (shouldRemove.check(map[y][x])) {
                map[y][x] = new AirTile();
            }
        }
    }
}

function handleInputs() {
    while (inputs.length > 0) {
        let input = inputs.pop();
        input.handle(player)
    }
}

function updateMap() {
    for (let y = map.length - 1; y >= 0; y--) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x].update(x, y)
        }
    }
}

function update() {
    handleInputs();
    updateMap();
}

function drawMap(g: CanvasRenderingContext2D) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x].draw(g, x, y);
        }
    }
}

function createGraphics() {
    let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
    let g = canvas.getContext("2d");
    g.clearRect(0, 0, canvas.width, canvas.height);
    return g;
}

function draw() {
    let g = createGraphics();
    drawMap(g);
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
    transformMap();
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

