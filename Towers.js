var HEIGHT = window.innerHeight;

var towers = [
    [],
    [],
    []
];

var N = 8;

var solution = [];

var step;

var stepsPerSecond = 1;

var towerBase;

var prevDisk;

var nextDisk;

class Disk {

    constructor(tower, rank, totalRank) {
        this.tower = tower; // 0, 1, or 2.
        this.rank = rank; // From N on top to 1 on the bottom.

        this.width = (totalRank - rank + 2) * window.innerWidth / 60;
        this.height = HEIGHT / 20;
        this.colorID = Math.floor(Math.random() * 280301);
    }

    get nextDisk() {
        if (this.rank > towers[this.tower].length - 1)
            return undefined;
        return towers[this.tower][towers[this.tower].length - 1 - this.rank];
    }

    moveHelper(tower, solving) {
        towers[this.tower].splice(towers[this.tower].indexOf(this), 1);
        towers[tower].unshift(this);
        this.tower = tower;
        this.rank = towers[this.tower].length;
        if (solving) {
            solution.push([this, tower]);
        }
    }

    move(tower, solving = false) {
        if (this.nextDisk === undefined) {
            this.moveHelper(tower, solving);
        } else {
            var nextDisk = this.nextDisk;
            nextDisk.move((tower + 1) % 3 == this.tower ? (tower + 2) % 3 : (tower + 1) % 3, solving);
            this.moveHelper(tower, solving);
            nextDisk.move(tower, solving);
        }
    }

    display() {
        fill(this.colorID % 256, (this.colorID >> 8) % 256, (this.colorID >>16) % 256);
        rect(
            (3 + 2 * this.tower) * window.innerWidth / 10 - this.width / 2, 
             HEIGHT * 0.7 - this.height * this.rank, 
             this.width, 
             this.height
        );
    }

}


function initDisks(n) {
    for (var i = n; i > 0; i--) {
        towers[0].push(new Disk(0, i, n));
    }
}

function setup() {
    createCanvas(window.innerWidth, windowHeight);
    noStroke();
    initDisks(N);
    towers[0][towers[0].length - 1].move(2, true);
    solution.push([towers[2][towers[2].length - 1], 0]);
    towers[2][towers[2].length - 1].move(0);
}

function draw() {
    background(51, 51, 51);
    for (var i = 0, j; i < 3; i++) {
        fill(101,67,33);
        
        rect(
            (3 + 2 * i) * window.innerWidth / 10 - window.innerWidth / 160, 
            HEIGHT * 0.3, 
            window.innerWidth / 80, 
            HEIGHT * 0.4
        );
        
        for (j = 0; j < towers[i].length; j++) {
            towers[i][j].display();
        }
    }
    step = Math.floor(millis() / 1000 * stepsPerSecond) % solution.length;
    solution[step][0].move(solution[step][1]);
}