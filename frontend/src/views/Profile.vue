<template>
	<div>

		<!-- Navigation Bars -->
		<Navbar />

		<v-main>
			<v-container fluid class="pa-8">
				<v-row align="center" justify="center">
					<v-col cols="12">

						<!-- Snackbar -->
						<v-snackbar
							v-model="snackbar"
							:timeout="this.$store.state.SnackbarTimeout"
							:color="snackbarColor">
							{{ snackbarMessage }}
						</v-snackbar>

						<!-- Error Message -->
						<v-alert
							type="error"
							v-if="errorDialog">
							{{ errorMessage }}
						</v-alert>

						<h1 class="pb-5">Profile</h1>

						<!-- Admin View -->
						<div v-if="this.$store.state.UserType === 3">

						</div>

						<!-- Prospect View -->
						<div v-if="this.$store.state.UserType !== 3" align="center">

							<!-- Prospect Name -->
							<v-text-field
								type="text"
								ref="prospectFullName"
								label="Prospect Full Name"
								maxlength="50"
								v-model="prospectFullName"
								@input="prospectFullName = prospectFullName.split(' ').map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ')"
								@click.right.prevent
								:disabled="this.$store.state.UserType !== 1"
								autofocus filled>
							</v-text-field>

							<!-- Business Name -->
							<v-text-field
								type="text"
								ref="businessName"
								label="Business Name"
								maxlength="50"
								v-model="prospectBusinessName"
								@input="prospectBusinessName = prospectBusinessName.split(' ').map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ')"
								@click.right.prevent
								:disabled="this.$store.state.UserType !== 1"
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
								:disabled="this.$store.state.UserType !== 1"
								filled>
							</v-text-field>

							<!-- Primary Phone Number -->
							<v-text-field
								type="text"
								ref="prospectPhoneNumber"
								label="Mobile Number"
								maxlength="10"
								v-model="prospectMobilePhone"
								@keydown.space.prevent
								@keypress="onlyNumbers"
								@click.right.prevent
								@copy.prevent
								@paste.prevent
								:disabled="this.$store.state.UserType !== 1"
								filled>
							</v-text-field>

							<!-- Password -->
							<!-- <v-text-field
								type="password"
								ref="prospectPassword"
								label="Password"
								maxlength="20"
								v-model="prospectPassword"
								@keydown.space.prevent
								@click.right.prevent
								@copy.prevent
								@paste.prevent
								:disabled="this.$store.state.UserType !== 1"
								filled>
							</v-text-field> -->

							<!-- Update Profile Button -->
							<v-btn
								block large
								color="primary"
								v-on:click="updateProfile"
								:loading="loadingCallToAction"
								:disabled="!prospectFullName || !prospectBusinessName || !prospectEmail || !prospectMobilePhone || !validEmail">
								Update Profile
							</v-btn>

						</div>
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
import { onlyNumbers } from '../includes/functions.js';

/* Supress Moment Deprecation Warnings */
moment.suppressDeprecationWarnings = true;

export default {

	components: {
		Navbar,
		Footer
	},

	data: () => ({

		/* Error Dialog */
		errorDialog: false,
		errorMessage: '',

		/* Snackbar */
		snackbar: false,
		snackbarColor: '',
		snackbarMessage: '',

		/* Search */
		/* Dialogs */
		/* Form Fiels */
		prospectFullName: '',
		prospectBusinessName: '',
		prospectEmail: '',
		prospectMobilePhone: '',
		newPassword: '',
		repeatPassword: '',

		/* Call to Actions */
		loadingCallToAction: false,

		/* Datatables */

		/* Temp. Data */
		agreeDeleteProfile: false,
		validEmail: true,
	}),

	methods: {

		/* Function to check email address */
		validateEmail(e) {

			if(e) {

				Overture.checkValidEmail({ Email: e })
				.then((jsonResponse) => {

					if(/\S+@\S+\.\S+/.test(this.prospectEmail) === false){

						this.errorDialog  = true;
						this.errorMessage = `Invalid email address, try again.`;
						this.validEmail   = false;

					} else {

						if (jsonResponse.Response === true && this.prospectEmail !== this.$store.state.Email) {

							/* Email Already Exists */
							this.errorDialog  = true;
							this.errorMessage = jsonResponse.Message;
							this.validEmail   = false;

						} else {

							/* Email Does Not Exist */
							this.errorDialog  = false;
							this.errorMessage = '';
							this.validEmail   = true;
						}
					}
				})
				.catch(console.error);
			}
		},

		updateProfile() {

			this.loadingCallToAction = true;

			if(/\S+@\S+\.\S+/.test(this.prospectEmail) === false){

				this.errorDialog         = true;
				this.errorMessage        = `Invalid email address, try again.`;
				this.loadingCallToAction = false;
				this.$refs.email.focus();
				e.preventDefault();

			} else {

				/* Construct Object */
				const payload = {
					UserToken   : this.$store.state.UserToken,
					FullName	: this.prospectFullName,
					Email       : this.prospectEmail,
					PhoneNumber : this.prospectMobilePhone,
					BusinessName: this.prospectBusinessName,
				};

				Overture.updateProspect(payload)
				.then((jsonResponse) => {

					if (jsonResponse.Response === true) {

						if(jsonResponse.DestroySession === true) {

							/* Clear Session Storage */
							sessionStorage.clear();
							localStorage.removeItem('__wsp-rme');
							localStorage.removeItem('OvSessToken');

							/* Redirect to Login Page */
							this.$router.push({ name: 'Login', params: { postMessage: `Your credentials have changed, please login again.` }});

						} else {

							/* Update VUEX Store */
							this.$store.dispatch('updateProfile', {
								FullName	: this.prospectFullName,
								Email       : this.prospectEmail,
								MobilePhone : this.prospectMobilePhone,
							});

							/* Show Confirmation Message */
							this.loadingCallToAction = false;
							this.snackbar            = true;
							this.snackbarColor       = 'success';
							this.snackbarMessage     = jsonResponse.Message;
						}

					} else {

						/* Show Error Message */
						this.loadingCallToAction = false;
						this.errorDialog         = true;
						this.errorMessage        = jsonResponse.Message;
					}
				})
				.catch(console.error);
			}
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

	beforeMount() {

		/* Populate Form Fields */
		this.prospectFullName     = this.$store.state.ProspectName;
		this.prospectBusinessName = this.$store.state.ProspectBusinessName;
		this.prospectEmail        = this.$store.state.ProspectEmail;
		this.prospectMobilePhone  = this.$store.state.MobilePhone;
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

