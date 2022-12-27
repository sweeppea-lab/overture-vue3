<template>
	<div>

		<!-- Navigation Bars -->
		<Navbar />

		<v-main>
			<v-container fluid class="pa-8" v-if="this.$store.state.UserType === 3" >
				<v-row align="center" justify="center">
					<v-col cols="12">

						<h1 class="pb-5">Prospects</h1>

						<!-- Snackbar -->
						<v-snackbar
							v-model="snackbar"
							:timeout="this.$store.state.SnackbarTimeout"
							:color="snackbarColor">
							{{ snackbarMessage }}
						</v-snackbar>

						<!-- New Prospect -->
						<v-btn
							color="primary"
							class="mb-5 mr-2"
							dark @click="newProspectDialog = true">
							<v-icon class="mr-2">
								mdi-plus-circle
							</v-icon>
							New Prospect
						</v-btn>

						<!-- Reload Table -->
						<v-btn
							color="secondary"
							class="mb-5 mr-2" dark right
							@click="reloadTable">
							<v-icon>
								mdi-refresh
							</v-icon>
						</v-btn>

						<!-- On/Off Search -->
						<v-btn
							color="secondary"
							class="mb-5" dark right
							@click="onOffSearch">
							<v-icon>
								{{ magnifyIcon }}
							</v-icon>
						</v-btn>

						<!-- Search Field -->
						<v-text-field
							ref="searchField"
							v-model="search"
							append-icon="mdi-magnify"
							label="Search Prospects ..."
							single-line
							outlined clearable
							v-show="showSearchField">
						</v-text-field>

						<!-- Delete Prospect Dialog -->
						<v-dialog v-model="deleteProspectDialog" width="500">
							<v-card>
								<v-card-text class="pa-10 deleteDialogBackground">
									<p class="headline white--text">
										Are you sure you want to delete this prospect? All data and proposals will be removed.
									</p>
									<v-card-actions>
										<v-btn
											color="white"
											outlined dark large block
											@click="deleteItem(itemIDToDelete)"
											:loading="loadingCallToAction">
											<v-icon class="mr-2">
												mdi-delete
											</v-icon>
											Yes, I'm Sure!
										</v-btn>
									</v-card-actions>
								</v-card-text>
							</v-card>
						</v-dialog>

						<!-- New/Edit Prospect Dialog -->
						<v-dialog v-model="newProspectDialog" width="600" persistent scrollable>
							<v-card>

								<v-card-title class="headline black lighten-1 white--text" primary-title>
									<v-icon class="pr-4" color="white">
										mdi-account-plus
									</v-icon>
									{{ newEditProspectDialogTitle }}
									<v-spacer></v-spacer>
									<v-btn icon @click="closeDialogs" color="red">
										<v-icon>
											mdi-close
										</v-icon>
									</v-btn>
								</v-card-title>

								<v-card-text class="pa-10">

									<!-- Error Message -->
									<v-alert
										class="mb-5"
										type="error"
										v-model="errorAlert">
										{{ errorMessage }}
									</v-alert>

									<form>

										<!-- Prospect Name -->
										<v-text-field
											type="text"
											ref="prospectFullName"
											label="Prospect Full Name"
											maxlength="50"
											v-model="prospectFullName"
											@input="prospectFullName = prospectFullName.split(' ').map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ')"
											@click.right.prevent
											autofocus filled>
										</v-text-field>

										<!-- Business Name -->
										<v-text-field
											type="text"
											ref="businessName"
											label="Business Name"
											maxlength="50"
											v-model="businessName"
											@input="businessName = businessName.split(' ').map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ')"
											@click.right.prevent
											filled>
										</v-text-field>

										<!-- Primary Email -->
										<v-text-field
											type="text"
											ref="prospectEmail"
											label="Primary Email"
											maxlength="60"
											v-model="prospectEmail"
											@input="prospectEmail = prospectEmail.toLowerCase(); validateEmail($event)"
											@keydown.space.prevent
											@click.right.prevent
											@copy.prevent
											@paste.prevent
											filled>
										</v-text-field>

										<!-- Primary Phone Number -->
										<v-text-field
											type="text"
											ref="prospectPhoneNumber"
											label="Mobile Number"
											maxlength="10"
											v-model="prospectPhoneNumber"
											@keydown.space.prevent
											@keypress="onlyNumbers"
											@input="validateMobilePhone($event)"
											@click.right.prevent
											@copy.prevent
											@paste.prevent
											filled>
										</v-text-field>

										<!-- Password -->
										<v-text-field
											v-if="this.saveButton === true"
											type="password"
											ref="prospectPassword"
											label="Password"
											maxlength="20"
											v-model="prospectPassword"
											@keydown.space.prevent
											@click.right.prevent
											@copy.prevent
											@paste.prevent
											filled
											autocomplete="off">
										</v-text-field>

										<!-- Send a Welcome Email and SMS to Prospect -->
										<v-switch
											v-if="this.saveButton === true"
											class="mt-0 ml-0" inset
											ref="sendWelcomeEmailAndSMS"
											v-model="sendWelcomeEmailAndSMS"
											label="Send a Welcome Email and SMS to Prospect">
										</v-switch>

									</form>

									<!-- Create Prospect Button -->
									<v-btn
										v-if="this.saveButton === true"
										class="mt-5"
										color="success"
										block large
										@click="createProspect"
										:disabled="!this.prospectFullName || !this.businessName || !this.prospectEmail || !this.prospectPhoneNumber || this.prospectPhoneNumber.length < 10 || !this.prospectPassword"
										:loading="loadingCallToAction">
										Create Prospect
									</v-btn>

									<!-- Update Prospect Button -->
									<v-btn
										v-if="this.saveButton === false"
										class="mt-5"
										color="success"
										block large
										@click="updateProspect"
										:disabled="!this.prospectFullName || !this.businessName || !this.prospectEmail || !this.prospectPhoneNumber || this.prospectPhoneNumber.length < 10 || !this.prospectPassword"
										:loading="loadingCallToAction">
										Update Prospect
									</v-btn>

								</v-card-text>

							</v-card>
						</v-dialog>

						<!-- Datatable -->
						<v-data-table
							:headers="headers"
							:items="prospectsList"
							:items-per-page="itemsPerPage"
							:search="search"
							:loading="loadingDatatable"
							:multi-sort="true"
							:footer-props="{'items-per-page-options': [-1, 10, 25, 50, 100, 500]}"
							@update:items-per-page="setDTItemsPerPage('Prospects', $event)">

							<!-- Name -->
							<template v-slot:item.Name="{ item }">
								{{ item.Name }}
							</template>

							<!-- Email -->
							<template v-slot:item.Email="{ item }">
								{{ item.Email }}
							</template>

							<!-- Phone Number -->
							<template v-slot:item.PhoneNumber="{ item }">
								{{ formatPhoneNumber(item.PhoneNumber) }}
							</template>

							<!-- Creation Date/Time -->
							<template v-slot:item.CreationDate="{ item }">
								{{ formatDateTime(item.CreationDate, $store.state.Language, $store.state.DateFormat, $store.state.TimeFormat) }}
							</template>

							<!-- Actions -->
							<template v-slot:item.Actions="{ item }">

								<v-menu left>
									<template v-slot:activator="{ on }">
										<v-btn small color="primary" dark v-on="on">
											<v-icon>
												mdi-menu-down
											</v-icon>
										</v-btn>
									</template>

									<v-list>

										<!-- Select Prospect -->
										<v-list-item @click="selectProspect(item.UserToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-cursor-default-click
												</v-icon>
												Select
											</v-list-item-title>
										</v-list-item>

										<!-- Edit Prospect -->
										<v-list-item @click="editProspect(item.UserToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-pencil
												</v-icon>
												Edit
											</v-list-item-title>
										</v-list-item>

										<!-- Notify Prospect -->
										<v-list-item @click="notifyProspect(item.UserToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-email-fast-outline
												</v-icon>
												Notify
											</v-list-item-title>
										</v-list-item>

										<v-divider></v-divider>

										<!-- Convert To Client / Migrate to APP4 -->
										<v-list-item @click="migrateProspect(item.UserToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-account-switch-outline
												</v-icon>
												Migrate
											</v-list-item-title>
										</v-list-item>

										<v-divider></v-divider>

										<!-- Delete -->
										<v-list-item @click="deleteItemConfirmation(item.UserToken)">
											<v-list-item-title style="color: crimson;">
												<v-icon class="mr-2" style="color: crimson;">
													mdi-trash-can
												</v-icon>
												Delete
											</v-list-item-title>
										</v-list-item>

									</v-list>
								</v-menu>

							</template>
						</v-data-table>

					</v-col>
				</v-row>
			</v-container>
		</v-main>

		<!-- Footer -->
		<Footer />

	</div>
