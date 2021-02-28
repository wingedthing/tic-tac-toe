const gameModule = (() => {

  const _htmlSquares = document.querySelectorAll('td');
  const _line = document.querySelector('line');

  /**
   * This module stores and manipulates game board information
   */

  const gameBoard = (() => {
    const _board = new Array(9).fill(undefined);
    let _isGameOver = false;
    
    const getSquare = (indexNum) => _board[indexNum];
    
    const getBoard = (() => {
      const boardCopy = _board.map(el => el);
      return boardCopy
    });

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
        _line.style.visibility = "hidden";
      });

    }

    const getIsGameOver = () => {
      return _isGameOver;
    }

    return {
      getSquare,
      setSquare,
      clearBoard,
      getIsGameOver,
      getBoard
    }
  })();

  /**
   * 
   * @param {*} symbol the player's symbol (X or O);
   * @param {*} name The player's name, used for some logic checks.
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

  /**
   * Calls gameBoard.getBoard to copy the current _board and then checks for free squares and returns the index of one at random.
   */
  const pickRandomSquare = () => {
    const currentBoard = gameBoard.getBoard();
    const openSquaresIndexes = [];
    currentBoard.forEach((el, i) => {
      if (el === undefined) openSquaresIndexes.push(i);
    });
    const max = openSquaresIndexes.length - 1;
    const randomIndex = Math.floor(Math.random() * max);
    return openSquaresIndexes[randomIndex];
  }

  /**
   * Handles selecting of game mode, creation/selection of players, and square clicking logic.
   * Calls the winLogic, playerFactory, gameBoard and clickEvents modules.   
   */
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
     * Executed when a plyer has won, or there is a setCoords, handles calling  data reset and display functions.
     * @param {*} boolean true for a win, false for a setCoords
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
          drawLine(key);
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

  /**
   * Returns a new DocumentFragment and adds a DOM node to it 
   * @param {*} tagString The string of html input to be encoded into a dom node and added to the DocumentFragment 
   */
  const makeDocFrag = (tagString) => {
    let range = document.createRange();
    return range.createContextualFragment(tagString);
  }

  const drawLine = (winCond) => {
    _line.style.visibility = "visible";
    if(winCond == "condA") setCoords(0,16.7,100,16.7)
    if(winCond == "condB") setCoords(16.7,0,16.7,100)
    if(winCond == "condC") setCoords(0,0,100,100)
    if(winCond == "condD") setCoords(50,0,50,100)
    if(winCond == "condE") setCoords(83.3,0,83.3,100)
    if(winCond == "condF") setCoords(100,0,0,100)
    if(winCond == "condG") setCoords(0,50,100,50)
    if(winCond == "condH") setCoords(0,83.3,100,83.3)

    function setCoords(x1,y1,x2,y2) {
      _line.attributes.x1.nodeValue = `${x1}%`;
      _line.attributes.y1.nodeValue = `${y1}%`;
      _line.attributes.x2.nodeValue = `${x2}%`;
      _line.attributes.y2.nodeValue = `${y2}%`;
    }
  }



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
    winLogic,
    drawLine
  }

})();