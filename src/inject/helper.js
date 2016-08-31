$( document ).ready(function() {

	//Declare global varibles
	var element;
	var running;
	var rotation = 0;
	var selectOverlay = $('.select-overlay');
	var currentTab = "position";

	//Tab Switching
	$('.tabs li').click(function() {
		var tab_id = $(this).find("a").attr('data-tab');

		$('.tabs li.active').removeClass("active");
		$('.tab-content').removeClass("hide");

		$(this).addClass("active");
		$('.tab-content:not(#'+tab_id+')').addClass("hide");
		//Hide overlay if rotation tab
		switch(tab_id){
			case "rotation":
				selectOverlay.hide();
				break;
			case "position":
				selectOverlay.show();
		}
		currentTab = tab_id;
		transformWindow();
	});

	//Check for click
	$('#code a').on( 'click', function(e) {
		//Get id of element
		var id = $(this).attr("data-value");

		//Remove classes from previously selected
		$(".outline").removeClass('outline');
		$(".selected").removeClass('selected');
		selectOverlay.hide()
		//Add classes to new selected elements
		$(this).addClass('selected');
		$("#"+id).addClass('outline');



		//Save selected element and get details
		element = new elementSel($("#"+id));
		Overlay(element.el);
		switch(currentTab){
			case "rotation":
				selectOverlay.hide();

				break;
			case "position":
				selectOverlay.show();
		}

		getElementsDetails();
		//Rotation Window
		transformWindow();
		addCrosshair();
	});

	//Apply data to view
	function getElementsDetails() {
		$("#attr-left").val(element.x +"px");
		$("#attr-top").val(element.y +"px");
		$("#attr-right").val(XToRight(element.x) +"px");
		$("#attr-bottom").val(YToBottom(element.y) +"px");
	}

	//Check when Keys are down
	$(window).keydown(function(evt) {
		//Check if input fields are in focus
		if (!$("input").is(":focus")){
			if (evt.which == 37) {
				element.move("x","-");
			}
			if (evt.which == 38) {
				element.move("y","-");
			}
			if (evt.which == 39) {
				element.move("x","+");
			}
			if (evt.which == 40) {
				element.move("y","+")
			}
			//If the shift has been pressed update shift varible
			if (evt.which == 16) {
				element.jump = 10;
			}
			//Update UI and Object
			updateView();
		}
	}).keyup(function(evt) {
		//When the shift has been released update the varible
		if (evt.which == 16) {
			element.jump = 1;
		}
	});

	//Listen for button Clicks
	$("button").click(function() {
		switch($(this).attr('id')) {
			//Directional buttons
			case "up":
				element.move("y","-");
				break;
			case "down":
				element.move("y","+")
				break;
			case "left":
				element.move("x","-");
				break;
			case "right":
				element.move("x","+");
				break;
		}
		//Update UI and Object
		updateView();
	});

	//Check for clicks on elements
	$("#keyline").on("click", function(e){

		console.log("running");
		//Find where the user has clicked
		var clickX = e.pageX,
				clickY = e.pageY,
				list,
				$list,
				offset,
				range;
		//Create a map of objects that fall within the mouse X and Y
		$list = $('#keyline *').filter(function() {
				offset = $(this).offset();
				//Work out the area that the object is using offset to positon and width
				range = {
						x: [ offset.left,
								offset.left + $(this).outerWidth() ],
						y: [ offset.top,
								offset.top + $(this).outerHeight() ]
				};
				//If mouse position falls in the object range return it and add it to the map.
				return (clickX >= range.x[0] && clickX <= range.x[1]) && (clickY >= range.y[0] && clickY <= range.y[1])
		});
		//Clear all selected
		$(".outline").removeClass('outline');
		$(".selected").removeClass('selected');

		//Loop through all elements that were clicked and outline and highlight them
		list = $list.map(function() {
			$("#"+this.id).addClass('outline');
			$("[data-value='"+this.id+"']").addClass("selected");
		})
	});

	//Check if inputs have been changed
	$(".number").change(function(){
		//Check what attribute was changed
		switch($(this).attr('id')){
			case "attr-top":
				element.y = parseInt($(this).val().replace("px",""));
				break;
			case "attr-bottom":
				element.y = YToBottom($(this).val().replace("px",""));
				break;
			case "attr-right":
				element.x = XToRight($(this).val().replace("px",""));
				break;
			case "attr-left":
				element.x = parseInt($(this).val().replace("px",""));
				break;
		}
		//Update UI and Object
		updateView();
	});

	function generateCSS() {
		if (element.el){
			var string = "#"+element.el.attr("id")+ " {\n";
			string += "\t top: "+element.el.css('top')+";\n";
			string += "\t right: "+element.el.css('right')+";\n";
			string += "\t bottom: "+element.el.css('bottom')+";\n";
			string += "\t left: "+element.el.css('left')+";\n";
			string += "}";
			console.log(string)
		}
	}

	//Update View
	function updateView(){
		//Define element position and parent height and width
		var Xalign = "left", Yalign = "top";
		var x = element.x, y = element.y;
		//Apply to element
		element.el.css(Xalign, x + "px");
		element.el.css(Yalign, y + "px");
		getElementsDetails();
		Overlay(element.el);
	}

	//Define element Constuction
	function elementSel(el){
		this.el = el;
		this.jump = 1;
		//Set the x and y of the element using left and top
		this.y = parseInt(el.css("top").replace('px',""));
		this.x = parseInt(el.css("left").replace('px',""));
		//Get Transform origins
		var transXY = el.css("transform-origin").split("px");
		this.transOrigin = {
			x: transXY[0],
			y: transXY[1].trim()
		};
		//Store Width and Height
		this.width = el.width();
		this.height = el.height();
	}
	//Define constructor for element
	elementSel.prototype = {
		constructor: elementSel,
		//Move Function
		move:function (axis, direction) {
			this[axis] += parseInt(direction+this.jump);
		}
	}
	//Helpers
	//Toggles Top and Bottom CSS attributes
	function YToBottom(val) {
		return parseInt(element.el.parent().css('height').replace("px","")) -
			parseInt(element.el.css('height').replace("px","")) - val;
	}
	//Toggles Right and Left CSS attributes
	function XToRight(val) {
		return parseInt(element.el.parent().css('width').replace("px","")) -
					parseInt(element.el.css('width').replace("px","")) - val;
	}

	//Transform Origin
	function transformWindow(){
		var rotateObject = element.el.clone().removeAttr("class");
		rotateObject = rotateObject.removeAttr("id");
		rotateObject = rotateObject.removeAttr("style");
		//Set the Workspace size to center object only if the user is using rotation mode
		if(currentTab === "rotation") {
			$('#rotation').css("height",+element.height+"px");
			$('#rotation').css("width",+element.width+"px");
		}
		//Empty rotation box
		$("#rotation").empty();
		//Add selected element
		$("#rotation").append(rotateObject);

		rotateObject.addClass("transformClass");
		rotateObject.css("transform-origin",element.transOrigin.x+"px "+element.transOrigin.y+"px")
		//Create visual transform point
		$("#rotation").append($("<div id='point' style='left: "+element.transOrigin.x+"px; top: "+element.transOrigin.y+"px;'></div>"));
	}

	//Selection overlay
	function Overlay(selection){
		var rect = selection.offset();
		selectOverlay.height(selection.height());
		selectOverlay.width(selection.width());
		selectOverlay.css("top", 1+ parseFloat(rect.top) +"px");
		selectOverlay.css("left", 1+ parseFloat(rect.left) +"px");
	}

	//Rotation Listeners
	$("#start").click(function(){
		$("#rotation").children().css('transition', "all 1s");
		running = true;
		rotate();
		function rotate(){
			rotation += 5;
			$("#rotation").children().rotate(rotation);
			setTimeout(function(){
				if(running){
					rotate();
				}
			}, 100);
		}
	})
	$("#stop").click(function(){
		rotation = 0;
		running = false;
		$("#rotation").children().css('transition', "none");
		$("#rotation").children().rotate(rotation);
	})


	$("#rotation").on('mousemove', function(e){
		console.log("HELLO");
		var hoverX = e.pageX,
				hoverY = e.pageY,
				offset;

		offset = $(this).offset();

		$("#crosshair").children(0).css("top", hoverY - offset.top);
		$("#crosshair").children(1).css("left", hoverX - offset.left);

	})




		//Check for clicks on rotation element
	$("#rotation").on("click", function(e){
		//Find where the user has clicked
		var clickX = e.pageX,
				clickY = e.pageY,
				offset;

		offset = $(this).offset();

		element.transOrigin.x =	clickX - offset.left;
		element.transOrigin.y = clickY - offset.top;

		$('.transformClass').css("transform-origin",element.transOrigin.x+"px "+element.transOrigin.y+"px")
		$('#point').css("left",element.transOrigin.x);
		$('#point').css("top",element.transOrigin.y);

		//Add rotation input fields

	});

	//Additional JQuery function
	jQuery.fn.rotate = function(degrees) {
		$(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
								 '-moz-transform' : 'rotate('+ degrees +'deg)',
								 '-ms-transform' : 'rotate('+ degrees +'deg)',
								 'transform' : 'rotate('+ degrees +'deg)'});
		return $(this);
};

	function addCrosshair(){
		console.log("ping");
		$('#rotation').append("<div id='crosshair'><div></div><div></div></div>");
	}

	function removeCrosshair() {
		$("#crosshair").remove();
	}

});
	//Probably don't need this
	function resizeEl(el, width, height) {
		el.width(width);
		el.height(height);
	}
