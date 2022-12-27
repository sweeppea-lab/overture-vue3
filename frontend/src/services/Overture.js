/*
	 ___
	/ __|_ __ _____ ___ _ __ _ __  ___ __ _
	\__ \ V  V / -_) -_) '_ \ '_ \/ -_) _` |
	|___/\_/\_/\___\___| .__/ .__/\___\__,_|
						|_|  |_|

    Platform  : Sweeppea Overture v1.0
    Path      : /services/Overture.js
    Language  : JavaScript
    Released  : 2022-2023

    (c) Sweeppea, all rights reserved.
*/

'use strict';

import Service from "./Abstract.js";
import Store from "../store/index.js";

const customOptions = {
	mode        : 'cors',
	cache       : 'no-cache',
	credentials : 'same-origin',
	headers		: {
		'Content-Type' : 'application/json',
		...Store.getters.getCredentials,
	}
};

class Overture extends Service {

	constructor() {
		super(import.meta.env.VITE_APP_API_URL, customOptions);
	};

	async request(method, url, options) {

		const uri = this.baseUrl + url;
    console.log(import.meta.env);
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
	};

	/** ----------------------------- Blocks CRUD ----------------------------- */

	/** --------------- CREATE ----------- */

	createBlock(_payload) {

		return this.request('POST', '/blockslib/createBlock', { body : _payload });
	};

	/** --------------- READ ----------- */

	fetchAllBlocks() {

		return this.request('GET', '/blockslib/fetchAllBlocks');
	};

	fetchSingleBlock(_blockToken) {

		return this.request('GET', '/blockslib/fetchSingleBlock', {
			headers: { 'BlockToken' : `${_blockToken}` }
		});
	};

	/** --------------- UPDATE ----------- */

	publishBlock(_payload) {

		return this.request('PUT', '/blockslib/publishBlock', { body : _payload });
	};

	unpublishBlock(_payload) {

		return this.request('PUT', '/blockslib/unpublishBlock', { body : _payload });
	};

	updateBlock(_payload) {

		return this.request('PUT', '/blockslib/updateBlock', { body : _payload });
	};

	/** --------------- DELETE ----------- */

	deleteBlock(_payload) {

		return this.request('DELETE', '/blockslib/deleteBlock', { body : _payload });
	};

	/** ----------------------------- Prospects CRUD ----------------------------- */

	/** --------------- CREATE ----------- */

	createProspect(_payload) {

		return this.request('POST', '/prospects/createProspect', { body: _payload });
	};

	/** --------------- READ ----------- */

	fetchAllProspects() {

		return this.request('GET', '/prospects/fetchAllProspects');
	};

	fetchSingleProspects(_prospectToken) {

		return this.request('GET', '/prospects/fetchSingleProspects', {
			headers: { 'UserToken' : `${_prospectToken}` }
		});
	};

	/** --------------- UPDATE ----------- */

	updateProspect(_payload) {

		return this.request('PUT', '/prospects/updateProspect', { body: _payload });
	};

	changeProspect(_payload) {

		return this.request('PUT', '/prospects/changeProspect', { body: _payload });
	};

	/** --------------- DELETE ----------- */

	deleteProspect(_payload) {

		return this.request('DELETE', '/prospects/deleteProspect', { body: _payload });
	};

	/** ----------------------------- Proposals CRUD ----------------------------- */

	/** --------------- CREATE ----------- */

	createProposal(_payload) {

		return this.request('POST', '/proposals/createProposal', { body: _payload });
	};

	/** --------------- READ ----------- */

	fetchAllProposals() {

		return this.request('GET', '/proposals/fetchAllProposals');
	};

	fetchSingleProposal(_proposalToken) {

		return this.request('GET', '/proposals/fetchSingleProposal', {
			headers: { 'ProposalToken': `${_proposalToken}` }
		});
	};

	/** --------------- UPDATE ----------- */

	updateProposal(_payload) {

		return this.request('PUT', '/proposals/updateProposal', { body: _payload });
	};

	/** --------------- DELETE ----------- */

	deleteProposal(_payload) {

		return this.request('DELETE', '/proposals/deleteProposal', { body: _payload });
	};

	/** ---------------------------------------------------- AUTH ------------------------------------------ */

	login(_payload) {

		return this.request('POST', '/auth/login', { body: _payload });
	};

	getClientIpAddess() {

		return this.request('GET', '/auth/getClientIpAddress');
	};

	checkValidEmail(_payload) {

		return this.request('POST', '/auth/checkValidEmail', { body: _payload });
	};

	updateProspect(_payload) {

		return this.request('PUT', '/prospects/updateProspect', { body: _payload });
	};

	fetchAllProspects() {

		return this.request('GET', '/prospects/fetchAllProspects');
	};

	createProspect(_payload) {

		return this.request('POST', '/prospects/createProspect', { body: _payload });
	};

	changeProspect(_payload) {

		return this.request('PUT', '/prospects/changeProspect', { body: _payload });
	};

	deleteProspect(_payload) {

		return this.request('DELETE', '/prospects/deleteProspect', { body: _payload });
	};

	fetchSingleProspects(_prospectToken) {

		return this.request('GET', '/prospects/fetchSingleProspects', {
			headers: { 'UserToken' : `${_prospectToken}` }
		});
	};

	resetPassword(_payload) {

		return this.request('POST', '/auth/resetPassword', { body: _payload });
	};
}

export default new Overture();
