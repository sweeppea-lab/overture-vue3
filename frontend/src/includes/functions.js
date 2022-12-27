/*
	 ___
	/ __|_ __ _____ ___ _ __ _ __  ___ __ _
	\__ \ V  V / -_) -_) '_ \ '_ \/ -_) _` |
	|___/\_/\_/\___\___| .__/ .__/\___\__,_|
						|_|  |_|

	Platform  : Sweeppea Overture v1.0
    Path      : /includes/functions.js
    Language  : JavaScript
    Released  : 2022

    (c) Sweeppea, all rights reserved.
*/

'use strict';

import moment from 'moment';

/* Supress Moment Deprecation Warnings */
moment.suppressDeprecationWarnings = true;

/* Get UA Name & Version */
export function getUserAgent(val){

	let navUserAgent    = val ? val : navigator.userAgent;
	let browserName     = navigator.appName;
	let browserVersion  = ''+parseFloat(navigator.appVersion);
	let majorVersion    = parseInt(navigator.appVersion,10);
	let tempNameOffset,tempVersionOffset,tempVersion;

	if ((tempVersionOffset=navUserAgent.indexOf("Opera"))!=-1) {

		browserName = "Opera";
		browserVersion = navUserAgent.substring(tempVersionOffset+6);
		if ((tempVersionOffset=navUserAgent.indexOf("Version"))!=-1)
		browserVersion = navUserAgent.substring(tempVersionOffset+8);

	} else if ((tempVersionOffset=navUserAgent.indexOf("MSIE"))!=-1) {

		browserName = "Microsoft Internet Explorer";
		browserVersion = navUserAgent.substring(tempVersionOffset+5);

	} else if ((tempVersionOffset=navUserAgent.indexOf("Chrome"))!=-1) {

		browserName = "Chrome";
		browserVersion = navUserAgent.substring(tempVersionOffset+7);

	} else if ((tempVersionOffset=navUserAgent.indexOf("Safari"))!=-1) {

		browserName = "Safari";
		browserVersion = navUserAgent.substring(tempVersionOffset+7);

		if ((tempVersionOffset=navUserAgent.indexOf("Version"))!=-1)
		browserVersion = navUserAgent.substring(tempVersionOffset+8);

	} else if ((tempVersionOffset=navUserAgent.indexOf("Firefox"))!=-1) {

		browserName = "Firefox";
		browserVersion = navUserAgent.substring(tempVersionOffset+8);

	} else if ( (tempNameOffset=navUserAgent.lastIndexOf(' ')+1) < (tempVersionOffset=navUserAgent.lastIndexOf('/')) ) {

		browserName = navUserAgent.substring(tempNameOffset,tempVersionOffset);
		browserVersion = navUserAgent.substring(tempVersionOffset+1);

		if (browserName.toLowerCase()==browserName.toUpperCase()) {
			browserName = navigator.appName;
		}
	}

	if ((tempVersion=browserVersion.indexOf(";"))!=-1)
		browserVersion=browserVersion.substring(0,tempVersion);
	if ((tempVersion=browserVersion.indexOf(" "))!=-1)
		browserVersion=browserVersion.substring(0,tempVersion);

	return browserName;
}

/* Get Network/Connection Type */
export function getNetworkType() {

	const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
	const connType = connection.effectiveType;

	return connType;
}

/* Get Device Type */
export function  getDeviceType() {

	let check = false;
	let deviceType;

	(function(a){
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
		check = true;
	})(navigator.userAgent||navigator.vendor||window.opera);

	check === true ? deviceType = 'Mobile' : deviceType = 'Desktop';
	return deviceType;
}

/* Get Operating System */
export function  getOperatingSystem() {

	// let osName = "Unknown OS";
	// if (navigator.appVersion.indexOf("Win")!=-1) osName="Windows";
	// if (navigator.appVersion.indexOf("Mac")!=-1) osName="MacOS";
	// if (navigator.appVersion.indexOf("X11")!=-1) osName="UNIX";
	// if (navigator.appVersion.indexOf("Linux")!=-1) osName="Linux";

	// return osName;
}

