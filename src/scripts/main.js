// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke');
var classes = require('bespoke-classes');
var nav = require('bespoke-nav');
var scale = require('bespoke-scale');
var bullets = require('bespoke-bullets');
var hash = require('bespoke-hash');
var prism = require('bespoke-prism');
var extern = require('bespoke-extern');
// Static Data
const DATA = [
    {
        img_url:'images/Bear_1.jpg',
        title:'Beruang',
        title_en:'Bear'
    },
    {
        img_url:'images/Cat_1.jpg',
        title:'Kucing',
        title_en:'Cat'
    },
    {
        img_url:'images/Chameleon_1.jpg',
        title:'Bunglon',
        title_en:'Chameleon'
    },
    {
        img_url:'images/Bear_2.jpg',
        title:'Beruang',
        title_en:'Bear'
    },
]
//Learn Data Progress
var LIMIT_DATA = DATA.length - 1;
//Quiz Progress
var QUIZ_PROGRESS = 1;
//Max Quiz
const MAX_QUIZ = 4;
// Bespoke.js
bespoke.from({ parent: 'article.deck', slides: 'section' }, [
	classes(),
	nav(),
	scale(),
	bullets('.build, .build-items > *:not(.build-items)'),
	hash(),
	prism(),
	extern(bespoke)
]);
//Function Helper
const generateLearnCard = (img_url,title,title_en,index) => {
	return `<div id="learn-${index}" class="image-box"><div class="title-part-learn">${title} = ${title_en}</div><img src="${img_url}" class="img-style-learn"/></div>`;
}
const generateQuizCard = (img_url,title,title_en,index) => {
	return `<div class="quiz-animate"><div class="flip-card-container"><div class="flip-image-box"><img src="${img_url}" class="img-style-quiz"/></div><div class="quiz-box"><div class="quiz-option-group"><div class="quiz-option"><a>A. Answer 1</a></div><div class="quiz-option">B. Answer 2</div></div><div class="quiz-option-group"><div class="quiz-option">C. Answer 3</div><div class="quiz-option">D. Answer 4</div></div></div></div></div>`;
}
const returnToStart = () => {
	while(LIMIT_DATA<DATA.length){
		$(`#learn-${LIMIT_DATA}`).css('left','35%');
		LIMIT_DATA++;
	}
	$('.next-btn').css('transform','scale(1)');
	$('#yes-no').css('transform','scale(0)');
	$('.start-overlay').css('transform','scale(1)');
	$('.start-btn').css('transform','scale(1)');
}
const setQuizProgress = () => {
	$('.score-display').html(`${QUIZ_PROGRESS} / ${MAX_QUIZ}`);
}
//Scripts
$(document).ready(function(){
	//Load Up Card to Learn
	let learn_container = $('#learn-container');
	DATA.forEach((element,index)=>{
		learn_container.append(generateLearnCard(element.img_url,element.title,element.title_en,index));
	});
	//Load Up Quiz Progress
	setQuizProgress();
	//Start Button
	$('.start-btn').on('click',function(){
		$('.start-overlay').css('transform','scale(0)');
		$(this).css('transform','scale(0)');
	});
	//Next Button
	$('.next-btn').on('click',function(){
		let target = $(`#learn-${LIMIT_DATA}`);
		target.css('left','-30%');
		LIMIT_DATA -= 1;
		if(LIMIT_DATA<0){
			$(this).css('transform','scale(0)');
			$('#yes-no').css('transform','scale(1)');
		}
	});
	//Yes Button
	$('.yes-btn').on('click',function(){
		$('#quiz-part').css('transform','scale(1)');
	});
	//No Button
	$('.no-btn').on('click',returnToStart);
	//Load Quiz Card
	let quiz_container = $('#quiz-part');
	DATA.forEach((element,index)=>{
		quiz_container.append(generateQuizCard(element.img_url,element.title,element.title_en));
	})
	//Flip Card
	$('.flip-card-container').on('click',function(){
		$(this).css('transform','rotateY(180deg)');
		let hintIcon = $('.direct-img'), hintImg = $('.hint-dialog'), temp= $('.contoh_aja');
		if(hintIcon.length){
			hintIcon.remove();
			hintImg.remove();
		}
	})
	//Quiz Answer
	$('.quiz-option').on('click',function(){
		let target = $(this).parent().parent().parent().parent();
		target.css('left','-30%');
		if(QUIZ_PROGRESS<MAX_QUIZ){
			QUIZ_PROGRESS++;
			setQuizProgress();
		}else{
			$('.start-overlay').css('transform','scale(1)');
			$('.result-dialog').css('transform','scale(1)');
		}
	})
	//Home Button
})