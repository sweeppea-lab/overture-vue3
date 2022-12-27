/*
	 ___
	/ __|_ __ _____ ___ _ __ _ __  ___ __ _
	\__ \ V  V / -_) -_) '_ \ '_ \/ -_) _` |
	|___/\_/\_/\___\___| .__/ .__/\___\__,_|
						|_|  |_|

    Platform  : Sweeppea Overture v1.0
    Path      : /services/Abstract.js
    Language  : JavaScript
    Released  : 2022-2023

    (c) Sweeppea, all rights reserved.
*/

// const defaultHeaders = {
// 	'Content-Type' : 'application/json',
// 	'SessToken'    : `${localStorage.getItem('OvSessToken')}`,
// 	'IpAddress'    : `${this.$store.state.IpAddress}`,
// 	'Language'     : `${this.$store.state.Language}`,
// }

'use strict';

const defaultOptions = {
	mode        : 'cors',
	cache       : 'no-cache',
	credentials : 'same-origin',
	headers		: {
		'Content-Type' : 'application/json',
	}
};

class Service {

	constructor(baseUrl, options = defaultOptions) {
		this.baseUrl = baseUrl;
		this.options = {...defaultOptions, ...options};
	}

	request(options) {

		const uri  = this._baseUrl + options.uri;
		const opts = {...this.options, ...options};

		return fetch(uri, {
			method : 'GET',
			body   : JSON.stringify(options.body),
			...opts
		});
	}
};

export default Service;
