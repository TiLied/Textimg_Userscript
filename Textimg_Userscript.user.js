// ==UserScript==
// @name        Textimg Userscript
// @namespace   https://greasyfork.org/users/102866
// @description Get text from any image
// @include     *
// @require     https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js
// @author      TiLied
// @version     0.1.0
// @grant       none
// @run-at		document-idle
// ==/UserScript==

var canvas = document.createElement('canvas'),
	context = canvas.getContext("2d"),
	lastLanguage = GetLang("English");

Main();

//Start
//Function main
function Main()
{
	//Set events on imagas
	SetEvents();
}
//Function main
//End

//Start
//Function set up events on images alt + mouse
function SetEvents()
{
	var imageContainers = document.querySelectorAll("img"),
		evnYes = false;

	var clickEvent = function (e) { e.button === 0 && e.stopPropagation(); }

	var mouseStartClientX,
		mouseStartClientY,
		myData,
		imgPos,
		sad;

	document.addEventListener("keydown", function (event)
	{
		if (event.altKey && !evnYes && (sad != undefined))
		{
			sad.addEventListener("click", clickEvent, true);
			evnYes = true;
			event.preventDefault();
		}
	});

	document.addEventListener("keyup", function (event)
	{
		if (!event.altKey && evnYes && (sad != undefined))
		{
			sad.removeEventListener("click", clickEvent, true);
			evnYes = false;
			event.preventDefault();
		}
	});

	for (var i = 0; i < imageContainers.length; i++)
	{
		imageContainers[i].addEventListener("mousedown", function (event)
		{
			if (event.altKey)
			{
				sad = this;
				imgPos = FindPosition(this);
				mouseStartClientX = event.pageX - imgPos[0];
				mouseStartClientY = event.pageY - imgPos[1];
				console.log(mouseStartClientX + " " + mouseStartClientY);
				event.preventDefault();
			}
		});

		imageContainers[i].addEventListener("mousemove", function (event)
		{
			if (event.altKey)
			{
				event.preventDefault();
			}
		});

		imageContainers[i].addEventListener("mouseup", function (event)
		{
			if (event.altKey)
			{
				try{
					var mouseEndClientX, mouseEndClientY;
					var img = this;
					imgPos = FindPosition(this);
					mouseEndClientX = event.pageX - imgPos[0];
					mouseEndClientY = event.pageY - imgPos[1];
					console.log(mouseEndClientX + " " + mouseEndClientY);
					PlaceDiv((mouseStartClientX + imgPos[0] + mouseStartClientY), (mouseEndClientY + imgPos[1] + 10), mouseEndClientX);
					canvas.width = img.width;
					canvas.height = img.height;
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(img, 0, 0);
					myData = context.getImageData(mouseStartClientX, mouseStartClientY, mouseEndClientX, mouseEndClientY);
					console.log(myData);
					RecognizeText(myData);
				} catch (e) { console.log(e); }
			}
		});
	}
}
//Function set up events on images alt + mouse
//End

//Start
//Functions recognizing text on image
try
{
	function RecognizeText(myData)
	{
		Tesseract.detect(myData)
			.progress(message => console.log(message))
			.catch(err =>
			{
				console.error(err);
				return RecognizeTextError(myData);
			})
			.then(result =>
			{
				console.log(result);
				return RecognizeTextSuccess(myData, result);
			})
	}

	function RecognizeTextError(myData)
	{
		Tesseract.recognize(myData, {
			lang: lastLanguage
		})
			.progress(message => console.log(message))
			.catch(err => console.error(err))
			.then(result =>
			{
				console.log(result);
				document.getElementById('tu_textimg').innerHTML = result["text"];
			})
	}

	function RecognizeTextSuccess(myData, res)
	{
		lastLanguage = GetLang(res["script"]);
		Tesseract.recognize(myData, {
			lang: GetLang(res["script"])
		})
			.progress(message => console.log(message))
			.catch(err => console.error(err))
			.then(result =>
			{
				console.log(result);
				document.getElementById('tu_textimg').innerHTML = result["text"];
			})
	}
}
catch (e) { console.log(e); }
//Functions recognizing text on image
//End

//Start
//Function return position on image
function FindPosition(oElement)
{
	if (typeof (oElement.offsetParent) != "undefined")
	{
		for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
		{
			posX += oElement.offsetLeft;
			posY += oElement.offsetTop;
		}
		return [posX, posY];
	}
	else
	{
		return [oElement.x, oElement.y];
	}
}
//Function return position on image
//End

