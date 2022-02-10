const { io } = require('socket.io-client')
const inquirer = require('inquirer')

const socket = io('ws://localhost:3000')


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

let ongoingGameRoomId

socket.on('connect', () => {

    socket.on(EVENTS.CONNECTED, data => {
        console.log(data)
        inquirer.prompt([{'type': 'input', message: 'Your Name: ', name: 'name'}]).then(ans => {
            socket.emit(EVENTS.REGISTER_TO_MATCHMAKING, ans.name)
        })
    })

    socket.on(EVENTS.MATCH_PENDING, roomId => {
        console.log('Waiting for opponent at room:', roomId)
    })

    socket.on(EVENTS.MATCH_FOUND, roomId => {
        console.log('Match found')
        console.log('Game is starting')
        ongoingGameRoomId = roomId
        socket.emit(EVENTS.GAME_START, roomId)
    })

    socket.on(EVENTS.PRINT_BOARD, board => {
        for(let i = 0; i <board.length; i++) {
            for(let j = 0; j<board[i].length; j++) {
                if(!board[i][j]) {
                    board[i][j] = '-'
                }
            }
        }
        console.log('%s|%s|%s\n%s|%s|%s\n%s|%s|%s',board[0][0], board[0][1], board[0][2], board[1][0], board[1][1], board[1][2], board[2][0], board[2][1], board[2][2])
        console.log('----------------------------------------')
    })

    socket.on(EVENTS.TURN_STARTED, data => {
        inquirer.prompt([{'type': 'input', message: 'Your Next Row: ', name: 'row'}, {'type': 'input', message: 'Your Next Column: ', name: 'column'}]).then(ans => {
            socket.emit(EVENTS.PLAY_MOVE, ans.row, ans.column, ongoingGameRoomId)
        })
    })

    socket.on(EVENTS.GAME_END, winner => {
        console.log('Winner is: ', winner)
    })
})