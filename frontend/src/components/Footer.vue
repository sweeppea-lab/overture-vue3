<template>

	<v-footer :inset="footer.inset" app class="pa-4">

		<!-- Snackbar -->
		<v-snackbar
			v-model="snackbar"
			:timeout="this.$store.state.SnackbarTimeout"
			:color="snackbarColor">
			{{ snackbarMessage }}
		</v-snackbar>

		<!-- Copyright -->
		<span class="px-2 overline"><small>{{ this.$store.state.FooterCopyright }} v1.{{ new Date().getMonth()+1 }}.{{ new Date().getFullYear().toString().substr(-2) }}</small></span>

		<!-- <span class="px-2 overline">
			<small>{{ this.$store.state.FooterCopyright }} {{ new Date().getFullYear() }}</small>
		</span> -->

		<v-spacer></v-spacer>

		<!-- Admin Sign -->
		<v-chip
			v-if="this.$store.state.UserType === 3"
			class="mr-2"
			color="red"
			label text-color="white"
			small>
			<v-icon small left>
				mdi-shield-account
			</v-icon>
			Admin
		</v-chip>

		<!-- Regular User Sign -->
		<v-chip
			v-if="this.$store.state.UserType === 1"
			class="mr-2"
			color="primary"
			label text-color="white"
			small>
			<v-icon small left>
				mdi-account
			</v-icon>
			User
		</v-chip>

		<!-- Sub-User Sign -->
		<v-chip
			v-if="this.$store.state.UserType === 2"
			class="mr-2"
			color="warning"
			label text-color="white"
			small>
			<v-icon small left>
				mdi-account
			</v-icon>
			Sub-User
		</v-chip>

		<!-- Local Instance (only admins can see this) -->
		<v-chip
			v-if="this.$store.state.Environment === 'localhost' && this.$store.state.UserType === 3"
			class="mr-2"
			color="error"
			label text-color="white"
			small>
			<v-icon small left>
				mdi-application-cog
			</v-icon>
			Localhost
		</v-chip>

		<!-- Development Instance (only admins can see this) -->
		<v-chip
			v-if="this.$store.state.Environment === 'development' && this.$store.state.UserType === 3"
			class="mr-2"
			color="warning"
			label text-color="white"
			small>
			<v-icon small left>
				mdi-application-cog
			</v-icon>
			Development
		</v-chip>

		<!-- Production Instance (only admins can see this) -->
		<v-chip
			v-if="this.$store.state.Environment === 'production' && this.$store.state.UserType === 3"
			class="mr-2"
			color="success"
			label text-color="white"
			small>
			<v-icon small left>
				mdi-application-cog
			</v-icon>
			Production
		</v-chip>

	</v-footer>
</template>

<script>
import moment from 'moment';

/* Supress Moment Deprecation Warnings */
moment.suppressDeprecationWarnings = true;

export default {

	name: 'Footer',

	data: () => {

		return {

			/* Error Dialog */
			/* Snackbar */
			snackbar: false,
			snackbarMessage: '',
			snackbarColor: 'success',

			/* Search */
			/* Dialogs */
			/* Form Fiels */
			/* Call to Actions */
			/* Datatables */

			/* Temp. Data */
			darkModeIcon: 'mdi-lightbulb-off',
			iconDisabled: false,
			footer: { inset: false }
		}
	}

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
}
</script>

<style scoped>
.v-expansion-panel::before {
	box-shadow: none;
}
</style>
