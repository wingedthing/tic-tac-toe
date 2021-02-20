const gameModule = (() => {
  
  const _htmlSquares = document.querySelectorAll('td');

  /**
   * This module stores game board information
   */

  const gameBoard = (() => {
    let _board = new Array(9);
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
      console.log(getSquare(indexNum));

    }

    const clearBoard = () => {
      _board.forEach((element, index) => {
        _board[index] = undefined
        _htmlSquares[index].textContent = '';
      });

    }

    return {
      getSquare,
      setSquare,
      clearBoard
    }
  })();

  /**
   * 
   * @param {*} symbol the player's symbol (X or O);
   */
  const playerFactory = (symbol) => {
    let _symbol = symbol;
    const getSymbol = () => _symbol;


    return {
      getSymbol,
    }
  }

  const clickEvents = (() => {
    const _singlePlayerButton = document.querySelector('#singlePlayer');
    const _multiPlayerButton = document.querySelector('#multiplayer');

    _multiPlayerButton.addEventListener('click', ()=> gameLogic.multiPlayer());
    _singlePlayerButton.addEventListener('click', () => gameLogic.singlePlayer());
    
    _htmlSquares.forEach(element =>{
      element.addEventListener('click', ()=>{
        gameLogic.clickSquare();
      })
    })

    const testButtons = () => {
      console.dir([_onePlayerButton,_multiPlayerButton]);
    }

    return{
      testButtons,
    }

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
     if(symbol === 'X') return gameBoard.setSquare(indexNum, player1);
     gameBoard.setSquare(indexNum, player2);
    }

    const clearBoard = () => {
      gameBoard.clearBoard();
    }

    return{
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