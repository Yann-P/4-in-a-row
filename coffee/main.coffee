$(document).ready ->

	window.game = null

	newGame = (size, alignSize) ->
		if window.game
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
			$('#state').addClass('alert-error').text("Invalid values.")
		else if size < 3
			$('#state').addClass('alert-error').text("The grid can't be so small.")
		else if size < alignSize
			$('#state').addClass('alert-error').text("Alignment can't be smaller than the grid size.")
		else if size > 40
			$('#state').addClass('alert-error').text("The grid can't be so large.")
		else newGame(size, alignSize)