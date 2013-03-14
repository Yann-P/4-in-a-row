class window.IA

    constructor: (@game) ->

    getAllPlacements: ->
        placements = []
        for x in [0..@game.size-1]
            for y in [0..@game.size-1]
                placements.push([x, y]) if @game.grid[x][y] == 0
        placements

    placementScore: (x, y) ->
        testIA = @game.maxAlignment(x, y, 2)
        testOpponent = @game.maxAlignment(x, y, 1)
        score = @game.alignSize*2
        for i in [0..@game.alignSize]
            if testIA == @game.alignSize - i
                return score
            if testOpponent == @game.alignSize - i
                return score - 1
            score -= 2
        return 0

    bestPlacement: ->
        best = {
            score: 0
            placement: []
        }
        for placement in @getAllPlacements()
            score = @placementScore(placement[0], placement[1])
            if score > best.score
                best.score = score
                best.placement = placement
        best.placement

    play: ->
        superCleverPlacement =  @bestPlacement()
        @game.play(superCleverPlacement[0], superCleverPlacement[1], 2)
