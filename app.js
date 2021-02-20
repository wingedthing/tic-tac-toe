const gameModule = (() => {

  const _htmlSquares = document.querySelectorAll('td');

  /**
   * This module stores game board information
   */

  const gameBoard = (() => {
    let _board = new Array(9);
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
    let isCurrentPlayer1 = true;
    let currentPlayer;

    const singlePlayerGame = () => {

    }

    const multiPlayerGame = () => {
      currentPlayer = player1;
      
    }

    const setCurrentPlayer = () => {
      isCurrentPlayer1 = !isCurrentPlayer1;
      if(isCurrentPlayer1) return currentPlayer = player1;
      currentPlayer = player2;
      
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
      }
    }

    return {
      singlePlayerGame,
      multiPlayerGame,
      clickSquare
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

    const getIndexes = () => {
      for (let i = 0; i < 9; i++) {
        console.log(`board index ${i} = ${gameBoard.getSquare(i)}`);
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
      clearBoard
    }

  })();

  return {
    test,
    clickEvents
  }

})();