const gameModule = (() => {

  const _htmlSquares = document.querySelectorAll('td');

  /**
   * This module stores game board information
   */

  const gameBoard = (() => {
    const _board = new Array(9);
    let _isGameOver = false;
    const getSquare = (indexNum) => _board[indexNum];


    /**
     * Sets the textContent of a square to the value of the player's symbol (X or O)
     * @param {*} indexNum id number of the square in the array from top left to bottom right 0-8.
     * @param {*} player the player who changes the textContent. 
     */
    const setSquare = (indexNum, player) => {
      const htmlSquare = _htmlSquares[indexNum];
      htmlSquare.textContent = player.getSymbol();
      _board[indexNum] = player.getSymbol();
    }

    const clearBoard = () => {
      _board.forEach((element, index) => {
        _board[index] = undefined
        _htmlSquares[index].textContent = '';
      });

    }

    const getIsGameOver = () => {
      return _isGameOver;
    }

    return {
      getSquare,
      setSquare,
      clearBoard,
      getIsGameOver
    }
  })();

  /**
   * 
   * @param {*} symbol the player's symbol (X or O);
   */
  const playerFactory = (symbol, name) => {
    let _symbol = symbol;
    let _name = name;
    const getSymbol = () => _symbol;
    const getName = () => _name;


    return {
      getSymbol,
      getName,
    }
  }

  const gameLogic = (() => {
    const player1 = playerFactory('X', 'player1');
    let player2;
    let currentPlayer;

    const singlePlayerGame = () => {
      gameBoard.clearBoard();
    }

    const multiPlayerGame = () => {
      gameBoard.clearBoard();
      currentPlayer = player1;
      player2 = playerFactory('O', 'player2');

    }

    const switchCurrentPlayer = () => {
      if (currentPlayer.getName() == 'player1') return currentPlayer = player2;
      currentPlayer = player1;
    }

    const resetPlayers = () => {
      currentPlayer = undefined;
      player2 = undefined;
    }

    /**
     * Handles which symbol to display on click and calls setCurrentPlayer to alternate players.
     * @param {*} square td square element that will be passed in by the EventListener on click
     * @param {*} index index of the square element that will be passed in by the EventListener on click.
     */
    const clickSquare = (square, index) => {
      if (!currentPlayer) return console.log("currentPlayer is falsly!");
      if (square.textContent == '') {
        gameBoard.setSquare(index, currentPlayer);
        switchCurrentPlayer();
        winLogic.checkWinner(index);
      }
    }

    return {
      singlePlayerGame,
      multiPlayerGame,
      clickSquare,
      resetPlayers
    }

  })();

  /**
   * Determines if a player has won by checking the 8 possible win conditions on each round
   */
  const winLogic = (() => {
    let _currentRound = 1;
    const resetRound = () => _currentRound = 1;

    /**
     * The "database" of key value pairs that holds game state information
     * ['condValue' : (empty, X, O, or blocked), # of times accessed]
     */
    const winConditions = {
      condA: ['empty', 0], // (0, 1, 2) Top row
      condB: ['empty', 0], // (0, 3, 6) Left column
      condC: ['empty', 0], // (0, 4, 8) Top left to bottom right diagonal
      condD: ['empty', 0], // (1, 4, 7) Middle column
      condE: ['empty', 0], // (2, 5, 8) Right column
      condF: ['empty', 0], // (2, 4, 6) Top right to bottom left diagonal
      condG: ['empty', 0], // (3, 4, 5) Middle Row
      condH: ['empty', 0]  // (6, 7, 8) Bottom Row
    };

    const resetWinCond = () => {
      for(let key in winConditions){
        winConditions[key] = ['empty', 0];
      }
    }

    /**
     * Executed when a plyer has won, or there is a draw, handles calling  data reset and display functions.
     * @param {*} boolean true for a win, false for a draw
     * @param {*} symbol symbol of the current player who caused the hasWon function to be executed.  
     */
    const hasWon = (boolean, symbol) => {
      (boolean) ? console.log(`${symbol} has WON!`) : console.log('DRAW');
      resetRound();
      gameLogic.resetPlayers();
      resetWinCond();
    }

    /**
     * Checks and updates key values in the winConditions object 
     * @param {*} condLetterArr An array of possible win cond letters that are used as keys in the winConditions object 
     * @param {*} symbol The current symbol that was played this round, to check and store in the winConditions object
     */
    const checkCondition = (condLetterArr, symbol) => {
      
      for (let i = 0; i < condLetterArr.length; i++) {
        let key = `cond${condLetterArr[i]}`;
        let condValue = winConditions[key][0];
        if (condValue === 'empty') {
          winConditions[key][0] = symbol;
          winConditions[key][1]++;
          continue;
        }

        if (condValue != symbol) {
          winConditions[key][0] = 'blocked';
          continue;
        }

        winConditions[key][1]++;
        
        if (winConditions[key][1] >= 3) {
          return hasWon(true, symbol);
        }
      }

    }

    /**
     * Depending on the square index passed in, will check if a 3 in a row has been made involving that square.
     * @param {*} index the index of the square to check. 
     */
    const checkWinner = (index) => {
      let symbolToCheck = (_currentRound % 2 === 0) ? 'O' : 'X';
      let condArr;
      _currentRound++;

      switch (index) {
        case 0:
          condArr = ['A','B','C'];
          break;
        case 1:
          condArr = ['A','D'];
          break;
        case 2:
          condArr = ['A','E','F'];
          break;
        case 3:
          condArr = ['B','G'];
          break;
        case 4:
          condArr = ['C', 'D', 'F', 'G'];
          break;
        case 5:
          condArr = ['E','G'];
          break;
        case 6:
          condArr = ['B','F','H'];
          break;
        case 7:
          condArr = ['D','H'];
          break;
        case 8:
          condArr = ['C', 'E', 'H'];
      }

      checkCondition(condArr, symbolToCheck);
      if (_currentRound > 9) hasWon(false); 

    }

    return {
      resetRound,
      checkWinner,
      checkCondition,
      winConditions
    }

  })();

  const clickEvents = (() => {
    const _singlePlayerButton = document.querySelector('#singlePlayer');
    const _multiPlayerButton = document.querySelector('#multiplayer');

    _multiPlayerButton.addEventListener('click', () => gameLogic.multiPlayerGame());
    _singlePlayerButton.addEventListener('click', () => gameLogic.singlePlayerGame());

    _htmlSquares.forEach((element, index) => {
      element.addEventListener('click', () => {
        gameLogic.clickSquare(element, index);

      });
    });

  })();

  /**
   * testing module to allow browser access to private modules.
   */
  const test = (() => {
    const player1 = playerFactory('X');
    const player2 = playerFactory('O');
    const indexArr = [];

    const getIndexes = () => {
      for (let i = 0; i < 9; i++) {
        console.log(`board index ${i} = ${gameBoard.getSquare(i)}`);
        indexArr.push(gameBoard.getSquare(i));
      }
    }

    const getHtml = () => {
      return document.querySelectorAll('td');
    }

    const setSquare = (indexNum, symbol) => {
      if (symbol === 'X') return gameBoard.setSquare(indexNum, player1);
      gameBoard.setSquare(indexNum, player2);
    }

    const clearBoard = () => {
      gameBoard.clearBoard();
    }

    return {
      getIndexes,
      getHtml,
      setSquare,
      clearBoard,
      indexArr
    }

  })();

  return {
    test,
    clickEvents,
    winLogic
  }

})();