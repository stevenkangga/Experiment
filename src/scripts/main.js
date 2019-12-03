// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke');
var classes = require('bespoke-classes');
var nav = require('bespoke-nav');
var scale = require('bespoke-scale');
var bullets = require('bespoke-bullets');
var hash = require('bespoke-hash');
var prism = require('bespoke-prism');
var extern = require('bespoke-extern');
var cube = require('bespoke-theme-cube');
//Other
var current_quiz_card = null;
var quiz_score = 0;
//App Condition
const LEARNING = 'learning';
const QUIZ = 'quiz';
var APP_CONDITION = LEARNING;
//Data type
const HEWAN = "HEWAN";
//Static Data
const DATA = {
	"HEWAN":[
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
}
//Learn Data Progress
var LIMIT_DATA = DATA[HEWAN].length - 1;
//Quiz Progress
var QUIZ_PROGRESS = 1;
//Max Quiz
const MAX_QUIZ = DATA[HEWAN].length;
// Bespoke.js
bespoke.from({ parent: 'article.deck', slides: 'section' }, [
	cube(),
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
const insertCharInString = (indexTarget,answer) => {
	return answer.slice(0,indexTarget) + answer[indexTarget] + answer.slice(indexTarget,answer.length);
}
//Shuffle Array
const shuffleArray = (arr) => {
	let dataToReturn = [], choosen = [];
	do{
		let tempRandom = (Math.random() * 100).toFixed() % 4;
		if(choosen.indexOf(tempRandom)===-1){
			choosen.push(tempRandom);
			dataToReturn.push(arr[tempRandom]);
		}
	}while(dataToReturn.length!==4);
	return dataToReturn;
}
const generateOptions = (answer,mainIndex) => {
	let currentSize = answer.length, dataToReturn = '', LOOP_LIMIT = 3, choosen = [], option_fix = [], option_shuffle = [];
	do{
		if(LOOP_LIMIT===3){
			option_fix.push(answer);
		}else{
			let tempRandom = 0;
			do{
				tempRandom = (Math.random() * 100).toFixed() % currentSize;
				if(choosen.indexOf(tempRandom)===-1){
					choosen.push(tempRandom);
					break;
				}
			}while(true);
			option_fix.push(insertCharInString(tempRandom,answer));
		}
	}while(LOOP_LIMIT--);
	option_shuffle = shuffleArray(option_fix);
	option_shuffle.forEach((element,index)=>{
		dataToReturn += `<div class="quiz-option"><a resource="${mainIndex}">${element}</a></div>`;
	});
	return dataToReturn;
}
const generateQuizCard = (img_url,title,title_en,index) => {
	return `<div class="quiz-animate">
		<div class="flip-card-container">
			<div class="flip-image-box">
				<img src="${img_url}" class="img-style-quiz"/>
			</div>
			<div class="quiz-box">
				${generateOptions(title_en,index)}
			</div>
		</div>
	</div>`;
}
const returnToStart = () => {
	let i = 0;
	while(i<DATA[HEWAN].length){
		$(`#learn-${i}`).css('left','35%');
		if(LIMIT_DATA<DATA[HEWAN].length-1){
			LIMIT_DATA++;
		}
		i++;
	}
	$('.next-btn').css('transform','scale(1)');
	$('#yes-no').css('transform','scale(0)');
	$('.start-overlay').css('transform','scale(1)');
	$('.start-btn').css('transform','scale(1)');
}
const setQuizProgress = () => {
	$('.score-display').html(`${QUIZ_PROGRESS} / ${MAX_QUIZ}`);
}
const loadUpQuiz = () => {
	let quiz_container = $('#quiz-part');
	DATA[HEWAN].forEach((element,index)=>{
		quiz_container.append(generateQuizCard(element.img_url,element.title,element.title_en,index));
	});
	//Flip Card
	$('.flip-card-container').on('click',function(){
		$(this).css('transform','rotateY(180deg)');
		current_quiz_card = $(this).parent();
		let hintIcon = $('.direct-img'), hintImg = $('.hint-dialog');
		if(hintIcon.length){
			hintIcon.css('transform','scale(0)');
			hintImg.css('transform','scale(0)');
		}
	})
	//Quiz Answer
	$('.quiz-option a').on('click',function(){
		let parent = $(current_quiz_card);
		if(!parent.hasClass('option-selected')){
			$('.next-btn').css('transform','scale(1)');
			let target = $(this), selectedData = target.text(), targetIndex = target.attr('resource'), mainResource = DATA[HEWAN][targetIndex];
			if(selectedData===mainResource.title_en){
				target.addClass('correct');
				quiz_score++;
				$('.true-icon').css('transform','scale(1)');
			}else{
				target.addClass('wrong');
				$('.false-icon').css('transform','scale(1)');
			}
			parent.addClass('option-selected')
		}
	})
}
//Scripts
$(document).ready(function(){
	//Load Up Card to Learn
	let learn_container = $('#learn-container');
	DATA[HEWAN].forEach((element,index)=>{
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
		if(APP_CONDITION===LEARNING){
			let target = $(`#learn-${LIMIT_DATA}`);
			target.css('left','-30%');
			LIMIT_DATA -= 1;
			if(LIMIT_DATA<0){
				$(this).css('transform','scale(0)');
				$('#yes-no').css('transform','scale(1)');
			}
		}else if(APP_CONDITION===QUIZ){
			$(current_quiz_card).css('left','-30%');
			$(this).css('transform','scale(0)');
			$('.true-icon').css('transform','scale(0)');
			$('.false-icon').css('transform','scale(0)');
			if(QUIZ_PROGRESS<MAX_QUIZ){
				QUIZ_PROGRESS++;
				setQuizProgress();
			}else{
				$('.start-overlay').css('transform','scale(1)');
				$('.result-dialog').css('transform','scale(1)');
				$('#quiz-result').text(`Score kamu adalah ${quiz_score} / ${MAX_QUIZ}.`);
			}
		}
	});
	//Yes Button
	$('.yes-btn').on('click',function(){
		$('#quiz-part').css('transform','scale(1)');
		APP_CONDITION = QUIZ;
	});
	//No Button
	$('.no-btn').on('click',returnToStart);
	//Load Quiz Card
	loadUpQuiz();
	//Home Button
	$('.home-btn').on('click',function(){
		APP_CONDITION = LEARNING;
		quiz_score = 0;
		current_quiz_card = null;
		QUIZ_PROGRESS = 1;
		returnToStart();
		$('.result-dialog').css('transform','scale(0)');
		$('.quiz-animate').remove();
		$('.direct-img').css('transform','scale(1)');
		$('.direct-img').css('transform','rotate(45deg)');
		$('.hint-dialog').css('transform','scale(1)');
		loadUpQuiz();
		setQuizProgress();
		$('#quiz-part').css('transform','scale(0)');
	});
})