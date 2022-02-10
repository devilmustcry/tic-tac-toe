class Game {
    roomId = ''
    
    player1Id = ''

    player1Name = ''
    
    player2Id = ''

    player2Name = ''

    isPlayer1Ready = false

    isPlayer2Ready = false

    board = [[null, null, null],[null, null, null],[null, null, null]]

    currentPlayerTurn = ''

    winningPlayer = ''

    constructor(roomId, player1Id) {
        this.roomId = roomId
        this.player1Id = player1Id
    }

    setPlayer2Name(name) {
        this.player2Name = name
    }

    setPlayer1Name(name) {
        this.player1Name = name
    }

    insertSymbol(i, j, playerId) {
        if (this.player1Id === playerId) {
            this.board[i][j] = 'O' 
            this.currentPlayerTurn = this.player2Id
        } else {
            this.board[i][j] = 'X'
            this.currentPlayerTurn = this.player1Id
        }
    }

    isWinnerDetermined() {
        const winningConditions = [
            ['0,0', '0,1', '0,2'],
            ['1,0', '1,1', '1,2'],
            ['2,0', '2,1', '2,2'],
            ['0,0', '1,0', '2,0'],
            ['0,1', '1,1', '2,1'],
            ['0,2', '1,2', '2,2'],
            ['0,0', '1,1', '2,2'],
            ['0,2', '1,1', '2,0']
        ]
        for(let i = 0; i <8; i++) {
            const winCondition = winningConditions[i]
            const [firstRow, firstColumn] = winCondition[0].split(',')
            const [secondRow, secondColumn] = winCondition[1].split(',')
            const [thirdRow, thirdColumn] = winCondition[2].split(',')
            const first = this.board[firstRow][firstColumn]
            const second = this.board[secondRow][secondColumn]
            const third = this.board[thirdRow][thirdColumn]
            
            if (first === null || second === null || third === null) {
                continue
            }

            if (first === second && second === third) {
                if (first === 'O') {
                    this.winningPlayer = this.player1Name
                } else {
                    this.winningPlayer = this.player2Name
                }
                return true
            }
        }

        let isBoardHaveEmptySpace = false
        for (let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {
                if(this.board[i][j] === null) {
                    isBoardHaveEmptySpace = true
                    break
                }
            }
        }

        if (!isBoardHaveEmptySpace) {
            this.winningPlayer = 'Draw'
            return true
        }
    }

    isReadyToStartGame() {
        return this.isPlayer1Ready && this.isPlayer2Ready
    }

    startGame() {
        if (this.isReadyToStartGame()) {
            this.currentPlayerTurn = this.player1Id
        }
    }

    playerReady(playerId) {
        if (this.player1Id === playerId) {
            this.isPlayer1Ready = true
        } else {
            this.isPlayer2Ready = true
        }
    }

    printBoard() {
        let board = JSON.parse(JSON.stringify(this.board))
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if(!board[i][j]) {
                    board[i][j] = '-'
                }
            }
        }
        console.log('%s|%s|%s\n%s|%s|%s\n%s|%s|%s',board[0][0], board[0][1], board[0][2], board[1][0], board[1][1], board[1][2], board[2][0], board[2][1], board[2][2])
        console.log('----------------------------------------')
    }
}

module.exports = Game