$.ajax({
	url: "config.json",
	success: function(file) {
	settings = file;
	},
async:false
});

$.getJSON('annotations.json', function(data){

	settings["title"] = data.title;

	let config = JSON.stringify(settings); 

	$("#config").html(config);
	$("#title").html(data.title); 

	if (data.description || data.creator || data.editor || data.rights) {
		var infos = "";
		if (data.description) infos += `<i>${data.description}</i><br />`;
		if (data.creator) infos += `${data.creator} (creator), `;
		if (data.editor) infos += `${data.editor} (editor), `;
		if (data.rights) infos += `${data.rights}`;
		$("#infos").html(infos);
		$("#additionalinfo").html(infos);
	}

	converter = new showdown.Converter();
	converter.setOption('noHeaderId', 'true');
	converter.setOption('simpleLineBreaks', 'true');

	let annotations = data.first.items;
	for (annotation in annotations) { 
		annotations[annotation]["body"].splice(1,1);
		let text = JSON.stringify(annotations[annotation]["body"][0]);
		let value = JSON.parse(text)["value"];
		if (value.match(/<p>|<h[1-6]>|<li>/)) {
			var html = encodeHTMLEntities(value) ;
		} else {
			var html = converter.makeHtml(encodeHTMLEntities(value));
		}
		html = html.replace(/(?:\r\n|\r|\n)/g, ''); 
		let result = '{"type": "TextualBody","value":"' + html + '","purpose":"commenting"}';
		annotations[annotation]["body"].splice(0,1,JSON.parse(result));
	}; 


	let json = JSON.stringify(annotations);
	$("#items").html(json);
});

function encodeHTMLEntities(string) {
	return string.replace(/[\u00A0-\u9999"\&]/g, ((i) => `&#${i.charCodeAt(0)};`));
}
