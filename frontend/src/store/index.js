/*
	 ___
	/ __|_ __ _____ ___ _ __ _ __  ___ __ _
	\__ \ V  V / -_) -_) '_ \ '_ \/ -_) _` |
	|___/\_/\_/\___\___| .__/ .__/\___\__,_|
						|_|  |_|

	Platform  : Sweeppea Overture v1.0
    Path      : /store/index.js
    Language  : JavaScript
    Released  : 2022-2023

    (c) Sweeppea, all rights reserved.
*/

'use strict';

import { createStore } from 'vuex'
import en from '@/i18n/en';
import es from '@/i18n/es';

const store = createStore({

	state: {

		/* Global Session Data */
		UserToken: null,
		UserType: null,
		CreationDate: null,
		AccountLongNumber: null,
		Avatar: null,
		FullName: null,
		Email: null,
		Nickname: null,
		MobilePhone: null,
		Language: null,
		DateFormat: null,
		TimeFormat: null,
		Timezone: null,
		Environment: null,
		GeoLat: null,
		GeoLon: null,
		GoogleApiKeyDev: null,
		GoogleApiKeyPrd: null,
		DarkMode: null,
		SandboxPaymentProcessor: null,
		SessionExpiration: null,
		ApiToken: null,
		IpAddress: null,
		CurrentPage: null,
		APIDomain: null,
		APPDomain: null,
		Status: null,
		/* Prospect */
		SelectedProspect: null,
		ProspectName: null,
		ProspectEmail: null,
		ProspectBusinessName: null,

		/* UI Elements */
		SnackbarTimeout: 3000,

		/* Static Content */
		FooterCopyright: '©️Overture',

		/* Locales */
		Locales: {},
	},

	getters: {

		getCredentials(state) {
			return {
				'IpAddress' : `${state.IpAddress}`,
				'Language'  : `${state.Language}`,
			}
		}
	},

	mutations: {

		/* Update User Profile */
		updateProfile(x, payload) {
			this.state.FirstName    =  payload.FirstName;
			this.state.LastName    	=  payload.LastName;
			this.state.Email       	=  payload.Email;
			this.state.ProspectName = payload.FullName;
		},

		/* Update GeoLocation */
		updateGeoLocation(x, payload) {

			this.state.GeoLat    = payload.GeoLat;
			this.state.GeoLon    = payload.GeoLon;
			this.state.MapCenter = {
				lat: payload.GeoLat,
				lng: payload.GeoLon
			};

			// console.warn('*** GeoLocation updated in VUEX Store ***');
			// console.warn('Lat: ', this.state.GeoLat);
			// console.warn('Lon: ', this.state.GeoLon);
		},

		/* Set Current Prospect */
		setCurrentProspect(x, payload) {
			this.state.SelectedProspect = payload;
		},
		setCurrentProspectBusiness(x, payload) {
			this.state.ProspectBusinessName = payload;
		},

		/* Set Current Prospect Name */
		setCurrentProspectName(x, payload) {
			this.state.ProspectName = payload;
		},

		/* Set Current Prospect Email */
		setCurrentProspectEmail(x, payload) {
			this.state.ProspectEmail = payload;
		},

		/* Update Language */
		updateLanguage(x, payload) {
			this.state.Language = payload.Language;
			this.state.Locales  = payload.Language === 'en' ? en : es;
		},

		// /* Update Sweepstakes */
		// updateSweepstakes(x, payload) {
		// 	this.state.SweepstakesToken = payload.SweepstakesToken;
		// 	this.state.SweepstakesName  = payload.SweepstakesName;
		// },

		/* Clear VueX Store */
		clearVuexStore() {

			console.log('------------------------------');
			console.log('       Clear VUEX Store       ');
			console.log('------------------------------');

			this.state.UserToken               = null;
			this.state.UserType                = null;
			this.state.CreationDate            = null;
			this.state.AccountLongNumber       = null;
			this.state.Avatar                  = null;
			this.state.FullName                = null;
			this.state.Email                   = null;
			this.state.Nickname                = null;
			this.state.MobilePhone             = null;
			this.state.Language                = null;
			this.state.DateFormat              = null;
			this.state.TimeFormat              = null;
			this.state.Timezone                = null;
			this.state.Environment             = null;
			this.state.GeoLat                  = null;
			this.state.GeoLon                  = null;
			this.state.GoogleApiKeyDev         = null;
			this.state.GoogleApiKeyPrd         = null;
			this.state.DarkMode                = null;
			this.state.SandboxPaymentProcessor = null;
			this.state.SessionExpiration       = null;
			this.state.ApiToken                = null;
			this.state.IpAddress               = null;
			this.state.CurrentPage             = null;
			this.state.APIDomain               = null;
			this.state.APPDomain               = null;
			this.state.Status                  = null;
			this.state.SelectedProspect        = null;
			this.state.ProspectName            = null;
			this.state.ProspectEmail           = null;
		},
	},

	actions: {

		// /* Fetch Session Info & Settings */
		// fetchSessionInfo() {

		// 	/* Only if UserToken is NULL */
		// 	if(this.state.UserToken === null || this.state.UserToken === '' || !this.state.UserToken){

		// 		fetch(`${process.env.VUE_APP_API_URL}/account/fetchSessionInfo`, {
		// 			mode        : 'cors',
		// 			method      : 'GET',
		// 			cache       : 'no-cache',
		// 			credentials : 'same-origin',
		// 			headers     : {
		// 				'Content-Type' : 'application/json',
		// 				'SessToken'    : `${localStorage.getItem('OvSessToken')}`,
		// 				'Language'     : `${this.state.Language}`
		// 			}
		// 		})
		// 		.then((res) => {

		// 			/* Clear storage and logout */
		// 			if(res.status !== 200){
		// 				sessionStorage.clear();
		// 				localStorage.removeItem('OvSessToken');
		// 				//this.$router.push({ path: '/' });
		// 				window.location.href = "/";
		// 			} return res.json();
		// 		})
		// 		.then((jsonResponse) => {

		// 			if (jsonResponse.Response === true) {

		// 				/* Save in Vuex Store */
		// 				this.state.UserToken        = jsonResponse.UserToken;
		// 				this.state.FirstName        = jsonResponse.FirstName;
		// 				this.state.LastName         = jsonResponse.LastName;
		// 				this.state.Email            = jsonResponse.Email;
		// 				this.state.MobilePhone      = jsonResponse.MobilePhone;
		// 				this.state.GeoLat           = jsonResponse.GeoLat;
		// 				this.state.GeoLon           = jsonResponse.GeoLon;
		// 				this.state.UserType         = jsonResponse.UserType;
		// 				this.state.ApiToken         = jsonResponse.ApiToken;
		// 				this.state.Language         = jsonResponse.Language;
		// 				this.state.LoggedIn         = jsonResponse.LoggedIn;
		// 				this.state.SweepstakesToken = localStorage.getItem('__wsp-stk');
		// 				this.state.SweepstakesName  = localStorage.getItem('__wsp-nme');
		// 				this.state.Locales          = require(`../i18n/${jsonResponse.Language}.js`);

		// 			} else {

		// 				// console.error(' *** Error fetching userInfo $store *** ');

		// 				/* Clear sessionStorage and Logout */
		// 				sessionStorage.clear();
		// 				localStorage.removeItem('WSessToken');
		// 				// bad implementation of redirection
		// 				// but router push does not work :(
		// 				window.location.href = "/";
		// 				//this.$router.push({ path: '/' });
		// 			}
		// 		})
		// 		.catch(console.error);

		// 	} else {

		// 		console.warn('  ***  Data in $store is not null.  ***  ');
		// 	}
		// },

		/* Fetch USER Info & Settings */
		fetchInfoSettings() {

			/* Only if UserToken is NULL */
			if(this.state.UserToken === null || !this.state.UserToken){

				/* --- Get Client's IP Address --- */
        fetch(`${import.meta.env.VITE_APP_API_URL}/auth/getClientIpAddress`, {
					mode        : 'cors',
					method      : 'GET',
					cache       : 'no-cache',
					credentials : 'same-origin',
					headers     : { 'Content-Type' : 'application/json' }
				})
				.then((res) => {

					/* Clear storage and logout */
					if(res.status !== 200){
						sessionStorage.clear();
						localStorage.removeItem('OvSessToken');
						// this.$router.push({ path: '/' });
						window.location.href = "/";
					} return res.json();
				})
				.then(async (jsonResponse) => {

					/* Set Client's IP Address */
					this.state.IPAddress = jsonResponse.IpAddress;

					/* Check if UserToken is Store in Local Database or SP4 API */
          fetch(`${import.meta.env.VITE_APP_API_URL}/prospects/fetchSingleProspects`, {
						mode        : 'cors',
						method      : 'GET',
						cache       : 'no-cache',
						credentials : 'same-origin',
						headers     : {
							'Content-Type' : 'application/json',
							'SessToken'    : `${localStorage.getItem('OvSessToken')}`,
							'IpAddress'    : `${this.state.IpAddress}`,
							'Language'     : `${this.state.Language}`,
							'UserToken'    : null,
						}
					})
					.then((res) => {

						/* Clear Storage and Logout */
						if(res.status !== 200){
							sessionStorage.clear();
							localStorage.removeItem('OvSessToken');
							// this.$router.push({ path: '/' });
							window.location.href = "/";
						} return res.json();
					})
					.then((jsonResponse) => {

						if(jsonResponse.Response === true) {

							/* User is Stored Locally */
							console.log('*** User Is Stored Locally ***');

							/* --- Get User's Info & Settings (Locally) --- */
              fetch(`${import.meta.env.VITE_APP_API_URL}/account/fetchUserInfoSettings`, {
								mode        : 'cors',
								method      : 'GET',
								cache       : 'no-cache',
								credentials : 'same-origin',
								headers     : {
									'Content-Type' : 'application/json',
									'IpAddress'    : `${this.state.IPAddress}`,
									'Language'     : `${this.state.Language}`,
									'SessToken'    : `${localStorage.getItem('OvSessToken')}`,
								}
							})
							.then((res) => {

								/* Clear storage and logout */
								if(res.status !== 200){
									sessionStorage.clear();
									localStorage.removeItem('OvSessToken');
									// this.$router.push({ path: '/' });
									window.location.href = "/";
								} return res.json();
							})
							.then((jsonResponse) => {

								if (jsonResponse.Response === true) {

									this.UserToken               = null;
									this.UserType                = null;
									this.CreationDate            = null;
									this.AccountLongNumber       = null;
									this.Avatar                  = null;
									this.FullName                = null;
									this.Email                   = null;
									this.Nickname                = null;
									this.MobilePhone             = null;
									this.Language                = null;
									this.DateFormat              = null;
									this.TimeFormat              = null;
									this.Timezone                = null;
									this.Environment             = null;
									this.GeoLat                  = null;
									this.GeoLon                  = null;
									this.GoogleApiKeyDev         = null;
									this.GoogleApiKeyPrd         = null;
									this.DarkMode                = null;
									this.SandboxPaymentProcessor = null;
									this.SessionExpiration       = null;
									this.ApiToken                = null;
									this.IpAddress               = null;
									this.CurrentPage             = null;
									this.APIDomain               = null;
									this.APPDomain               = null;
									this.Status                  = null;

								} else {

									/* Clear sessionStorage and Logout */
									sessionStorage.clear();
									// bad implementation of redirection
									// but router push does not work :(
									window.location.href = "/";
									//this.$router.push({ path: '/' });
								}
							})
							.catch(console.error);

						} else {

							/* User is Stored in SP4 API */
							console.log('*** User is stored in SP4 API ***');

							// axios.get(`https://api.sweeppea.com/api-v1/auth/fetchUserAccount/en/Overture/XXXX/${jsonResponse.UserToken}`)
							// .then((responseInfo) => {

							// 	this.UserToken               = jsonResponse.UserToken;
							// 	this.UserType                = responseInfo.data.Data.UserType;
							// 	this.CreationDate            = responseInfo.data.Data.CreationDate;
							// 	this.AccountLongNumber       = responseInfo.data.Data.AccountLongNumber;
							// 	this.Avatar                  = responseInfo.data.Data.Avatar;
							// 	this.FullName                = responseInfo.data.Data.FullName;
							// 	this.Email                   = responseInfo.data.Data.Email;
							// 	this.Nickname                = responseInfo.data.Data.Nickname;
							// 	this.MobilePhone             = responseInfo.data.Data.MobilePhone;
							// 	this.Language                = responseInfo.data.Data.Language;
							// 	this.DateFormat              = responseInfo.data.Data.DateFormat;
							// 	this.TimeFormat              = responseInfo.data.Data.TimeFormat;
							// 	this.Timezone                = responseInfo.data.Data.Timezone;
							// 	// this.Environment             = Config.environment;
							// 	this.GeoLat                  = responseInfo.data.Data.GeoLat;
							// 	this.GeoLon                  = responseInfo.data.Data.GeoLon;
							// 	// this.GoogleApiKeyDev         = PrivateKeys.GOOGLE_CLOUD_API_KEY_DEVELOPMENT,
							// 	// this.GoogleApiKeyPrd         = PrivateKeys.GOOGLE_CLOUD_API_KEY_PRODUCTION,
							// 	this.DarkMode                = responseInfo.data.Data.DarkMode,
							// 	this.SandboxPaymentProcessor = responseInfo.data.Data.SandboxPaymentProcessor,
							// 	this.SessionExpiration       = responseInfo.data.Data.SessionExpiration,
							// 	// this.APIDomain               = `${Config.https}${Config.apiDomain}`,
							// 	// this.APPDomain               = `${Config.https}${Config.appDomain}`,
							// 	this.Status                  = responseInfo.data.Data.Status;
							// })
							// .catch((error) => {

							// 	/* Console Log Error Message */
							// 	console.log(error);
							// });
						}
					})
					.catch(console.error);
				})
				.catch(console.error);

			} else {

				/* Ok, Data in Store isn't NULL */
				console.warn('  ***  Data in $store is not null.  ***  ');
			}
		},

		/* Commit setCurrentProspect */
		setCurrentProspect(x, payload) {
			x.commit('setCurrentProspect', payload);
		},

		/* Commit setCurrentProspectName */
		setCurrentProspectName(x, payload) {
			x.commit('setCurrentProspectName', payload);
		},

		setCurrentProspectBusiness(x, payload) {
			x.commit('setCurrentProspectBusiness', payload);
		},

		/* Commit setCurrentProspectEmail */
		setCurrentProspectEmail(x, payload) {
			x.commit('setCurrentProspectEmail', payload);
		},

		/* Commit updated profile values */
		updateProfile(x, payload) {
			x.commit('updateProfile', payload);
		},

		/* Commit update language */
		updateLanguage(x, payload) {
			x.commit('updateLanguage', payload);
		},

		// /* Commit update sweepstakes */
		// updateSweepstakes(x, payload) {
		// 	x.commit('updateSweepstakes', payload);
		// },
	}
});

export default store;

