$(document).ready ->

	window.game = null

	newGame = (size, alignSize) ->
		if window.game
			console.log "a"
			game.clear()
			$('.tile').die('click')

		window.game = new Game(size, alignSize)

		$('.tile').live('click', ->
			x = parseInt($(this).attr('data-x'))
			y = parseInt($(this).attr('data-y'))
			window.game.play(x, y)
		)

	$('a[data-action]').click (event) ->
		event.preventDefault()
		action = $(this).attr('data-action')
		switch action
			when "0" then $('#custom-game').modal()
			when "1" then newGame(3, 3)
			when "2" then newGame(10, 4)
			when "3" then newGame(20, 5)

	$('#new-game').submit (event) ->
		event.preventDefault()
		$('#custom-game').modal('hide');
		$('#state').removeClass('alert-error').removeClass('alert-info').removeClass('alert-success')

		size 	  = parseInt($("input[name='size']").val())
		alignSize = parseInt($("input[name='align-size']").val())

		if isNaN(size) or isNaN(alignSize)
			$('#state').addClass('alert-error').text("Les données entrées ne sont pas valides.")
		else if size < 3
			$('#state').addClass('alert-error').text("La grille ne peut pas être plus petite qu'une grille de morpion !")
		else if size < alignSize
			$('#state').addClass('alert-error').text("L'alignement est trop grand par rapport à la taille de la grille !")
		else if size > 40
			$('#state').addClass('alert-error').text("La grille est trop grande !")
		else newGame(size, alignSize)