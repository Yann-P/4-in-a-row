class window.Renderer

	constructor: (@game) ->
		@tileSize = 450 / @game.size

	insertTile: (x, y) ->
		if x == @game.size-1 then borderRight = true else borderRight = false
		if y == @game.size-1 then borderBottom = true else borderBottom = false

		$('<div></div>').addClass('tile').css({
			'width': @tileSize
			'height': @tileSize
			'left': x * @tileSize + (940/2 - 450/2)
			'top':  y * @tileSize + 20
			'border-right':  if borderRight  then '1px solid #555' else 'none'
			'border-bottom': if borderBottom then '1px solid #555' else 'none'
		}).attr({
			'data-x': x
			'data-y': y
		}).appendTo('#game')

	place: (x, y, turn) ->
		color = if turn == 1 then "#b94a48" else "#468847"
		$placement = $('<div></div>')
			.addClass('placement')
			.css({
				'margin-left': @tileSize/8
				'color': color
				'width': @tileSize
				'height': @tileSize
				'font-size': @tileSize
			})
			.text(if turn == 1 then "X" else "O")
		$(".tile[data-x='#{x}'][data-y='#{y}']").append($placement)

	clearGame: ->
		$('.tile').remove()

	changeState: (state) ->
		$('#state').removeClass('alert-error').removeClass('alert-info').removeClass('alert-success')
		switch state
			when "DEFAULT"	  then $('#state').addClass('alert-info').text("Bon jeu !")
			when "PLAYER-WIN" then $('#state').addClass('alert-success').text("Vous avez battu l'IA, félicitations !")
			when "IA-WIN" 	  then $('#state').text("L'IA a gagné... retentez votre chance !")
			when "DRAW" 	  then $('#state').addClass('alert-info').text("Match nul !")