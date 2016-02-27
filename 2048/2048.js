(function(){
  function getRandomInt(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  var App = function(){
    this.table = document.getElementById("table"); 
    this.template= document.getElementById("game-template").innerHTML;
    this.template = _.template(this.template);
    this.rows = 4, this.columns = 4, this.initialNumber = 0;
    this.generateInitial();
    this.render();
    this.generateNewElement();
    this.render();
    this.addListeners();
  };

  App.prototype.addListeners = function(){
    var self = this;
    document.addEventListener("keyup", function(event){
      var keyCode = event.keyCode;
      switch(keyCode){
        case 38 :  //up
          self.processMatrix("up");
          break;
        case 40 :  //down
          self.processMatrix("down");
          break;
        case 37 :  //left
          self.processMatrix("left");
          break;
        case 39 :  //right
          self.processMatrix("right");
          break;
      }
    });
  }

  App.prototype.generateInitial = function(){
    this.matrix = [];
    for(var i =0; i < this.rows* this.columns ; i ++){
      this.matrix.push({
        index: i,
        value: this.initialNumber,
        class : "",
        movement: {}
      });
    }
  };
  App.prototype.generateNewElement = function(){
    var target = null;
    var unUsedElements = this.getUnUsedElements();

    if(unUsedElements.length > 0){
      var randomInt = getRandomInt(0, unUsedElements.length - 1);

      var elementIndex = unUsedElements[randomInt].index;

      var randomValue = (getRandomInt(0, 100) % 2 === 0)? 2 : 4;

      this.matrix[elementIndex].value = randomValue;
      // this.matrix[elementIndex].class = "new";
      var index = this.matrix[elementIndex].index;

      document.getElementById("cell-"+index).classList.add("n"+randomValue, "new");
    }else{

    }
  };
  App.prototype.processMatrix = function(type){
    console.log("Calledddddd");
    this.clearClasses();
    switch(type){
      case "up":
        this.processMatrixUp();
        break;
      case "down":
        this.processMatrixDown();
        break;
      case "left":
        this.processMatrixLeft();
        break;
      case "right":
        this.processMatrixRight();
        break;
    }
    this.renderMovement(type)
    window.App.generateNewElement();
    setTimeout(function(){
      window.App.render();
    },200);

  };
  App.prototype.processMatrixUp = function(){
    for(var column=0; column < this.columns; column ++){

      for(var row = 1; row < this.rows; row++){

        this.checkCurrentCell("up", row, column);
      }
    }
  };

  App.prototype.processMatrixDown = function(){
    for(var column=0; column < this.columns; column ++){

      for(var row = this.rows-2 ; row > -1; row--){

        this.checkCurrentCell("down", row, column);
      }
    }
  };

  App.prototype.processMatrixLeft = function(){
    for(var row=0; row < this.rows; row ++){

      for(var column = 1; column < this.columns; column++){

        this.checkCurrentCell("left", row, column);
      }
    }
  };

  App.prototype.processMatrixRight = function(){
    for(var row=0; row < this.rows; row ++){

      for(var column = this.columns-2 ; column > -1; column--){

        this.checkCurrentCell("right", row, column);
      }
    }
  };

  App.prototype.checkCurrentCell = function(type, row, column){
    var currentCell = this.getByRowAndColumn(row, column);
    var currentCellValue = currentCell.value;
    if(currentCellValue !== 0){
      var nearByCells = this.checkNearByCells(type, row, column);

      var nonEmptyCell = nearByCells.nonEmptyCell;
      var emptyCell = nearByCells.emptyCell;
      if(nonEmptyCell && nonEmptyCell.value === currentCellValue){
        nonEmptyCell.value = currentCellValue * 2;
        nonEmptyCell.class = "merged";
        currentCell.move = {
          by : nearByCells.movement + 1,
          previousValue : currentCellValue
        }
        currentCell.value = 0;
      }else if(emptyCell){
        emptyCell.value = currentCellValue;
        currentCell.move = {
          by : nearByCells.movement,
          previousValue : currentCellValue
        };
        currentCell.value = 0;
      }
    }
  };

  App.prototype.checkNearByCells = function(type, row, column){
    var emptyCell = null, nonEmptyCell= null, movement = 0;
    switch(type){
      case "up":
        var previousRow = row -1;
        for ( var i = previousRow; i > -1; i --){
          var pointedCell = this.getByRowAndColumn(i, column);
          if(pointedCell.value === 0){
            movement ++;
            emptyCell = pointedCell;
          }else{
            nonEmptyCell = pointedCell;
            break;
          }
        }
        break;
      case "down":
        var previousRow = row + 1;
        for ( var i = previousRow; i < this.rows; i ++){
          var pointedCell = this.getByRowAndColumn(i, column);
          if(pointedCell.value === 0){
            movement ++;
            emptyCell = pointedCell;
          }else{
            nonEmptyCell = pointedCell;
            break;
          }
        }
        break;
      case "left":
        var previousColumn = column - 1;
        for(var i = previousColumn; i> -1; i --){
          var pointedCell = this.getByRowAndColumn(row, i);
          if(pointedCell.value === 0){
            movement ++;
            emptyCell = pointedCell;
          }else{
            nonEmptyCell = pointedCell;
            break;
          }
        }
        break;
      case "right":
        var previousColumn = column + 1;
        for(var i = previousColumn; i < this.columns; i ++){
          var pointedCell = this.getByRowAndColumn(row, i);
          if(pointedCell.value === 0){
            movement ++;
            emptyCell = pointedCell;
          }else{
            nonEmptyCell = pointedCell;
            break;
          }
        }
    }
    return  {
      emptyCell : emptyCell,
      nonEmptyCell: nonEmptyCell,
      movement: movement
    }
  };
  App.prototype.clearClasses = function(){
    _.each(this.matrix, function(cell){
      cell.class= "";
    });
  };
  App.prototype.clearMovement = function(){
    _.each(this.matrix, function(cell){
      cell.move= {};
    });
  };
  App.prototype.getByRowAndColumn = function(row, column){
    return this.matrix[row * this.columns + column];
  };
  App.prototype.getUnUsedElements = function(){
    return _.filter(this.matrix, function(cell){
      if(cell.value === 0){
        return true;
      }else{
        return false;
      }
    });
  };
  App.prototype.render = function(type){
    this.table.innerHTML = this.template({
      rows: this.rows,
      columns: this.columns,
      matrix: this.matrix,
      type: type
    });
  };
  App.prototype.renderMovement = function(type){
    // this.clearClasses();
    _.each(this.matrix, function(cell){
      if(cell.move){
        var element = document.getElementById("cell-"+cell.index);
        var className = ["move-", type, "-", cell.move.by].join("");
        element.classList.add(className);
        cell.move = {};
      }
    });

  };
  window.App = new App();
})();
  

