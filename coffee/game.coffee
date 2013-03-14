class window.Game

    constructor: (@size = 4, @alignSize = 3) ->
        @frozen = false
        @grid = []
        @renderer = new Renderer(@)
        @IA = new IA(@)
        @generateGrid()
        @renderer.changeState('DEFAULT')

    generateGrid: ->
        for x in [0..@size-1]
            @grid[x] = []
            for y in [0..@size-1]
                @grid[x][y] = 0
                @renderer.insertTile(x, y)

    checkDraw: ->
        for x in [0..@size-1]
            for y in [0..@size-1]
                return false if @grid[x][y] == 0
        true

    outOfGrid: (x, y) ->
        x < 0 or y < 0 or x >= @grid.length or y >= @grid.length

    maxAlignment: (lastX, lastY, turn = 1) ->
        maxAlignments = []
        directions = [
            [[1, 0], [-1, 0]],
            [[0, 1], [0, -1]],
            [[-1, 1], [1, -1]],
            [[-1, -1], [1, 1]] 
        ]
        for direction in directions
            count = 1
            for way in direction
                x = lastX + way[0]
                y = lastY + way[1]
                while not(@outOfGrid(x, y)) and @grid[x][y] == turn and @grid[x][y] != 0
                    count++
                    x += way[0]
                    y += way[1]
            maxAlignments.push(count)
        maxAlignment = Math.max.apply(Math, maxAlignments)
        maxAlignment

    placementResult: (x, y, turn) ->
        result = @maxAlignment(x, y, turn)
        return 1 if result == @alignSize
        return 2 if @checkDraw()
        true

    play: (x, y, turn = 1) ->
        console.log(x + "," + y)
        if @grid[x][y] != 0 or @frozen
            return false

        @grid[x][y] = turn
        @renderer.place(x, y, turn)

        result = @placementResult(x, y, turn)
        if result == 1
            if turn == 1 then @renderer.changeState('PLAYER-WIN') else @renderer.changeState('IA-WIN')
            @frozen = true
            return
        if result == 2
            console.log "a"
            @renderer.changeState('DRAW')
            @frozen = true
            return

        @IA.play() if turn == 1

    clear: ->
        @renderer.clearGame()