/* Function to Check Memory Usage */
export function  checkMem() {

	function formatBytes(_bytes, _decimals = 2) {

		if (_bytes === 0) return '0 Bytes';

		const k     = 1024;
		const dm    = _decimals < 0 ? 0 : _decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(_bytes) / Math.log(k));

		return parseFloat((_bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	return {

		CtxMem   : formatBytes(window.performance.memory.jsHeapSizeLimit),
		HeapSize : formatBytes(window.performance.memory.totalJSHeapSize),
		UsedHeap : formatBytes(window.performance.memory.usedJSHeapSize)
	}
}

/* Function to Format Logs Importance/Level */
export function formatLogsImportance(_value){

	if (_value === 1) {

		return 'Critical';

	} else if (_value === 2) {

		return 'Warning';

	} else if (_value === 3) {

		return 'Notification';
	}
}

/* Function to Obtain a blob: URL for the image data. */
export function  obtainBlobUrlImage(_value, _type){

	const arrayBufferView = new Uint8Array( _value );
	const blob            = new Blob( [ arrayBufferView ], { _type } );
	const urlCreator      = window.URL || window.webkitURL;
	const imageUrl        = urlCreator.createObjectURL( blob );
	return imageUrl;
}

/* Function to Format Numbers based on Locales */
export function  formatNumbers(_num, _language){

	if(_language === 'en') {

		/* EN = Uses ,(comma) as thousands separator */
		return _num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	} else {

		/* ES = Uses .(period) as thousands separator */
		return _num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
};

/* Function to Format US Mobile Number (xxx)-xxx-xxxx */
export function  formatPhoneNumber(_str){

	if(_str === null || _str === undefined) return null;

	if(_str.substring(0, 2) === '+1') {
		/* Remove first 2 chars (+1) */
		_str = _str.substring(2);
	}

	/* Filter only numbers from the input */
	const cleaned = ('' + _str).replace(/\D/g, '');

	/* Check if the input is of correct length */
	const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

	if (match) {
		return '(' + match[1] + ') ' + match[2] + '-' + match[3]
	};

	return null;
};

/* This method returns the type of user */
// export function  formatUserType = (_val) => {

// 	if(_val === 1) { return 'Client'; }
// 	if(_val === 2) { return 'Sub-User'; }
// 	if(_val === 3) { return 'Admin'; }
// };

/* This method returns the type of sweepstakes */
// export function  formatSweepstakesType = (_val) => {

// 	if(_val === 1) { return 'Text-To-Win Sweepstakes'; }
// 	if(_val === 2) { return 'Web Sweepstakes'; }
// 	if(_val === 3) { return 'Social Sweepstakes'; }
// 	if(_val === 4) { return 'Voice-Enabled Sweepstakes'; }
// };

/* This method forces the user to enter ONLY numbers */
export function  onlyNumbers($event){

	const keyCode = ($event.keyCode ? $event.keyCode : $event.which);
	if ((keyCode < 48 || keyCode > 57)) {
		$event.preventDefault();
	}
};

/* This method returns a formatted time */
export function  formatTime(_time, _language, _timeFormat){

	return moment(_time, _timeFormat).locale(_language).format(_timeFormat);
};

/* This method returns a formatted date */
export function  formatDate(_date, _language, _dateFormat){

	return moment(_date).locale(_language).format(`${_dateFormat}`);
};

/* This method returns a formatted date and time */
export function  formatDateTime(_date, _language, _dateFormat, _timeFormat){

	return moment(_date).locale(_language).format(`${_dateFormat} ${_timeFormat}`);
};

/* This method returns a formatted date using FROM NOW */
export function  formatDateFromNow(_date, _lang) {

	return moment(_date).lang(_lang).fromNow();
};

/* This method returns a formatted string length */
export function  formatStringLength(_str, _len){

	if(_str.length > _len) {
		return `${_str.substring(0, _len).replace(/<[^>]*>?/g, '')} ... `;
	}

	_str = _str.replace(/<[^>]*>?/g, '');

	return _str;
};

/* This method returns formatted string of MB */
export function  bytesToSize(_bytes, _seperator = ""){
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (_bytes == 0) return 'N/A';
	const i = parseInt(Math.floor(Math.log(_bytes) / Math.log(1024)), 10);
	if (i === 0) return `${_bytes}${_seperator}${sizes[i]}`;
	return `${(_bytes / (1024 ** i)).toFixed(1)}${_seperator}${sizes[i]}`;
};

/* This method returns if given string is a valid email address */
export function  checkEmailAddress(_str) {
	if(/\S+@\S+\.\S+/.test(_str) === false){
		return false;
	} else return true;
};

/* This method ckeck time format */
export async function checkTimeManual(_time) {

	const index = _time.indexOf(':')

	if(index === -1) {

		return _time;

	} else if (_time.length === 5) {

		return _time;

	} else {

		const timeSplitted = _time.split(":");

		if(timeSplitted[0].length === 1) {
			timeSplitted[0] = `0${timeSplitted[0]}`;
		}

		if(timeSplitted[1].length === 1) `0${timeSplitted[1]}`;

		const finalTime = `${timeSplitted[0]}:${timeSplitted[1]}`;

		return finalTime;
	}
};

/* 	-------------------------------------
 *	Function to Validate URL Anatomy
 *	-------------------------------------
 *  @param  { string }  < link >
 *	@return { boolean } < true | false >
 */
export async function validateUrl(_link){

	return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(_link);
};
