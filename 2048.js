//              Blank,  2,      4,      8,      16,     32,        64,     128,    256,     512,      1024,      2048,   4096,      8192,      16384,     32768
const COLORS = ["#000", "#f00", "#0f0", "#ff0", "#00f", "#800080", "#0ff", "#fff", "#f0f", "#ffa500", "#d3d3d3", "#912", "#ff9b6e", "#007822", "#9189ff", "#b3c300"]
const CANVAS_SIZE = 16
const NUM_TILES = 4
const TILE_SIZE = CANVAS_SIZE / NUM_TILES

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'icon';
document.getElementsByTagName('head')[0].appendChild(link);

var board = []
var score = 0
reset()

function reset() {
    board = create_board()
    score = 0
    insert_tile()
    draw_board()
}

document.onkeydown = function(evt) {
    evt = evt || window.event

    var shifted = false
    if (evt.keyCode == '38') {
        shifted = shift_up()
    } else if (evt.keyCode == '40') {
        shifted = shift_down()
    } else if (evt.keyCode == '37') {
        shifted = shift_left()
    } else if (evt.keyCode == '39') {
        shifted = shift_right()
    } else {
        return
    }

    if (shifted) {
        insert_tile()
        draw_board()
    }
}

// Create empty game board
function create_board() {
    var board = []
    for (var x = 0; x < NUM_TILES; x++) {
        board[x] = []
        for (var y = 0; y < NUM_TILES; y++) {
            board[x][y] = 0
        }
    }

    return board
}

// Finds an empty slot to insert a 2 or 4 tile
function insert_tile() {
    // 10% chance for 2
    var new_tile = (Math.random() > 0.9) ? 2 : 1

    // Instead of just picking spots and hoping for the best,
    // get a list of the empty spots and pick one of them
    var empty_tiles = []
    for (var x = 0; x < NUM_TILES; x++) {
        for (var y = 0; y < NUM_TILES; y++) {
            if (board[x][y] == 0) {
                empty_tiles.push([x,y])
            }
        }
    }

    var rand_xy = empty_tiles[Math.floor(Math.random() * empty_tiles.length)]
    board[rand_xy[0]][rand_xy[1]] = new_tile
}

function draw_board() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    for (var x = 0; x < NUM_TILES; x++) {
        for (var y = 0; y < NUM_TILES; y++) {
            ctx.fillStyle = COLORS[board[x][y]]
            ctx.fillRect(NUM_TILES * x, NUM_TILES * y, TILE_SIZE, TILE_SIZE)
        }
    }
    link.href = canvas.toDataURL("image/x-icon");
    document.getElementById("score").innerHTML = "Score: " + score
}

// TODO: Find a way to merge the four shift functions together
function shift_right() {
    var shifted = false
    for (var y = 0; y < NUM_TILES; y++) {
        // Two phases - First merge all like pairs of number
        for (var x = NUM_TILES - 1; x > 0; x--) {
            if (board[x][y] == 0) {
                continue
            }
            for (var x2 = x - 1; x2 >= 0; x2--) {
                if (board[x][y] == board[x2][y]) {
                    board[x][y] += 1
                    score += Math.pow(2, board[x][y])
                    board[x2][y] = 0
                    shifted = true
                    break
                } else if (board[x][y] != board[x2][y]) {
                    break
                }
            }
        }

        // Then shift all numbers over to the side
        for (var x = NUM_TILES - 1; x > 0; x--) {
            if (board[x][y] != 0) {
                continue
            }
            for (var x2 = x - 1; x2 >= 0; x2--) {
                if (board[x2][y] != 0) {
                    board[x][y] = board[x2][y]
                    board[x2][y] = 0
                    shifted = true
                    break
                }
            }
        }
    }
    return shifted
}

function shift_left() {
    var shifted = false
    for (var y = 0; y < NUM_TILES; y++) {
        for (var x = 0; x < NUM_TILES - 1; x++) {
            if (board[x][y] == 0) {
                continue
            }
            for (var x2 = x + 1; x2 < NUM_TILES; x2++) {
                if (board[x][y] == board[x2][y]) {
                    board[x][y] += 1
                    score += Math.pow(2, board[x][y])
                    board[x2][y] = 0
                    shifted = true
                    break
                } else if (board[x][y] != board[x2][y]) {
                    break
                }
            }
        }

        for (var x = 0; x < NUM_TILES - 1; x++) {
            if (board[x][y] != 0) {
                continue
            }
            for (var x2 = x + 1; x2 < NUM_TILES; x2++) {
                if (board[x2][y] != 0) {
                    board[x][y] = board[x2][y]
                    board[x2][y] = 0
                    shifted = true
                    break
                }
            }
        }
    }
    return shifted
}

function shift_down() {
    var shifted = false
    for (var x = 0; x < NUM_TILES; x++) {
        for (var y = NUM_TILES - 1; y > 0; y--) {
            if (board[x][y] == 0) {
                continue
            }
            for (var y2 = y - 1; y2 >= 0; y2--) {
                if (board[x][y] == board[x][y2]) {
                    board[x][y] += 1
                    score += Math.pow(2, board[x][y])
                    board[x][y2] = 0
                    shifted = true
                    break
                } else if(board[x][y] != board[x][y2]) {
                    break
                }
            }
        }

        for (var y = NUM_TILES - 1; y > 0; y--) {
            if (board[x][y] != 0) {
                continue
            }
            for (var y2 = y - 1; y2 >= 0; y2--) {
                if (board[x][y2] != 0) {
                    board[x][y] = board[x][y2]
                    board[x][y2] = 0
                    shifted = true
                    break
                }
            }
        }
    }
    return shifted
}

function shift_up() {
    var shifted = false
    for (var x = 0; x < NUM_TILES; x++) {
        for (var y = 0; y < NUM_TILES - 1; y++) {
            if (board[x][y] == 0) {
                continue
            }
            for (var y2 = y + 1; y2 < NUM_TILES; y2++) {
                if (board[x][y] == board[x][y2]) {
                    board[x][y] += 1
                    score += Math.pow(2, board[x][y])
                    board[x][y2] = 0
                    shifted = true
                    break
                } else if(board[x][y] != board[x][y2]) {
                    break
                }
            }
        }

        for (var y = 0; y < NUM_TILES - 1; y++) {
            if (board[x][y] != 0) {
                continue
            }
            for (var y2 = y + 1; y2 < NUM_TILES; y2++) {
                if (board[x][y2] != 0) {
                    board[x][y] = board[x][y2]
                    board[x][y2] = 0
                    shifted = true
                    break
                }
            }
        }
    }
    return shifted
}
