// Generated by CoffeeScript 1.3.3
(function() {

  window.Renderer = (function() {

    function Renderer(game) {
      this.game = game;
      this.tileSize = 450 / this.game.size;
    }

    Renderer.prototype.insertTile = function(x, y) {
      var borderBottom, borderRight;
      if (x === this.game.size - 1) {
        borderRight = true;
      } else {
        borderRight = false;
      }
      if (y === this.game.size - 1) {
        borderBottom = true;
      } else {
        borderBottom = false;
      }
      return $('<div></div>').addClass('tile').css({
        'width': this.tileSize,
        'height': this.tileSize,
        'left': x * this.tileSize + (940 / 2 - 450 / 2),
        'top': y * this.tileSize + 20,
        'border-right': borderRight ? '1px solid #555' : 'none',
        'border-bottom': borderBottom ? '1px solid #555' : 'none'
      }).attr({
        'data-x': x,
        'data-y': y
      }).appendTo('#game');
    };

    Renderer.prototype.place = function(x, y, turn) {
      var $placement, color;
      color = turn === 1 ? "#b94a48" : "#468847";
      $placement = $('<div></div>').addClass('placement').css({
        'margin-left': this.tileSize / 8,
        'color': color,
        'width': this.tileSize,
        'height': this.tileSize,
        'font-size': this.tileSize
      }).text(turn === 1 ? "X" : "O");
      return $(".tile[data-x='" + x + "'][data-y='" + y + "']").append($placement);
    };

    Renderer.prototype.clearGame = function() {
      return $('.tile').remove();
    };

    Renderer.prototype.changeState = function(state) {
      $('#state').removeClass('alert-error').removeClass('alert-info').removeClass('alert-success');
      switch (state) {
        case "DEFAULT":
          return $('#state').addClass('alert-info').text("Bon jeu !");
        case "PLAYER-WIN":
          return $('#state').addClass('alert-success').text("Vous avez battu l'IA, félicitations !");
        case "IA-WIN":
          return $('#state').text("L'IA a gagné... retentez votre chance !");
        case "DRAW":
          return $('#state').addClass('alert-info').text("Match nul !");
      }
    };

    return Renderer;

  })();

  window.IA = (function() {

    function IA(game) {
      this.game = game;
    }

    IA.prototype.getAllPlacements = function() {
      var placements, x, y, _i, _j, _ref, _ref1;
      placements = [];
      for (x = _i = 0, _ref = this.game.size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        for (y = _j = 0, _ref1 = this.game.size - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          if (this.game.grid[x][y] === 0) {
            placements.push([x, y]);
          }
        }
      }
      return placements;
    };

    IA.prototype.placementScore = function(x, y) {
      var i, score, testIA, testOpponent, _i, _ref;
      testIA = this.game.maxAlignment(x, y, 2);
      testOpponent = this.game.maxAlignment(x, y, 1);
      score = this.game.alignSize * 2;
      for (i = _i = 0, _ref = this.game.alignSize; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (testIA === this.game.alignSize - i) {
          return score;
        }
        if (testOpponent === this.game.alignSize - i) {
          return score - 1;
        }
        score -= 2;
      }
      return 0;
    };

    IA.prototype.bestPlacement = function() {
      var best, placement, score, _i, _len, _ref;
      best = {
        score: 0,
        placement: []
      };
      _ref = this.getAllPlacements();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        placement = _ref[_i];
        score = this.placementScore(placement[0], placement[1]);
        if (score > best.score) {
          best.score = score;
          best.placement = placement;
        }
      }
      return best.placement;
    };

    IA.prototype.play = function() {
      var superCleverPlacement;
      superCleverPlacement = this.bestPlacement();
      return this.game.play(superCleverPlacement[0], superCleverPlacement[1], 2);
    };

    return IA;

  })();

  $(document).ready(function() {
    var newGame;
    window.game = null;
    newGame = function(size, alignSize) {
      if (window.game) {
        console.log("a");
        game.clear();
        $('.tile').die('click');
      }
      window.game = new Game(size, alignSize);
      return $('.tile').live('click', function() {
        var x, y;
        x = parseInt($(this).attr('data-x'));
        y = parseInt($(this).attr('data-y'));
        return window.game.play(x, y);
      });
    };
    $('a[data-action]').click(function(event) {
      var action;
      event.preventDefault();
      action = $(this).attr('data-action');
      switch (action) {
        case "0":
          return $('#custom-game').modal();
        case "1":
          return newGame(3, 3);
        case "2":
          return newGame(10, 4);
        case "3":
          return newGame(20, 5);
      }
    });
    return $('#new-game').submit(function(event) {
      var alignSize, size;
      event.preventDefault();
      $('#custom-game').modal('hide');
      $('#state').removeClass('alert-error').removeClass('alert-info').removeClass('alert-success');
      size = parseInt($("input[name='size']").val());
      alignSize = parseInt($("input[name='align-size']").val());
      if (isNaN(size) || isNaN(alignSize)) {
        return $('#state').addClass('alert-error').text("Les données entrées ne sont pas valides.");
      } else if (size < 3) {
        return $('#state').addClass('alert-error').text("La grille ne peut pas être plus petite qu'une grille de morpion !");
      } else if (size < alignSize) {
        return $('#state').addClass('alert-error').text("L'alignement est trop grand par rapport à la taille de la grille !");
      } else if (size > 40) {
        return $('#state').addClass('alert-error').text("La grille est trop grande !");
      } else {
        return newGame(size, alignSize);
      }
    });
  });

  window.Game = (function() {

    function Game(size, alignSize) {
      this.size = size != null ? size : 4;
      this.alignSize = alignSize != null ? alignSize : 3;
      this.frozen = false;
      this.grid = [];
      this.renderer = new Renderer(this);
      this.IA = new IA(this);
      this.generateGrid();
      this.renderer.changeState('DEFAULT');
    }

    Game.prototype.generateGrid = function() {
      var x, y, _i, _ref, _results;
      _results = [];
      for (x = _i = 0, _ref = this.size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        this.grid[x] = [];
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (y = _j = 0, _ref1 = this.size - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
            this.grid[x][y] = 0;
            _results1.push(this.renderer.insertTile(x, y));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Game.prototype.checkDraw = function() {
      var x, y, _i, _j, _ref, _ref1;
      for (x = _i = 0, _ref = this.size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        for (y = _j = 0, _ref1 = this.size - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          if (this.grid[x][y] === 0) {
            return false;
          }
        }
      }
      return true;
    };

    Game.prototype.outOfGrid = function(x, y) {
      return x < 0 || y < 0 || x >= this.grid.length || y >= this.grid.length;
    };

    Game.prototype.maxAlignment = function(lastX, lastY, turn) {
      var count, direction, directions, maxAlignment, maxAlignments, way, x, y, _i, _j, _len, _len1;
      if (turn == null) {
        turn = 1;
      }
      maxAlignments = [];
      directions = [[[1, 0], [-1, 0]], [[0, 1], [0, -1]], [[-1, 1], [1, -1]], [[-1, -1], [1, 1]]];
      for (_i = 0, _len = directions.length; _i < _len; _i++) {
        direction = directions[_i];
        count = 1;
        for (_j = 0, _len1 = direction.length; _j < _len1; _j++) {
          way = direction[_j];
          x = lastX + way[0];
          y = lastY + way[1];
          while (!(this.outOfGrid(x, y)) && this.grid[x][y] === turn && this.grid[x][y] !== 0) {
            count++;
            x += way[0];
            y += way[1];
          }
        }
        maxAlignments.push(count);
      }
      maxAlignment = Math.max.apply(Math, maxAlignments);
      return maxAlignment;
    };

    Game.prototype.placementResult = function(x, y, turn) {
      var result;
      result = this.maxAlignment(x, y, turn);
      if (result === this.alignSize) {
        return 1;
      }
      if (this.checkDraw()) {
        return 2;
      }
      return true;
    };

    Game.prototype.play = function(x, y, turn) {
      var result;
      if (turn == null) {
        turn = 1;
      }
      console.log(x + "," + y);
      if (this.grid[x][y] !== 0 || this.frozen) {
        return false;
      }
      this.grid[x][y] = turn;
      this.renderer.place(x, y, turn);
      result = this.placementResult(x, y, turn);
      if (result === 1) {
        if (turn === 1) {
          this.renderer.changeState('PLAYER-WIN');
        } else {
          this.renderer.changeState('IA-WIN');
        }
        this.frozen = true;
        return;
      }
      if (result === 2) {
        console.log("a");
        this.renderer.changeState('DRAW');
        this.frozen = true;
        return;
      }
      if (turn === 1) {
        return this.IA.play();
      }
    };

    Game.prototype.clear = function() {
      return this.renderer.clearGame();
    };

    return Game;

  })();

}).call(this);
