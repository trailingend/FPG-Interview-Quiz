(function($, window) {
	var $scenes = $(".scene");
	var $frontScene = $("#front-scene");
	var $qCtnr = $(".q-ctnr");
	var $iCtnr = $(".indicator-ctnr");
	var $pCtnr = $(".prompt-ctnr");
	var $qBody = $(".q-body");
	var selectedChoice = 1; //start from 1
	var correctChoice = 0; //start from 1
	var currentQ = 0; //start from 1
	var ifRestart = false;
	
	var $nextSec = $(".next-sec");
	var $nextPrompt = $(".next-prompt");
	
	var $qBodyTlt;
	var $nextPromptTlt;
	var $qChoice1Tlt;
	var $qChoice2Tlt;
	var $qChoice3Tlt;

	var socket = io();

	$(window).load(function() {
		$scenes.height($(window).height());

		$qCtnr.css('display', 'block');
		socket.emit('initData', {});
		socket.on('QsAndCs', function(data) {
			$qCtnr.data(data);
			reloadQuestion();
			$iCtnr.data({
				numOfCorrect: 0
			});
		});
	});

	$(window).resize(function() {
		$scenes.height($(window).height());
	});

	//event listeners
	$(".next-restart").on('click', function() {
		hideEnding();
		currentQ = 0;
		ifRestart = true;
		reloadQuestion();
	});



	function swapQAndC () {
		$qCtnr.empty();
		$qCtnr.append(
			'<p class="q-body">'+ $qCtnr.data().QsAndCs[currentQ - 1].Q +'<p>'
			+ '<ul class="q-choice-ctnr">'
			+ '<li class="q-choice">A. '+ $qCtnr.data().QsAndCs[currentQ - 1].C1 +'</li>'
			+ '<li class="q-choice">B. '+ $qCtnr.data().QsAndCs[currentQ - 1].C2 +'</li>'
			+ '<li class="q-choice">C. '+ $qCtnr.data().QsAndCs[currentQ - 1].C3 +'</li>'
			+ '</ul>'
		);
		correctChoice = $qCtnr.data().QsAndCs[currentQ - 1].A;
		$(".q-choice").on('click', function() {
			selectedChoice = $('.q-choice').index(this) + 1;
			choiceSelected();
		});
	}

	function reloadQuestion() {
		$('.q-choice').css({color: 'black'});
		if (currentQ < 3) {
			currentQ++;
		TweenLite.to($(".illustration-ctnr"), 3, { background: colorSwitcher(currentQ) })
		$("#illustration").css({opacity: 0});
		$("#illustration").attr('src', "img/0"+  currentQ+".svg");
		TweenLite.to($("#illustration"), 3, { opacity: 1, delay:1 });
			$.when(swapQAndC()).then(qInitiateLoadInAnimation());
		} else {
			loadEnding();
		}
	}

	function loadEnding() {
		$(".indicator:nth-child(1)").removeClass("crossoff-k");
		$(".indicator:nth-child(1)").removeClass("crossoff-cyan");
		$(".indicator:nth-child(2)").removeClass("crossoff-k");
		$(".indicator:nth-child(2)").removeClass("crossoff-magenta");
		$(".indicator:nth-child(3)").removeClass("crossoff-k");
		$(".indicator:nth-child(3)").removeClass("crossoff-yellow");
		$(".indicator-ctnr").fadeOut();
		TweenLite.set($nextSec, {x:"-100%", y:"0%"});
		TweenLite.to($nextSec, 1, {x:"0%", y: "0%", ease: Expo.easeIn, delay: 1})
		socket.emit('sendResult', { numOfCorrect: $iCtnr.data().numOfCorrect});
		socket.on('promptUpdate', function(data) {
			var adj = data.toDescribe;
			$pCtnr.empty();
			$pCtnr.append('<p class="next-prompt">You have got '+ adj +' knowledge about your breakfast</p>'
							+ '<div class="next-restart strikethrough">Start Again</div>');
			$(".next-restart").on('click', function() {
				hideEnding();
				currentQ = 0;
				ifRestart = true;
				reloadQuestion();
			});
			promptInitiateLoadInAnimation();
		});
		
	}

	function hideEnding() {
		TweenLite.set($nextSec, {x:"0%", y:"0%"});
		TweenLite.to($nextSec, 1, {x:"-100%", y: "0%", ease: Expo.easeIn, delay: 0});
		$(".indicator-ctnr").fadeIn();
	}

	function promptInitiateLoadInAnimation() {

		$nextPromptTlt = $(".next-prompt").textillate({
			loop: false,
			initialDelay: 1000,
			in: {
    			effect: 'fadeInUp',
    			sync: false,
    			reverse: false,
    			callback: function () {},
    		},
    		out: {
				effect: 'fadeOutDown',
				sync: true,
				reverse: false,
				callback: function () {},
			},
    		type: 'word',
    	});
	}

	function promptLoadInAnimation() {
    	$nextPromptTlt.textillate("in");
	}


	function qInitiateLoadInAnimation() {
		$qBodyTlt = $(".q-body").textillate({
			loop: false,
			initialDelay: 100,
			in: {
    			effect: 'fadeInLeft',
    			sync: false,
    			reverse: false,
    			callback: function () {},
    		},
    		out: {
				effect: 'fadeOutLeft',
				sync: true,
				reverse: false,
				callback: function () {},
			},
    		type: 'word',
    	});
		$qChoice1Tlt = $(".q-choice:nth-child(1)").textillate({
			loop: false,
			initialDelay: 600,
			in: {
				effect: 'fadeInUp',
				sync: true,
				reverse: false,
				callback: function () {},
			},
			out: {
				effect: 'fadeOutDown',
				sync: true,
				reverse: false,
				callback: function () {},
			},
			type: 'word',
		});
		$qChoice2Tlt = $(".q-choice:nth-child(2)").textillate({
			loop: false,
			initialDelay: 800,
			in: {
				effect: 'fadeInUp',
				sync: true,
				reverse: false,
				callback: function () {},
			},
			out: {
				effect: 'fadeOutDown',
				sync: true,
				reverse: false,
				callback: function () {},
			},
			type: 'word',
		});
		$qChoice3Tlt = $(".q-choice:nth-child(3)").textillate({
			loop: false,
			initialDelay: 1000,
			in: {
				effect: 'fadeInUp',
				sync: true,
				reverse: false,
				callback: function () {},
			},
			out: {
				effect: 'fadeOutDown',
				sync: true,
				reverse: false,
				callback: function () {},
			},
			type: 'word',
		});
	}

	function qLoadInAnimation() {
    	$qBodyTlt.textillate("in");
    	$qChoice1Tlt.textillate("in");
    	$qChoice2Tlt.textillate("in");
    	$qChoice3Tlt.textillate("in");
	}

	function qLeaveAnimation() {
		$qBodyTlt.textillate("out");
		$qChoice1Tlt.textillate("out");
    	$qChoice2Tlt.textillate("out");
    	$qChoice3Tlt.textillate("out");
	}

	function choiceSelected() {
		for (var i = 3; i >= 1; i--) {
			if ( i == selectedChoice && i == correctChoice) {
				$(".q-choice:nth-child("+ i +")").css({'color': colorSwitcher(currentQ)});
				$(".indicator:nth-child("+ currentQ +")").addClass("crossoff-"+ colorSwitcher(currentQ) +"");
				var current = i;
				//update result
				$iCtnr.data().numOfCorrect++;
				setTimeout(function() {
					removeUseless(current);
				}, 2000);
			} else if ( i != selectedChoice && i == correctChoice ) {
				$(".q-choice:nth-child("+ i +")").css({'color': colorSwitcher(currentQ)});
				$(".indicator:nth-child("+ currentQ +")").addClass("crossoff-k");
				var thcurrent = i;
				setTimeout(function() {
					removeUseless(thcurrent);
				}, 2000);
			} else if (i == selectedChoice && i != correctChoice) {
				$(".q-choice:nth-child("+ i +")").css({'color':"#cccccc"});
				$(".indicator:nth-child("+ currentQ +")").addClass("crossoff-k");
				var elcurrent = i; 
				setTimeout(function() {
					removeUseless(elcurrent);
				}, 1000);
			} else {
				removeUseless(i);
			}
    	}

    	setTimeout(function() { $qBodyTlt.textillate("out"); }, 3000);
    	setTimeout(function() { reloadQuestion(); }, 4000);
	}

	function colorSwitcher(i) {
		if (i == 1) { return "cyan"; }
		else if (i == 2) { return "magenta"; }
		else { return "yellow"; }
	}

	function removeUseless(i) {
		if (i == 1) { $qChoice1Tlt.textillate("out"); }
		else if (i == 2) { $qChoice2Tlt.textillate("out"); }
		else { $qChoice3Tlt.textillate("out"); }
	}

}(jQuery, window));
