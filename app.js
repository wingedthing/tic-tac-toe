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
    const player2 = playerFactory('O', 'player2');
    let mode = undefined;
    let currentPlayer;

    const singlePlayerGame = () => {

    }

    const multiPlayerGame = () => {
      currentPlayer = player1;

    }

    const setCurrentPlayer = () => {
      if (currentPlayer.getName() == 'player1') return currentPlayer = player2;
      currentPlayer = player1;

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
        setCurrentPlayer();
        winLogic.checkWinner(index);
      }
    }

    return {
      singlePlayerGame,
      multiPlayerGame,
      clickSquare
    }

  })();

  /**
   * Determines if a player has won by checking the 8 possible win conditions on each round
   */
  const winLogic = (() => {
    let _currentRound = 1;
    const resetRound = () => _currentRound = 1;
    const winConditions = {
      condA: ['empty'], // (0, 1, 2) The indexes of the win conditions; i.e Top row
      condB: ['empty'], // (0, 3, 6) Left column
      condC: ['empty'], // (0, 4, 8) Top left to bottom right diagonal
      condD: ['empty'], // (1, 4, 7) Middle column
      condE: ['empty'], // (2, 5, 8) Right column
      condF: ['empty'], // (2, 4, 6) Top right to bottom left diagonal
      condG: ['empty'], // (3, 4, 5) Middle Row
      condH: ['empty']  // (6, 7, 8) Bottom Row
    };

    const hasWon = () => {
      console.log('winner!')
      resetRound();
      gameBoard.clearBoard();
    }
    /**
     * Checks and update key values in the winConditions object 
     * @param {*} condLetterArr An array of possible win cond letters that are used as keys in the winConditions object 
     * @param {*} symbol The current symbol that was played this round, to check and store in the winConditions object
     */
    const checkCondition = (condLetterArr, symbol) => {
      
      
      for (let i = 0; i < condLetterArr.length; i++) {
        let key = `cond${condLetterArr[i]}`;
        let condValue = winConditions[key][0];
        if (condValue === 'empty') {
          winConditions[key][0] = symbol;
          winConditions[key][1] = 1;
          continue;
        }

        if (condValue != symbol) {
          winConditions[key][0] = 'blocked';
          continue;
        }

        winConditions[key][1]++;
        
        if (winConditions[key][1] == 3) {
          return hasWon();
        }
      }

    }

    /**
     * Depending on the square index passed, will check if a 3 in a row has been made involving that square.
     * @param {*} index the index of the square to check. 
     */
    const checkWinner = (index) => {
      let symbolToCheck = (_currentRound % 2) ? 'O' : 'X';
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