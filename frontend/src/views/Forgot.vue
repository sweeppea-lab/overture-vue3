<template>
		<v-main>

			<v-container class="fill-height pl-7 pr-7" fluid style="background-color: #fafafa;">

				<v-row>
					<v-col>

						<v-card
							elevation="0"
							:rounded="true"
							class="pa-7 elevation-0"
							:max-width="500"
							style="margin: auto; border-style: solid; border-color:#ededed">

							<!-- <v-toolbar dark flat>

								<v-toolbar-title>Reset Password</v-toolbar-title>
								<v-spacer />

								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<v-btn icon large href="/" v-on="on">
											<v-icon>mdi-arrow-left-circle</v-icon>
										</v-btn>
									</template>
									<span>Back to Login</span>
								</v-tooltip>
							</v-toolbar> -->

							<v-card-text class="pa-10">

								<v-form>

									<h1 class="mb-8">Reset your Password</h1>

									<div class="mb-4">Enter your email address below and we'll send you the new password. <strong>If you don't see your reset email</strong>, be sure to check your spam filter for an email from support@sweeppea.com</div>

									<!-- Error Message -->
									<v-alert
										type="error"
										v-if="error">
										{{ errorMessage }}
									</v-alert>

									<!-- Email Address -->
									<v-text-field
										class="pl-0 pr-0"
										type="email"
										label="Enter your email address"
										ref="email"
										maxlength="60"
										v-model="email"
										@keydown.space.prevent
										@keydown.enter.prevent
										@input="email = email.toLowerCase(), checkEmail($event)"
										required autofocus />
								</v-form>

								<!-- Reset Password Button -->
								<v-btn
									class="mb-4"
									large block
									color="error"
									v-bind:disabled="email.length === 0 ? true : false || !this.activeCallToAction"
									@click="resetPassword"
									:loading="loadingCallToAction">
									Reset Password
								</v-btn>

								<!-- Never mind, go back -->
								<router-link to="/" style="text-decoration: none">
									<strong>Never mind, go back.</strong>
								</router-link>

							</v-card-text>

						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
</template>

<script>
import moment from 'moment';
import Overture from '../services/Overture';

/* Supress Moment Deprecation Warnings */
moment.suppressDeprecationWarnings = true;

export default {

	data: () => ({

		/* Error Dialog */
		error: false,
		errorMessage: '',

		/* Snackbar */
		/* Search */
		/* Dialogs */
		/* Form Fiels */
		email: '',

		/* Call to Actions */
		loadingCallToAction: false,
		activeCallToAction: true,
		/* Datatables */

		/* Temp. Data */
		validEmail: false,
	}),

	methods: {

		/* Check Email Address */
		checkEmailAddress(){
			if(/\S+@\S+\.\S+/.test(this.email) === false){
				return false;
			} else return true;
		},

		/* Check Email Address */
		checkEmail(email) {

			// if(email) {

			// 	const payload = { Email : email };

			// 	fetch(`${process.env.VUE_APP_API_URL}/account/validateEmail`, {
			// 		mode        : 'cors',
			// 		method      : 'POST',
			// 		cache       : 'no-cache',
			// 		credentials : 'same-origin',
			// 		body        : JSON.stringify(payload),
			// 		headers: {
			// 			'Content-Type' : 'application/json',
			// 			'Language'     : `${navigator.language ? navigator.language : 'en'}`
			// 		}
			// 	})
			// 	.then((res) => {
			// 		return res.json();
			// 	})
			// 	.then((jsonResponse) => {

			// 		if (jsonResponse.Response === false) {

			// 			this.validEmail         = false;
			// 			this.activeCallToAction = false;

			// 		} else {

			// 			this.validEmail         = true;
			// 			this.activeCallToAction = true;
			// 		}

			// 	})
			// 	.catch(console.error);
			// }
		},

		/* Reset Password */
		resetPassword() {

			if(!this.checkEmailAddress()) {

				this.error        = true;
				this.errorMessage = `Invalid email address, try again.`;
				this.$refs.email.focus();

			} else {

				this.loadingCallToAction = true;

				/* Construct Object */
				const payload = { Email: this.email };

				Overture.resetPassword(payload)
				.then((jsonResponse) => {

					if (jsonResponse.Response === true) {

						this.error               = false;
						this.loadingCallToAction = false;
						this.$router.push({ name: 'Login', params: { postMessage: `${jsonResponse.Message}` }});

					} else {

						this.email               = '';
						this.error               = true;
						this.errorMessage        = jsonResponse.Message;
						this.loadingCallToAction = false;
					}
				})
				.catch(console.error);
			}
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

	mounted() {

		/* Detect UA Language */
		if(navigator.language === 'es' ||
			navigator.language === 'es-AR' ||
			navigator.language === 'es-ES' ||
			navigator.language === 'es-US' ||
			navigator.language === 'es-UY' ||
			navigator.language === 'es-MX' ||
			navigator.language === 'es-419') {

			this.$store.dispatch('updateLanguage', {
				Language : 'es',
			});

		} else {

			this.$store.dispatch('updateLanguage', {
				Language : 'en',
			});
		}
	},
}
</script>
