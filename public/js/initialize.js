$(function () {
	setTimeout(() => {
		$('.collapsible').collapsible()
		$(".button-collapse").sideNav({draggable: true})
	}, 1000)
	$(".dropdown-button").dropdown();
})


