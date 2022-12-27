<template>
	<div>

		<!-- Navigation Bars -->
		<Navbar />

		<v-main>
			<v-container fluid class="pa-8">
				<v-row align="center" justify="center">
					<v-col cols="12">

						<!-- Error Message -->
						<v-alert
							type="error"
							v-if="error">
							{{ errorMessage }}
						</v-alert>

						<!-- Snackbar -->
						<v-snackbar
							v-model="snackbar"
							:timeout="this.$store.state.SnackbarTimeout"
							:color="snackbarColor">
							{{ snackbarMessage }}
						</v-snackbar>

						<h1 class="pb-5">Dashboard</h1>

						<p>Open Proposals</p>

						<p>Latest Prospects</p>

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

/* Supress Moment Deprecation Warnings */
moment.suppressDeprecationWarnings = true;

export default {

	components: {
		Navbar,
		Footer
	},

	data: () => ({

		/* Error Dialog */
		error: false,
		errorMessage: '',

		/* Snackbar */
		snackbar: false,
		snackbarColor: null,
		snackbarMessage: '',

		/* Search */

		/* Dialogs */
		contactDialog: false,

		/* Form Fiels */
		message: '',
		countGiftcards: null,
		countCoupons: null,
		countPromoCodes: null,
		countDocuments: null,
		countMessages: null,

		/* Call to Actions */
		loadingCallToAction: false,

		/* Datatables */
		/* Temp. Data */
	}),

	methods: {

		/* Check if Winners has items to display tabs */
		checkItems() {

			fetch(`${import.meta.env.VITE_APP_API_URL}/account/checkItemsForWinners`, {
				mode        : 'cors',
				method      : 'GET',
				cache       : 'no-cache',
				credentials : 'same-origin',
				headers: {
					'Content-Type'     : 'application/json',
					'IpAddress'        : `${this.$store.state.WinnerIpAddress}`,
					'SessToken'        : `${sessionStorage.getItem('SessWinnerToken')}`,
					'Language'         : `${this.$store.state.Language}`,
					'WinnerToken'      : `${this.$store.state.WinnerToken}`,
					'SweepstakesToken' : `${this.$store.state.SweepstakesToken}`
				}
			})
			.then((res) => {

				/* Clear storage and logout */
				if(res.status !== 200){
					sessionStorage.clear();
					this.$router.push({ path: '/login-winners' });
				} return res.json();
			})
			.then((jsonResponse) => {

				this.countGiftcards  = jsonResponse.Giftcards;
				this.countCoupons    = jsonResponse.Coupons;
				this.countPromoCodes = jsonResponse.PromoCodes;
				this.countDocuments  = jsonResponse.Documents;
				this.countMessages   = jsonResponse.Messages;
			})
			.catch(console.error);
		},

		openContactDialog() {
			this.message       = '';
			this.contactDialog = true;
		},

		submitContact() {

			this.loadingCallToAction = true;

			/* Construct Object */
			const payload = {
				WinnerToken  : this.$store.state.WinnerToken,
				FirstName    : this.$store.state.WinnerFirstName,
				LastName     : this.$store.state.WinnerLastName,
				Email        : this.$store.state.WinnerEmail,
				MobileNumber : this.$store.state.WinnerMobileNumber,
				PinNumber    : this.$store.state.WinnerPinNumber,
				IpAddress    : this.$store.state.WinnerIpAddress,
				Message      : this.message
			};

			fetch(`${import.meta.env.VITE_APP_API_URL}/account/contactSupport`, {
				mode        : 'cors',
				method      : 'POST',
				cache       : 'no-cache',
				credentials : 'same-origin',
				body        : JSON.stringify(payload),
				headers: {
					'Content-Type' : 'application/json',
					// 'SessToken'    : `${localStorage.getItem('WSessToken')}`,
					'Language'     : `${this.$store.state.Language}`,
					'IpAddress'    : `${this.$store.state.WinnerIpAddress}`,
					'SessToken'    : `${sessionStorage.getItem('SessWinnerToken')}`,
				}
			})
			.then((res) => {

				/* Clear storage and logout */
				if(res.status !== 200){
					sessionStorage.clear();
					localStorage.removeItem('WSessToken');
					this.$router.push({ path: '/' });
				} return res.json();
			})
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Show Snackbar */
					this.snackbar            = true;
					this.snackbarColor       = 'success';
					this.snackbarMessage     = jsonResponse.Message;
					this.loadingCallToAction = false;
					this.contactDialog       = false;

				} else {

					this.snackbar            = true;
					this.snackbarColor       = 'error';
					this.snackbarMessage     = jsonResponse.Message;
					this.loadingCallToAction = false;
					this.contactDialog       = false;
				}
			})
			.catch(console.error);
		},

		logout() {
			sessionStorage.clear();
			this.$router.push({ path: '/login-winners' })
		}
	},

	/* Component Lifecycle
	/
	/  beforeCreate()
	/  created()
	/  beforeMount()
	/  mounted()
	/  beforeUpdate()
	/  updated()
	/  beforeDestroy()
	/  destroyed()
	*/

	beforeCreate() {

		/* Check Valid Session */
		// if(this.$store.state.WinnerToken === null || !this.$store.state.WinnerToken) {
		// 	sessionStorage.clear();
		// 	this.$router.push({ path: '/login-winners' })
		// }
	},

	created() {

		// /* Set CurrentPage in VUEX Store */
		// this.$store.dispatch('setCurrentPage', { Page : 'dashboard' });

		// /* Check Items to show/hide tabs */
		// this.checkItems();
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
