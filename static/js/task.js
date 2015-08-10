$(window).load(function () {
console.log("in task")

/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

/* text blocks */

var welcome_block = {
	type: "text",
	text: "<p>Welcome to the experiment.</p><p> There are two parts in this experiment. In one part, you will answer a brief " +
"questionnaire and in the other part you will decide whether the information presented in sentences and graphs match each other.</p>" +
"<h3>Please press any key to begin Part 1 of the experiment.</h3>"
};

var BNT_instructions_block = {
	type: "text",
	text: "<p>In this part of the experiment, please type your response to the questions in the following questionnaire. Do not use a calculator but feel free use scratch paper. Please press the 'enter' key as soon as you have recorded your answer to each question.</p>"
};

var page_1_questions = ["Imagine that we flip a fair coin 1,000 times. What is your best guess about how many times the coin would come up heads in 1,000 flips? "];
var page_2_questions = ["Imagine we are throwing a five-sided die 50 times. On average, out of these 50 throws how many times would this five-sided die show an odd number (1, 3 or 5)? "];
var page_3_questions = ["In the BIG LOTTERY, the chance of winning a $10 prize is 1%. What is your best guess about how many people would win a $10 prize if 1000 people each buy a single ticket to BIG LOTTERY?"];
var page_4_questions = ["In ACME PUBLISHING SWEEPSTAKES, the chance of winning a car is 1 in 1,000. What percent of tickets to ACME PUBLISHING SWEEPSTAKES win a car? "];
var page_5_questions = ["Out of 1,000 people in a small town 500 are members of a choir. Out of these 500 members in a choir 100 are men. Out of the 500 inhabitants that are not in a choir 300 are men. What is the probability that a randomly drawn man is a member of the choir? Please indicate the probability in percent. "];
var page_6_questions = ["Imagine we are throwing a loaded die (6 sides). The probability that the die shows a 6 is twice as high as the probability of each of the other numbers. On average, out of these 70 throws how many times would the die show the number 6? "];
var page_7_questions = ["In a forest 20% of mushrooms are red, 50% brown and 30% white. A red mushroom is poisonous with a probability of 20%. A mushroom that is not red is poisonous with a probability of 5%. What is the probability that a poisonous mushroom in the forest is red?"];

var BNT_block = {
    type: 'survey-numeric',
    questions: [page_1_questions, page_2_questions, page_3_questions, page_4_questions, page_5_questions, page_6_questions, page_7_questions],
    rows: [[1]],
};


var exp_vignette_first_instructions_block = {
	type: "text",
	text: "<p>In this part of the experiment, you will read a sentence. Shortly after, a graph will appear in the center of the screen. </p>" +
	"<h3>Please place your left index finger on the 'A' letter on your keyboard and place your right index finger on the 'L' letter on your keyboard.</h3>" +
	"<p>If the graph accurately represents <strong>all</strong> parts of the information from the sentence shown, type the letter 'A.' If it does not, press the " +
	"letter 'L.' It is important to press the A or L key <strong>as fast as you can</strong> without making errors. Be sure that the figure matches the name, product, and data trend mentioned in the sentence.</p>" +
	"<p>Please proceed to an example trial, where no data will be recorded.</p> <p>Press any key to begin the example trial.</p>",
	timing_post_trial: 2000
};

var exp_image_first_instructions_block = {
	type: "text",
	text: "<p>In this part of the experiment, you will see a graph appear. Shortly after, a sentence will appear in the center of the screen. </p>" +
	"<h3>Please place your left index finger on the 'A' letter on your keyboard and place your right index finger on the 'L' letter on your keyboard.</h3>" +
	"<p>If the setence accurately describes <strong>all</strong> parts of the information represented in the graph shown, type the letter 'A.' If it does not, press the " +
	"letter 'L.' It is important to press the A or L key <strong>as fast as you can</strong> without making errors. Be sure that the sentence matches the name, labels, and content of the graph.</p>" +
	"<p>Please proceed to an example trial, where no data will be recorded.</p> <p>Press any key to begin the example trial.</p>",
	timing_post_trial: 2000
};

var exp_ex_block = {
	type: "categorize",
	stimuli: [get_image("Packs", "left", "good")],
	choices: [65,76],
	is_html: true,
	key_answer: [65],
	timing_feedback_duration: 2000,
	correct_text: "<center><p class='prompt' style='color:green'>Your response is correct.</p></center>",
        // correct_text: "<p class='prompt'>Correct, this is a %ANS%.</p>",
        incorrect_text: "<center><p class='prompt' style='color:red'>Your response is incorrect.</p></center>"
        // incorrect_text: "<p class='prompt'>Incorrect, this is a %ANS%.</p>",           
};

 var thanks_ex_block = {
 	type: "text",
 	text: "Thank you for completing the example trial. Press any key to begin the experiment."
};

 var part2_instructions_block = {
 	type: "text",
 	text: "Thank you for completing part 1 of the experiment. Please press any key to begin part 2 of the experiment."
};

var trial_types = jsPsych.randomization.repeat(["good", "good", "good", "good", "catch", "catch", "wrong-data", "wrong-data"], 1);


//Note: Packs will be the example
var things = ['Pages', 'Panels', 'Plants', 'Pants', 'Photos', 'Pills', 'Poems', 'Prices'];
var texts = ['Mia writes more pages of her book each year.', 'Every year Mia attends fewer panels.', 'Mia sells more plants every year.', 'Mia sells the same number of pants each year.', 'Mia takes more photos every year', 'Mia prescribes 15 kinds of pills every year.', 'Mia writes 12 poems every year.', 'Mia lowers the price of her product every year.']
var vignettes = _.map(texts, function (text) {
	return "<center><h1>" + text + "</h1></center>";
})

things_and_vignettes = jsPsych.randomization.repeat(_.zip(things,vignettes), 1);

var styles = ['left', 'rotated-c', 'rotated-cc', 'topleft', 'topright', 'vertical'];
var rand_styles = jsPsych.randomization.repeat(styles, 1).concat(jsPsych.randomization.repeat(styles, 1).slice(0,2));

function get_image(thing, style, trial_type) {
	return '<img src="/static/images/plots/' + trial_type + '/'+ thing + '-' + style + '.png"></img>'
}

var example_blocks = [];
var vignette = "<center><h1>Mia buys fewer packs of gum every year.</h1></center>";
var image = get_image('Packs', 'left', "good");
if (vignette_first) {
	example_blocks.push(make_stim_block(vignette));
	example_blocks.push(make_cat_block(image, 65));
} else {
	example_blocks.push(make_stim_block(image));
	example_blocks.push(make_cat_block(vignette, 65));
}

function get_exp_blocks(vignette_first) {
	var blocks = [];
	var answer_key = {"good": "65", "catch": "76", "wrong-data": "76"};

	for (var i = 0; i < 8; i++) {
		var image = get_image(things_and_vignettes[i][0], rand_styles[i], trial_types[i]);
		var stim, thing_to_cat;

		if(vignette_first) {
			stim = things_and_vignettes[i][1];
			thing_to_cat = image;
		}	else {
			stim = image;
			thing_to_cat = things_and_vignettes[i][1];
		}

		var stim_block = make_stim_block(stim);
		var cat_block = make_cat_block(thing_to_cat, answer_key[trial_types[i]]);

		blocks.push(stim_block);
		blocks.push(cat_block);
	}
	return blocks;
}

function make_stim_block(stim) {
	return {
		type: "single-stim",
		stimuli: stim,
		is_html:true
	};            
}

function make_cat_block(stim, answer) {
	return {
		type: "categorize",
		stimuli: stim,
		choices: [65,76],
		is_html: true,
		key_answer: [answer],
		timing_feedback_duration: 5000,
		correct_text: "<center><p class='prompt' style='color:green'>Your response is correct.</p></center>",
        // correct_text: "<p class='prompt'>Correct, this is a %ANS%.</p>",
        incorrect_text: "<center><p class='prompt' style='color:red'>Your response is incorrect.</p></center>"
        // incorrect_text: "<p class='prompt'>Incorrect, this is a %ANS%.</p>",
    };            
}

var debrief_block = {
	type: "text",
	text: function() {
		return "<p>The experiment is now over. Thank you for " +
		"participating!</p>"; 
	}
};


var BNT_first = false;
var vignette_first = false;

function push_BNT(experiment_blocks) {
	experiment_blocks.push(BNT_instructions_block);
	experiment_blocks.push(BNT_block);
	return experiment_blocks;
}
function push_exp(experiment_blocks) {
	if (vignette_first) {
		experiment_blocks.push(exp_vignette_first_instructions_block);
	} else {
		experiment_blocks.push(exp_image_first_instructions_block);
	}
	experiment_blocks = experiment_blocks.concat(example_blocks);
	experiment_blocks.push(thanks_ex_block);
	experiment_blocks = experiment_blocks.concat(get_exp_blocks(vignette_first));
	return experiment_blocks;
}

var experiment_blocks = [];
experiment_blocks.push(welcome_block);

if (BNT_first) {
	experiment_blocks = push_BNT(experiment_blocks);
	experiment_blocks.push(part2_instructions_block);
	experiment_blocks = push_exp(experiment_blocks, vignette_first);
}
else {
	experiment_blocks = push_exp(experiment_blocks, vignette_first);
	experiment_blocks.push(part2_instructions_block);
	experiment_blocks = push_BNT(experiment_blocks);

}

experiment_blocks.push(debrief_block);


/* start the experiment */

jsPsych.init({
	display_element: $('#jspsych-target'),
	experiment_structure: experiment_blocks,
    on_finish: function() {
        psiturk.saveData({
            success: function() { psiturk.completeHIT(); }
        });
    },
    on_data_update: function(data) {
    	psiturk.recordTrialData(data);
    }
});
});