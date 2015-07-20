$(window).load(function () {
console.log("in task")

/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

/* text blocks */

var welcome_block = {
	type: "text",
	text: "<p>Welcome to the experiment.</p><p> There are two parts in this experiment. In Part 1, you will answer a brief" +
"questionnaire and in Part 2 you will read a sentence and then decide whether" +
"the following graph accurately depicts the information from the sentence.</p>" +
"<h3>Please press any key to begin Part 1 of the experiment.</h3>"
};

var ex_instructions_block = {
	type: "text",
	text: "<p>Thank you for completing Part 1 of the experiment.</p>" +
	"<p>In part 2, you will read a sentence. Shortly after, a graph will appear in the center " +
	"of the screen.</p>" +
	"<h3>Please place your left index finger on the 'A' letter on your keyboard and place your " +
	"right index finger on the 'L' letter on your keyboard.</h3><p>If the graph accurately represents <strong>all</strong> " +
	"parts f the information from the sentence shown, type the letter 'A.' If it does not, press the " +
	"letter 'L.' It is important to press stye A or L key <strong>as fast as you can</strong> without making errors. Be " +
	"sure that the figure matches the name, product, and data trend mentioned in the sentence.</p>" +
	"<p>Please proceed to a example trial, where no data will be recorded.</p>" +
	"<p>Press any key to begin the example trial.</p>",
	timing_post_trial: 2000
};

// var ex_trial_block {
	
// };

// var part2_instructions_block {
// 	type: "text",
// 	text: "Thank you for completing the example trial. Press any key to begin the experiment."
// };

var trial_types = jsPsych.randomization.repeat(["good", "good", "good", "good", "catch", "catch", "wrong-data", "wrong-data"], 1);


//Note: Packs will be the example
var things = ['Pages', 'Panes', 'Pearls', 'Pears', 'Photos', 'Pills', 'Poems', 'Prices'];
var texts = ['Mel writes more pages of her book each year.', 'Every year Mia cleans fewer window panes.', 'Mya sells more pearls every year.', 'Min sells the same number of pears each year.', 'Mab takes more photos every year', 'Meg prescribes 15 kinds of pills every year.', 'Mae writes 12 poems every year.', 'May lowers the price of her product every year.']
var vignettes = _.map(texts, function (text) {
	return "<center><h1>" + text + "</h1></center>";
})

things_and_vignettes = jsPsych.randomization.repeat(_.zip(things,vignettes), 1);

var styles = ['left', 'rotated-c', 'rotated-cc', 'topleft', 'topright', 'vertical'];
var rand_styles = jsPsych.randomization.repeat(styles, 1).concat(jsPsych.randomization.repeat(styles, 1).slice(0,2));

function get_image(thing, style, trial_type) {
	return '<img src="/static/images/plots/' + trial_type + '/'+ thing + '-' + style + '.png"></img>'
}

var blocks = [];

for (var i = 0; i < 8; i++) {
	blocks.push(make_prompt_block(things_and_vignettes[i][1]));
	var image = get_image(things_and_vignettes[i][0], rand_styles[i], trial_types[i]);
	if(trial_types[i] == "good") {
		blocks.push(make_image_block(image, '65'));
	}
	else
	{
		blocks.push(make_image_block(image, '76'));
	}
}

function make_prompt_block(stim) {
	return {
		type: "single-stim",
		stimuli: stim,
		is_html:true
	};            
}

function make_image_block(stim, answer) {
	return {
		type: "categorize",
		stimuli: stim,
		choices: [65,76],
		is_html: true,
		key_answer: [answer],
		correct_text: "<p class='prompt' style='color:green; font-weight:bold;'><center>Your response is correct.</center></p>",
        // correct_text: "<p class='prompt'>Correct, this is a %ANS%.</p>",
        incorrect_text: "<p class='prompt' style='color:red; font-weight:bold;'><center>Your response is incorrect.</center></p>"
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

var experiment_blocks = [];

experiment_blocks.push(welcome_block);
experiment_blocks.push(ex_instructions_block);
// experiment_blocks.push(part2_instructions_block);
experiment_blocks = experiment_blocks.concat(blocks);
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