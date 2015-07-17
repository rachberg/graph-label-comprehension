$(window).load(function () {
console.log("in task")

/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

/* text blocks */

var welcome_block = {
	type: "text",
	text: "Welcome to the experiment. Press any key to begin."
};

var instructions_block = {
	type: "text",
	text: "<p>In this experiment, you will read a sentence. Shortly after, a graph will appear in the center" +
	" of the screen.</p><p>If the graph accurately represents <strong>all</strong> parts" + 
	" of the information from the sentence shown, " + 
	"type the letter Y on the keyboard. Otherwise, press the letter N on the keyboard. " + 
	"It is important to press the Y or N key <strong>as fast as you can</strong>.</p>" +
	"<p>Example:</p> <center><h3 class='center'>Mia buys fewer packs of gum each year.</h3></center>" +
	"<div class='left center-content'><img width='400' src='/static/images/plots/good/Packs-vertical.png'></img>" + 
	"<p class='small'><strong>Press the Y key</strong></p></div>" + 
	"<div class='right center-content'><img width='400' src='/static/images/plots/wrong-data/Packs-topright.png'></img>" + 
	"<p class='small'><strong>Press the N key</strong></p></div>" + "<p></p>" +
	"<center><p>Press any key to begin.</p></center>",

	timing_post_trial: 2000
};


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
		blocks.push(make_image_block(image, '89'));
	}
	else
	{
		blocks.push(make_image_block(image, '78'));
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
		choices: [89,78],
		is_html: true,
		key_answer: [answer],
		correct_text: "<p class='prompt'>Correct.</p>",
        // correct_text: "<p class='prompt'>Correct, this is a %ANS%.</p>",
        incorrect_text: "<p class='prompt'>Incorrect.</p>"
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
experiment_blocks.push(instructions_block);
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