/*
	 ___
	/ __|_ __ _____ ___ _ __ _ __  ___ __ _
	\__ \ V  V / -_) -_) '_ \ '_ \/ -_) _` |
	|___/\_/\_/\___\___| .__/ .__/\___\__,_|
						|_|  |_|

    Platform  : Sweeppea Overture v1.0
    Path      : /services/Renaissance.js
    Language  : JavaScript
    Released  : 2022-2023

    (c) Sweeppea, all rights reserved.
*/

'use strict';

import Service from "./Abstract.js";
import Store from "../store/index.js";
import PrivateKeys from "@/includes/privkeys.js";

const customOptions = {
	mode        : 'cors',
	cache       : 'no-cache',
	credentials : 'same-origin',
	headers		: {
		'Content-Type' : 'application/json',
		...Store.getters.getCredentials,
	}
};

class Renaissance extends Service {

	constructor() {

		super('https://api.sweeppea.com/api-v1', customOptions);
	}

	async request(method, url, options) {

		const uri = this.baseUrl + url;

		const opts = {...this.options, ...options };

		/**
		 *  If sessToken exists, we set it in the headers.
		 *  This avoids sending a null header to /login
		 *  and the use of an expired token.
		 **/

		if(localStorage.getItem('OvSessToken')) opts.headers.SessToken = localStorage.getItem('OvSessToken');

		if(opts.body) opts.body = JSON.stringify(opts.body);

		return fetch(uri, {
			method : method,
			...opts
		})
		.then((res) => {

			/* Clear Storage and Logout */
			if(res.status === 401) {
				sessionStorage.clear();
				localStorage.removeItem('OvSessToken');
				this.$router.push({ path: '/' });
			} return res.json();
		});
	}

	getStates() {

		return this.request('GET', `/admin/fetchUSStates/en/overture/${PrivateKeys.RENAISSANCE_ADMIN_API_KEY}`);
	}
}

export default new Renaissance();
