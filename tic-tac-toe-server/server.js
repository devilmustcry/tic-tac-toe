const io = require('socket.io')(3000);
const Game = require('./game')

const { v4: uuidv4 } = require('uuid')

const EVENTS = {
    'CONNECTED': 'CONNECTED',
    'REGISTER_TO_MATCHMAKING': 'REGISTER_TO_MATCH_MAKING',
    'MATCH_PENDING': 'MATCH_PENDING',
    'MATCH_FOUND': 'MATCH_FOUND',
    'GAME_START': 'GAME_START',
    'TURN_STARTED': 'TURN_STARTED',
    'PLAY_MOVE': 'PLAY_MOVE',
    'GAME_END': 'GAME_END',
    'PRINT_BOARD': 'PRINT_BOARD'
}

const DEBUG = {
    'LIST_ROOM': 'LIST_ROOM'
}

const availableRooms = []

// Should be hashmap
const ongoingRooms = []

io.on('connect', (socket) => {
    // console.log(socket.id)
    socket.emit(EVENTS.CONNECTED, 'Welcome to Tic Tac Toe game')
    
    socket.on(EVENTS.REGISTER_TO_MATCHMAKING, (data) => {
        if (availableRooms.length > 0) {
            // There is available room join available one first
            availableRooms[0].player2Id = socket.id
            availableRooms[0].player2Name = data
            const game = availableRooms.shift()
            ongoingRooms.push(game)
            socket.join(game.roomId)
            io.to(game.roomId).emit(EVENTS.MATCH_FOUND, game.roomId)
        } else {
            // There is no available room create new one
            const game = new Game(uuidv4(), socket.id)
            game.setPlayer1Name(data)
            availableRooms.push(game)
            socket.join(game.roomId)
            socket.emit(EVENTS.MATCH_PENDING, game.roomId)
        }
    })

    socket.on(EVENTS.GAME_START, roomId => {
        const game = ongoingRooms.find((game) => game.roomId === roomId)
        game.playerReady(socket.id)
        if (game.isReadyToStartGame()) {
            console.log('Starting Game')
            game.startGame()
            io.to(game.roomId).emit(EVENTS.PRINT_BOARD, game.board)
            io.to(game.currentPlayerTurn).emit(EVENTS.TURN_STARTED, game.board)
        }
    })

    socket.on(EVENTS.PLAY_MOVE, (row, column, roomId) => {
        const game = ongoingRooms.find((game) => game.roomId === roomId)
        game.insertSymbol(row, column, socket.id)
        const winner = game.isWinnerDetermined()
        console.log(winner)
        if (winner) {
            io.to(game.roomId).emit(EVENTS.PRINT_BOARD, game.board)
            io.to(game.roomId).emit(EVENTS.GAME_END, game.winningPlayer)
        } else {
            io.to(game.roomId).emit(EVENTS.PRINT_BOARD, game.board)
            io.to(game.currentPlayerTurn).emit(EVENTS.TURN_STARTED, game.board)
        }

    })

})