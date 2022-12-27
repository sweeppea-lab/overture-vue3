<template>
	<div>

		<!-- Navigation Bars -->
		<Navbar />

		<v-main>
			<v-container fluid class="pa-8">
				<v-row align="center" justify="center">
					<v-col cols="12">

						<h1>Settings</h1>

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
		/* Snackbar */
		/* Search */
		/* Dialogs */
		/* Form Fiels */
		/* Call to Actions */
		/* Datatables */
		/* Temp. Data */
	}),

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

	created() {

		/* Set CurrentPage in VUEX Store */
		this.$store.dispatch('setCurrentPage', { Page : 'settings' });

		/* If no Sweepstakes Selected, redirect */
		if(!this.$store.state.SweepstakesToken || !localStorage.getItem('__wsp-stk') || !localStorage.getItem('__wsp-nme')) {
			this.$router.push({ name: 'Sweepstakes', params: { postMessage: `Reminder. Ensure a sweepstakes is selected.` }});
		}
	},
}
</script>