</template>

<script>
import Navbar from '@/components/NavigationBars.vue';
import Footer from '@/components/Footer.vue';
import moment from 'moment';
import Overture from '../services/Overture';
import { checkEmailAddress, onlyNumbers, formatPhoneNumber, formatDateTime  } from '../includes/functions.js';

/* Supress Moment Deprecation Warnings */
moment.suppressDeprecationWarnings = true;

export default {

	components: {
		Navbar,
		Footer
	},

	data: () => ({

		/* Error Dialog */
		errorAlert: false,
		errorMessage: '',

		/* Snackbar */
		snackbar: false,
		snackbarColor: null,
		snackbarMessage: '',

		/* Search */
		search: '',
		showSearchField: false,
		magnifyIcon: 'mdi-magnify',

		/* Dialogs */
		newProspectDialog: false,
		deleteProspectDialog: false,
		newEditProspectDialogTitle: `New Prospect`,

		/* Form Fiels */
		prospectToken: null,
		prospectFullName: null,
		businessName: null,
		prospectEmail: null,
		prospectPhoneNumber: null,
		prospectPassword: null,
		sendWelcomeEmailAndSMS: false,

		/* Call to Actions */
		saveButton: true,
		loadingCallToAction: false,

		/* Datatables */
		headers: [
			{ text: 'Name', align: 'left', value: 'ProspectName', sortable: true, width: '25%' },
			{ text: 'Business', align: 'left', value: 'BusinessName', sortable: true, width: '25%' },
			{ text: 'Email', align: 'left', value: 'Email', sortable: true, width: '20%' },
			{ text: 'Phone', align: 'left', value: 'PhoneNumber', sortable: true, width: '15%' },
			{ text: 'Creation Date', align: 'left', value: 'CreationDate', sortable: true, width: '15%' },
			{ text: '', align: 'end', value: 'Actions', sortable: false, width: '1%' },
		],
		loadingDatatable: false,
		itemsPerPage: null,

		/* Temp. Data */
		prospectsList: [],
		itemIDToDelete: null,
	}),

    methods: {

		/* Set DataTable ItemsPerPage */
		setDTItemsPerPage(_component, _value) {
			localStorage.setItem('Overture-ItemsPerPage-Prospects', _value);
			this.itemsPerPage = _value;
		},

		onOffSearch() {

			this.showSearchField === false ? this.showSearchField = true : this.showSearchField = false;
			this.showSearchField === false ? this.magnifyIcon = 'mdi-magnify' : this.magnifyIcon = 'mdi-magnify-minus-outline';
			this.showSearchField === false ? this.search = '' : this.search = '';
			this.showSearchField === true ? this.$nextTick(this.$refs.searchField.focus) : false;
		},

		reloadTable() {

			/* Fetch All Prospects */
			this.fetchAllProspects();
		},

		closeDialogs() {

			this.loadingCallToAction        = false;
			this.saveButton                 = true;
			this.errorAlert                 = false;
			this.errorMessage               = '';
			this.itemIDToDelete             = null;
			this.newProspectDialog          = false;
			this.prospectToken              = null;
			this.prospectFullName           = null;
			this.businessName               = null;
			this.prospectEmail              = null;
			this.prospectPhoneNumber        = null;
			this.prospectPassword           = null;
			this.sendWelcomeEmailAndSMS     = false;
			this.deleteProspectDialog       = false;
			this.newEditProspectDialogTitle = `New Prospect`;
		},

		validateEmail(e) {
			//
		},

		validateMobilePhone(e) {
			//
		},

		fetchAllProspects() {

			this.loadingDatatable = true;
			this.prospectsList    = [];

			Overture.fetchAllProspects()
			.then((jsonResponse) => {

				/* Populate Prospects Array */
				this.prospectsList    = [...jsonResponse.prospectsArray];
				this.loadingDatatable = false;
			})
			.catch(console.error);
		},

		createProspect() {

			this.loadingCallToAction = true;

			/* Validate Email */
			if(checkEmailAddress(this.prospectEmail) === false) {

				/* Invalid Email */
				this.loadingCallToAction = false;
				this.errorAlert          = true;
				this.errorMessage        = `Invalid email address, try again.`;
				this.$refs.prospectEmail.focus();

			} else {

				const payload = {
					FullName     : this.prospectFullName,
					BusinessName : this.businessName,
					Email        : this.prospectEmail,
					MobileNumber : this.prospectPhoneNumber,
					Password     : this.prospectPassword,
					SendEmail    : this.sendWelcomeEmailAndSMS,
				};

				Overture.createProspect(payload)
				.then((jsonResponse) => {

					if (jsonResponse.Response === true) {

						/* Show Confirmation Message */
						this.snackbar        = true;
						this.snackbarColor   = 'success';
						this.snackbarMessage = jsonResponse.Message;

						/* Fetch All Prospects */
						this.fetchAllProspects();

						/* Close Dialogs */
						this.closeDialogs();

						/* Select Created Prospect */

					} else {

						/* Show Error Message */
						this.errorAlert          = true;
						this.errorMessage        = jsonResponse.Message;
						this.loadingCallToAction = false;
					}
				})
				.catch(console.error);
			}
		},

		selectProspect(_userToken) {

			Overture.changeProspect({ UserToken : _userToken })
			.then((jsonResponse) => {

				if(jsonResponse.Response === true) {

					/* Set Last Prospect in VUEX Store */
					this.$store.dispatch('setCurrentProspect', _userToken);
					this.$store.dispatch('setCurrentProspectName', jsonResponse.FullName);
					this.$store.dispatch('setCurrentProspectEmail', jsonResponse.Email);

					/* Set last sweeps in localStorage */
					localStorage.setItem('__ov-sp', _userToken);

					/* Show Confirmation Message */
					this.snackbar        = true;
					this.snackbarColor   = 'success';
					this.snackbarMessage = jsonResponse.Message;

				} else {

					/* Show Error Message */
					this.snackbar        = true;
					this.snackbarColor   = 'error';
					this.snackbarMessage = jsonResponse.Message;
				}
			})
			.catch(console.error);
		},

		editProspect(_prospectToken) {

			Overture.fetchSingleProspects(_prospectToken)
			.then((jsonResponse) => {

				if(jsonResponse.Response === true) {

					this.newEditProspectDialogTitle = `Update Prospect`;
					this.prospectToken              = _prospectToken;
					this.prospectFullName           = jsonResponse.ProspectName;
					this.businessName 		        = jsonResponse.BusinessName;
					this.prospectEmail 		        = jsonResponse.Email;
					this.prospectPhoneNumber        = jsonResponse.PhoneNumber;
					this.prospectPassword 	        = jsonResponse.Password;
					this.saveButton                 = false;
					this.newProspectDialog          = true;

				} else {

					/* Show Error Message */
					this.snackbar        = true;
					this.snackbarColor   = 'error';
					this.snackbarMessage = jsonResponse.Message;
				}
			})
			.catch(console.error);
		},

		updateProspect() {

			this.loadingCallToAction = true;

			/* Construct Payload */
			const payload = {
				UserToken 	 : this.prospectToken,
				FullName     : this.prospectFullName,
				BusinessName : this.businessName,
				Email        : this.prospectEmail,
				PhoneNumber  : this.prospectPhoneNumber,
			};

			Overture.updateProspect(payload)
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Show Confirmation Message */
					this.snackbar        = true;
					this.snackbarColor   = 'success';
					this.snackbarMessage = jsonResponse.Message;

					/* Fetch All Prospects */
					this.fetchAllProspects();

					/* Clear and Close */
					this.closeDialogs();

				} else {

					/* Show Error Message */
					this.errorAlert          = true;
					this.errorMessage        = jsonResponse.Message;
					this.loadingCallToAction = false;
				}
			})
			.catch(console.error);
		},

		deleteItemConfirmation(_prospectToken) {

			this.itemIDToDelete       = _prospectToken;
			this.deleteProspectDialog = true;
		},

		deleteItem(_prospectToken) {

			this.loadingCallToAction = true;

			Overture.deleteProspect({ UserToken : _prospectToken })
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Show Confirmation Message */
					this.snackbar            = true;
					this.snackbarColor       = 'success';
					this.snackbarMessage     = jsonResponse.Message;
					this.loadingCallToAction = false;

					/* Update the Array */
					const index = this.prospectsList.map(function(e) { return e.UserToken; }).indexOf(_prospectToken);
					this.prospectsList.splice(index, 1);

					/* Clear and Close */
					this.closeDialogs();

				} else {

					/* Show Error Message */
					this.snackbar        = true;
					this.snackbarColor   = 'error';
					this.snackbarMessage = jsonResponse.Message;

					/* Clear and Close */
					this.closeDialogs();
				}
			})
			.catch(console.error);
		},

		notifyProspect(_prospectToken) {

			console.log(_prospectToken);
		},

		migrateProspect(_prospectToken) {

			console.log(_prospectToken);
		},

		confirmMigration(_prospectToken) {

			console.log(_prospectToken);
		},
	},

	/* >> Lifecycles
	/*
	/* beforeCreate()
	/* created()
	/* beforeMount()
	/* mounted()
	/* beforeUpdate()
	/* updated()
	/* beforeDestroy()
	/* destroyed() */

	created () {

		/* Set DataTable Items Per Page */
		if(!localStorage.getItem('Overture-ItemsPerPage-Prospects')) {

			localStorage.setItem('Overture-ItemsPerPage-Prospects', 25);
			this.itemsPerPage = 25;

		} else {

			this.itemsPerPage = parseInt(localStorage.getItem('Overture-ItemsPerPage-Prospects'));
		}

		// /* If no Sweepstakes Selected, redirect */
		// // if(!this.$store.state.SweepstakesToken || !localStorage.getItem('__wsp-stk') || !localStorage.getItem('__wsp-nme')) {
		// if(!localStorage.getItem('__wsp-stk') || !localStorage.getItem('__wsp-nme')) {
		// 	this.$router.push({ name: 'Sweepstakes', params: { postMessage: `Reminder. Ensure a sweepstakes is selected.` }});
		// }

		// /* Update Vuex Store */
		// this.$store.dispatch('updateSweepstakes', {
		// 	SweepstakesToken : localStorage.getItem('__wsp-stk'),
		// 	SweepstakesName  : localStorage.getItem('__wsp-nme')
		// });

		/* Fetch All Prospects */
		this.fetchAllProspects();
	},

	beforeMount() {

		/* Enable Warning Dialog if no Prospect Selected */
		if(this.$store.state.LastSweeps === null || !localStorage.getItem('__ov-ps') || !this.$store.state.SweepstakesToken || !localStorage.getItem('__sp-nme')) {
			this.warningDialog = true;
		}
	},

	/* Check if Logged In before enter Route */
	beforeRouteEnter (to, from, next) {

		/* If not session token, then logout */
		if(!localStorage.getItem('OvSessToken')) {
			sessionStorage.clear();
			this.$router.push({ path: '/' });
			next();
		} else next();
	},

	/* Do something before leaving Route */
	beforeRouteLeave (to, from, next) {
		next();
	}
}
</script>