//Start
//Function place div where will be our text
function PlaceDiv(x_pos, y_pos, width)
{
	var eventClick = function (event)
	{
		if (event.target != document.getElementById("tu_textimg"))
		{
			DeleteDiv(eventClick);
		}
	}

	var d = document.createElement('div');
	d.id = "tu_textimg";
	d.style.position = "absolute";
	d.style.left = x_pos + 'px';
	d.style.top = y_pos + 'px';
	d.style.background = '#ddd';
	d.style.fontSize = '20px';
	d.style.maxWidth = width + 'px';
	document.body.appendChild(d);
	document.addEventListener("click", eventClick);
}
//Function place div where will be our text
//End

//Start
//Function delete div where our text
function DeleteDiv(ev)
{
	document.getElementById("tu_textimg").remove();
	document.removeEventListener("click", ev);
}
//Function delete div where our text
//End

//Start
//Function return shorter version of language for tesseract.js
function GetLang(language)
{
	var lang = "";
	switch (language)
	{
		case "Afrikaans":
			lang = "afr";
			break;
		case "Arabic":
			lang = "ara";
			break;
		case "Azerbaijani":
			lang = "aze";
			break;
		case "Belarusian":
			lang = "bel";
			break;
		case "Bengali":
			lang = "ben";
			break;
		case "Bulgarian":
			lang = "bul";
			break;
		case "Catalan":
			lang = "cat";
			break;
		case "Czech":
			lang = "ces";
			break;
		case "Chinese":
			lang = "chi_sim";
			break;
		case "Traditional Chinese":
			lang = "chi_tra";
			break;
		case "Cherokee":
			lang = "chr";
			break;
		case "Danish":
			lang = "dan";
			break;
		case "German":
			lang = "deu";
			break;
		case "Greek":
			lang = "ell";
			break;
		case "English":
			lang = "eng";
			break;
		case "English (Old)":
			lang = "enm";
			break;
		case "Esperanto":
			lang = "epo";
			break;
		case "Esperanto alternative":
			lang = "epo_alt";
			break;
		case "Math":
			lang = "equ";
			break;
		case "Estonian":
			lang = "est";
			break;
		case "Basque":
			lang = "eus";
			break;
		case "Finnish":
			lang = "fin";
			break;
		case "French":
			lang = "fra";
			break;
		case "Frankish":
			lang = "frk";
			break;
		case "French (Old)":
			lang = "frm";
			break;
		case "Galician":
			lang = "glg";
			break;
		case "Ancient Greek":
			lang = "grc";
			break;
		case "Hebrew":
			lang = "heb";
			break;
		case "Hindi":
			lang = "hin";
			break;
		case "Croatian":
			lang = "hrv";
			break;
		case "Hungarian":
			lang = "hun";
			break;
		case "Indonesian":
			lang = "ind";
			break;
		case "Icelandic":
			lang = "isl";
			break;
		case "Italian":
			lang = "ita";
			break;
		case "Italian (Old)":
			lang = "ita_old";
			break;
		case "Japanese":
			lang = "jpn";
			break;
		case "Kannada":
			lang = "kan";
			break;
		case "Korean":
			lang = "kor";
			break;
		case "Latvian":
			lang = "lav";
			break;
		case "Lithuanian":
			lang = "lit";
			break;
		case "Malayalam":
			lang = "mal";
			break;
		case "Macedonian":
			lang = "mkd";
			break;
		case "Maltese":
			lang = "mlt";
			break;
		case "Malay":
			lang = "msa";
			break;
		case "Dutch":
			lang = "nld";
			break;
		case "Norwegian":
			lang = "nor";
			break;
		case "Polish":
			lang = "pol";
			break;
		case "Portuguese":
			lang = "por";
			break;
		case "Romanian":
			lang = "ron";
			break;
		case "Russian":
			lang = "rus";
			break;
		case "Slovakian":
			lang = "slk";
			break;
		case "Slovenian":
			lang = "slv";
			break;
		case "Spanish":
			lang = "spa";
			break;
		case "Old Spanish":
			lang = "spa_old";
			break;
		case "Albanian":
			lang = "sqi";
			break;
		case "Serbian (Latin)":
			lang = "srp";
			break;
		case "Swahili":
			lang = "swa";
			break;
		case "Swedish":
			lang = "swe";
			break;
		case "Tamil":
			lang = "tam";
			break;
		case "Telugu":
			lang = "tel";
			break;
		case "Tagalog":
			lang = "tgl";
			break;
		case "Thai":
			lang = "tha";
			break;
		case "Turkish":
			lang = "tur";
			break;
		case "Ukrainian":
			lang = "ukr";
			break;
		case "Vietnamese":
			lang = "vie";
			break;
	}
	return lang;
}
//Function return shorter version of language for tesseract.js
//End