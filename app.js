(function () {


  /**
   * This module stores game board information
   */

  const gameBoard = (() => {
    let _board = new Array(9);
    const getSquare = (indexNum) => _board[indexNum];

    /**
     * Sets the textContent of a square to the value of the player's symbol (X or O)
     * @param {*} indexNum data index number of the square in the array from top left to bottom right 0-8.
     * @param {*} player the player who changes the textContent. 
     */
    const setSquare = (indexNum, player) => {
      const htmlSquare = document.getElementById(`${indexNum}`);
      
      
    }

    return {
      getSquare,
      setSquare
    }


  })();


})();