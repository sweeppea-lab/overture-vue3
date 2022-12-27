<template>
	<div>

		<!-- Navigation Bars -->
		<Navbar />

		<v-main>
			<v-container fluid class="pa-8">
				<v-row align="center" justify="center">
					<v-col cols="12">

						<h1 class="pb-5">Proposals</h1>

						<!-- Snackbar -->
						<v-snackbar
							v-model="snackbar"
							:timeout="this.$store.state.SnackbarTimeout"
							:color="snackbarColor">
							{{ snackbarMessage }}
						</v-snackbar>

						<!-- New Proposal -->
						<v-btn
							color="primary"
							class="mb-5 mr-2"
							dark @click="startProposalWizard">
							<v-icon class="mr-2">
								mdi-plus-circle
							</v-icon>
							New Proposal
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
							label="Search Proposals"
							single-line
							outlined clearable
							v-show="showSearchField">
						</v-text-field>

						<!-- Delete Proposal Dialog -->
						<v-dialog v-model="deleteDialog" width="500">
							<v-card>
								<v-card-text class="pa-10 deleteDialogBackground">
									<p class="headline white--text">
										Are you sure you want to delete this proposal and all it's information?
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

						<!-- Create Proposal Wizard Dialog -->
						<v-dialog
							v-model="createProposalWizardDialog"
							fullscreen
							hide-overlay
							persistent
							transition="dialog-top-transition"
							style="height: 100vh; width: 100vw;">

							<v-card persistant >

								<v-toolbar dark color="black" class="rounded-0">

									<!-- Close Button -->
									<v-btn icon dark @click="closeDialogs" color="red">
										<v-icon>
											mdi-close
										</v-icon>
									</v-btn>

									<v-toolbar-title>
										Proposal Wizard
									</v-toolbar-title>

									<v-spacer></v-spacer>

									<div v-if="savedElement">Saved ...</div>

								</v-toolbar>

								<v-card-text class="pa-5">

									<v-expansion-panels
										v-model="panel"
										accordion
										focusable
										class="elevation-0">

										<v-expansion-panel style="background-color: white;">

											<v-expansion-panel-header>
												<strong>General Information</strong>
											</v-expansion-panel-header>

											<v-expansion-panel-content>

												<div class="pt-7">

													<!-- Proposal Name -->
													<v-text-field
														type="text"
														ref="proposalName"
														label="Proposal Name"
														maxlength="100"
														v-model="proposalName"
														@input="proposalName = proposalName.charAt(0).toUpperCase() + proposalName.slice(1);"
														v-on:blur="updateProposal()"
														autofocus filled
														autocomplete="off">
													</v-text-field>

													<!-- Proposal Description or Objectives -->
													<v-textarea
														ref="proposalDescription"
														v-model="proposalDescription"
														filled
														rows="4"
														no-resize
														maxlength="5000"
														counter="5000"
														label="Proposal description ..."
														@input="() => {
															proposalDescription = proposalDescription.charAt(0).toUpperCase() + proposalDescription.slice(1);
															timeUpdate();
														}"
														v-on:blur="updateProposal()"
														autocomplete="off">
													</v-textarea>

													<!-- Proposal Type (Hidden) -->
													<v-select
														v-if="false"
														ref="proposalType"
														v-model="proposalType"
														:items="proposalTypes"
														item-text="Text"
														item-value="Value"
														filled
														v-on:blur="updateProposal()"
														label="Select Proposal Type">
													</v-select>

													<!-- Start/End Dates -->
													<v-row>

													<!-- Expiration Date -->
														<v-col cols="4" >

															<v-menu
																v-model="menuExpirationDate"
																:close-on-content-click="false"
																:nudge-right="40"
																transition="scale-transition"
																offset-y
																min-width="auto">

																<template v-slot:activator="{ on, attrs }">
																	<v-text-field
																		v-model="formatedExpirationDate"
																		label="Proposal Expiration Date"
																		append-icon="mdi-calendar"
																		readonly filled
																		v-bind="attrs"
																		v-on="on"
																		v-on:blur="updateProposal()">
																	</v-text-field>
																</template>

																<v-date-picker
																	v-model="expirationDate"
																	:min="getIsoDateNow()"
																	@input="menuExpirationDate = false">
																</v-date-picker>
															</v-menu>
														</v-col>

														<!-- Start Date -->
														<v-col cols="4" >

															<v-menu
																v-model="menuStartDate"
																:close-on-content-click="false"
																:nudge-right="40"
																transition="scale-transition"
																offset-y
																min-width="auto">

																<template v-slot:activator="{ on, attrs }">
																	<v-text-field
																		v-model="formatedStartDate"
																		label="Sweepstakes Start Date"
																		append-icon="mdi-calendar"
																		readonly filled
																		v-bind="attrs"
																		v-on="on"
																		v-on:blur="updateProposal()">
																	</v-text-field>
																</template>

																<v-date-picker
																	v-model="startDate"
																	:min="getIsoDateNow()"
																	@input="menuStartDate = false">
																</v-date-picker>
															</v-menu>
														</v-col>

														<!-- End Date -->
														<v-col cols="4" >

															<v-menu
																v-model="menuEndDate"
																:close-on-content-click="false"
																:nudge-right="40"
																transition="scale-transition"
																offset-y
																min-width="auto">

																<template v-slot:activator="{ on, attrs }">
																	<v-text-field
																		v-model="formatedEndDate"
																		label="Sweepstakes End Date"
																		append-icon="mdi-calendar"
																		readonly filled
																		v-bind="attrs"
																		v-on="on"
																		v-on:blur="updateProposal()">
																	</v-text-field>
																</template>

																<v-date-picker
																	v-model="endDate"
																	:min="addDays(startDate, 1)"
																	@input="menuEndDate = false">
																</v-date-picker>

															</v-menu>
														</v-col>
													</v-row>

													<!-- Prizes -->
													<v-textarea
														ref="prizeDescription"
														v-model="prizeDescription"
														filled
														rows="4"
														no-resize
														maxlength="5000"
														counter="5000"
														label="Describe prize description here ..."
														@input="() => {
															prizeDescription = prizeDescription.charAt(0).toUpperCase() + prizeDescription.slice(1);
															timeUpdate();
														}"
														v-on:blur="updateProposal()"
														autocomplete="off">
													</v-textarea>

													<!-- US States -->
													<v-select
														ref="selectedStates"
														v-model="selectedStates"
														:items="states"
														filled
														persistent-hint
														multiple
														v-on:change="updateProposal()"
														label="Select US State(s)">
													</v-select>

													<!-- Number of Winners -->
													<v-select
														ref="numberOfWinners"
														v-model="numberOfWinners"
														:items="numberOfWinnersList"
														item-text="Text"
														item-value="Value"
														filled
														v-on:change="updateProposal()"
														label="Select Number of Winner(s) to Draw">
													</v-select>

												</div>

											</v-expansion-panel-content>
										</v-expansion-panel>

										<v-expansion-panel>

											<v-expansion-panel-header>
												<strong>Blocks & Sections</strong>
											</v-expansion-panel-header>

											<v-expansion-panel-content>

												<div class="pt-5">

													<!-- Blocks (Add, Edit, Delete, Pin, Make Visible, Lock) -->
													<v-list>

														<v-list-item-group>

															<v-list-item v-for="(item, index) in blocks" :key="item.Id">

																<v-list-item-title>

																	<!-- Approved by Prospect -->
																	<v-icon class="mr-2" v-if="item.Approved === true" color="green">
																		mdi-checkbox-marked-circle
																	</v-icon>

																	<!-- Not Approved by Prospect -->
																	<v-icon class="mr-2" v-if="item.Approved === false" color="red">
																		mdi-close-circle
																	</v-icon>

																	[{{ index }}] - [block type] - {{ item.Name }}

																</v-list-item-title>

																<v-spacer></v-spacer>

																<!-- Make Visible -->
																<v-btn
																	icon small
																	class="mr-3"
																	v-if="item.Visible === false"
																	@click="makeVisibleInvisibleRow(item.Id, 'invisible')"
																	color="green">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-eye-outline
																			</v-icon>
																		</template>
																		<span>This block is visible to prospect, click to make it invisible.</span>
																	</v-tooltip>
																</v-btn>

																<!-- Make Invisible -->
																<v-btn
																	icon small
																	class="mr-3"
																	v-if="item.Visible === true"
																	@click="makeVisibleInvisibleRow(item.Id, 'visible')"
																	color="red">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-eye-off-outline
																			</v-icon>
																		</template>
																		<span>This block is invisible to prospect, click to make it visible.</span>
																	</v-tooltip>
																</v-btn>

																<!-- Lock or Protect Block -->
																<v-btn
																	icon small
																	class="mr-3"
																	v-if="item.Locked === false"
																	@click="lockUnlockRow(item.Id, 'lock')"
																	color="green">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-lock-outline
																			</v-icon>
																		</template>
																		<span>This block is blocked or protected for prospect, click to unlock.</span>
																	</v-tooltip>
																</v-btn>

																<!-- Unlock or Protect Block -->
																<v-btn
																	icon small
																	class="mr-3"
																	v-if="item.Locked === true"
																	@click="lockUnlockRow(item.Id, 'unlock')"
																	color="red">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-lock-open-variant-outline
																			</v-icon>
																		</template>
																		<span>This block is unlocked for prospect, click to lock.</span>
																	</v-tooltip>
																</v-btn>

																<!-- Conversations -->
																<v-btn
																	icon small
																	class="mr-3"
																	@click="openBlockConversation(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-chat-processing-outline
																			</v-icon>
																			<v-badge
																				color="pink"
																				dot overlap>
																			</v-badge>
																		</template>
																		<span>Conversations</span>
																	</v-tooltip>
																</v-btn>

																<!-- Notes -->
																<v-btn
																	icon small
																	class="mr-3"
																	@click="openBlockNotes(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-list-box-outline
																			</v-icon>
																			<v-badge
																				color="pink"
																				dot overlap>
																			</v-badge>
																		</template>
																		<span>Notes</span>
																	</v-tooltip>
																</v-btn>

																<!-- Files -->
																<v-btn
																	icon small
																	class="mr-3"
																	@click="openBlockFiles(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-file-document-outline
																			</v-icon>
																			<v-badge
																				color="pink"
																				dot overlap>
																			</v-badge>
																		</template>
																		<span>Files</span>
																	</v-tooltip>
																</v-btn>

																<!-- Settings -->
																<!-- 1. Notify user when updating block -->
																<!-- 2. Notify admin when updaging block -->
																<!-- 3. Notification method (sms, email, both) -->
																<v-btn
																	icon small
																	class="mr-8"
																	@click="rowSettings(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-cog
																			</v-icon>
																		</template>
																		<span>Block Settings</span>
																	</v-tooltip>
																</v-btn>

																<!-- Add New Row -->
																<v-btn
																	icon small
																	class="mr-3"
																	@click="false"
																	color="green"
																	v-if="getRowPosition(item.Id) === 'last'">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-plus-box
																			</v-icon>
																		</template>
																		<span>Add New Block</span>
																	</v-tooltip>
																</v-btn>

																<!-- Move Up -->
																<v-btn
																	icon small
																	class="mr-3"
																	:disabled="index === 0"
																	@click="moveRowUp(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-chevron-up
																			</v-icon>
																		</template>
																		<span>Move Up</span>
																	</v-tooltip>
																</v-btn>

																<!-- Move Down -->
																<v-btn
																	icon small
																	class="mr-3"
																	:disabled="index === blocks.length - 1"
																	@click="moveRowDown(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-chevron-down
																			</v-icon>
																		</template>
																		<span>Move Down</span>
																	</v-tooltip>
																</v-btn>

																<!-- Edit Icon -->
																<v-btn
																	icon small
																	class="mr-3"
																	@click="editRowDialog(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-pencil
																			</v-icon>
																		</template>
																		<span>Edit Block</span>
																	</v-tooltip>
																</v-btn>

																<!-- Delete Icon -->
																<v-btn
																	icon small
																	color="pink"
																	@click="deleteRow(item.Id)">
																	<v-tooltip bottom>
																		<template v-slot:activator="{ on, attrs }">
																			<v-icon v-bind="attrs" v-on="on">
																				mdi-trash-can-outline
																			</v-icon>
																		</template>
																		<span>Delete Block</span>
																	</v-tooltip>
																</v-btn>

															</v-list-item>
														</v-list-item-group>
													</v-list>

												</div>

											</v-expansion-panel-content>
										</v-expansion-panel>

										<v-expansion-panel>

											<v-expansion-panel-header>
												<strong>Settings & More</strong>
											</v-expansion-panel-header>

											<v-expansion-panel-content>

												<div class="pt-5">

													(*) Payment Method (processor, cash, uscheck, ACH)<br>
													(*) Prospect must pay first to approve proposal<br>
													(*) Open a sweeppea Account once approved<br>
													(*) Send notifications 3, 2, 1 days before proposal expiration<br>
													(*) What to do once proposal expires (delete, archive)

												</div>

											</v-expansion-panel-content>
										</v-expansion-panel>

									</v-expansion-panels>

								</v-card-text>
							</v-card>
						</v-dialog>

						<!-- Preview Proposal Dialog -->
						<v-dialog
							v-model="previewProposalDialog"
							fullscreen
							hide-overlay
							persistent
							transition="dialog-top-transition"
							style="height: 100vh; width: 100vw;">

							<v-card persistant>

								<v-toolbar dark color="black" class="rounded-0">

									<!-- Close Button -->
									<v-btn icon dark @click="closeDialogs" color="red">
										<v-icon>
											mdi-close
										</v-icon>
									</v-btn>

									<v-toolbar-title>
										Preview Proposal
									</v-toolbar-title>

									<v-spacer></v-spacer>

								</v-toolbar>

								preview proposal dialog as documen (render)

							</v-card>
						</v-dialog>

						<!-- Datatable -->
						<v-data-table
							:headers="headers"
							:items="proposalsArray"
							:items-per-page="itemsPerPage"
							:search="search"
							:loading="loadingDatatable"
							:multi-sort="true"
							:footer-props="{'items-per-page-options': [-1, 10, 25, 50, 100, 500]}"
							@update:items-per-page="setDTItemsPerPage('Proposals', $event)">

							<!-- Proposal Name -->
							<template v-slot:item.ProposalName="{ item }">
								<v-icon class="mr-1" small color="red" v-if="item.Pinned">
									mdi-pin
								</v-icon>
								{{ item.Metadata.ProposalName }}
							</template>

							<!-- Expiration Date -->
							<template v-slot:item.ExpirationDate="{ item }">
								{{ item.Metadata.ExpirationDate }}
							</template>

							<!-- Approved -->
							<template v-slot:item.Approved="{ item }">
								<v-chip
									label small
									v-if="item.Approved === true"
									color="success">
									Yes
								</v-chip>
								<v-chip
									label small
									v-if="item.Approved === false"
									color="error">
									No
								</v-chip>
							</template>

							<!-- Status -->
							<template v-slot:item.Status="{ item }">
								<v-chip
									label small
									v-if="item.Status === true"
									color="success">
									Published
								</v-chip>
								<v-chip
									label small
									v-if="item.Status === false"
									color="warning">
									Draft
								</v-chip>
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

										<!-- Preview Proposal -->
										<v-list-item @click="previewProposal(item.ProposalToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-eye
												</v-icon>
												Preview
											</v-list-item-title>
										</v-list-item>

										<!-- Edit Proposal -->
										<v-list-item @click="editProposal(item.ProposalToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-pencil
												</v-icon>
												Edit
											</v-list-item-title>
										</v-list-item>

										<v-divider></v-divider>

										<!-- Pin Proposal -->
										<v-list-item @click="pinProposal(item.ProposalToken)" v-if="item.Pinned === false">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-pin
												</v-icon>
												Pin Proposal
											</v-list-item-title>
										</v-list-item>

										<!-- Remove Pin -->
										<v-list-item @click="removePin(item.ProposalToken)" v-if="item.Pinned === true">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-pin-off
												</v-icon>
												Remove Pin
											</v-list-item-title>
										</v-list-item>

										<!-- Clone Proposal -->
										<v-list-item @click="cloneProposal(item.ProposalToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-content-duplicate
												</v-icon>
												Clone
											</v-list-item-title>
										</v-list-item>

										<!-- Archive Proposal -->
										<v-list-item @click="archiveProposal(item.ProposalToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-archive-outline
												</v-icon>
												Archive
											</v-list-item-title>
										</v-list-item>

										<!-- Download Proposal -->
										<v-list-item @click="downloadProposal(item.ProposalToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-monitor-arrow-down-variant
												</v-icon>
												Download PDF
											</v-list-item-title>
										</v-list-item>

										<!-- Share Proposal -->
										<v-list-item @click="shareProposal(item.ProposalToken)">
											<v-list-item-title>
												<v-icon class="mr-2">
													mdi-share
												</v-icon>
												Share
											</v-list-item-title>
										</v-list-item>

										<v-divider></v-divider>

										<!-- Delete Proposal -->
										<v-list-item @click="deleteItemConfirmation(item.ProposalToken)">
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
import { formatDate } from '../includes/functions.js';
import Renaissance from '../services/Renaissance';

/* Supress Moment Deprecation Warnings */
moment.suppressDeprecationWarnings = true;

export default {

	components: {
		Navbar,
		Footer
	},

	data: () => ({

		/* Expose Custom Functions */

		/* Error Dialog */
		error: false,
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
		deleteDialog: false,
		createProposalWizardDialog: false,
		previewProposalDialog: false,
		menuExpirationDate: false,
		menuStartDate: false,
		menuEndDate: false,

		/* Form Fields */
		proposalName: null,
		proposalDescription: null,
		proposalType: null,
		proposalTypes: [],

		expirationDate: null,
		formatedExpirationDate: null,
		startDate: null,
		formatedStartDate: null,
		endDate: null,
		formatedEndDate: null,

		prizeDescription: null,
		selectedStates: [],
		states: [],
		numberOfWinners: 1,
		numberOfWinnersList: Array.from({length: 500}, (_, i) => i + 1),
		blocks: [
			{ Id: 1, Name: 'Block #1', Icon: 'mdi-clock', Visible: true, Locked: false, Approved: false, ApprovalDateTime: null, },
			{ Id: 2, Name: 'Block #2', Icon: 'mdi-account', Visible: true, Locked: true, Approved: true, ApprovalDateTime: null, },
			{ Id: 3, Name: 'Block #3', Icon: 'mdi-flag', Visible: false, Locked: false, Approved: true, ApprovalDateTime: null, },
			{ Id: 4, Name: 'Block #4', Icon: 'mdi-heart', Visible: true, Locked: false, Approved: false, ApprovalDateTime: null, },
			{ Id: 5, Name: 'Block #5', Icon: 'mdi-account-group', Visible: true, Locked: false, Approved: false, ApprovalDateTime: null, },
		],

		/* Call to Actions */
		saveButton: true,
		loadingCallToAction: false,

		/* Datatables */
		headers: [
			{ text: `Proposal Name`, align: 'left', value: 'ProposalName', sortable: true, width: '73%' },
			{ text: 'Expiration Date', align: 'left', value: 'ExpiratioDate', sortable: false, width: '12%' },
			{ text: 'Approved', align: 'left', value: 'Approved', sortable: false, width: '5%' },
			{ text: 'Status', align: 'left', value: 'Status', sortable: false, width: '9%' },
			{ text: '', align: 'end', value: 'Actions', sortable: false, width: '1%' },
		],

		loadingDatatable: false,
		itemsPerPage: null,
		proposalsArray: [],
		panel: [0],

		/**
		 *
			{ ProposalToken: '123', ProposalName: 'Proposal Demo 1', ExpiratioDate: '12/12/2024 12:30pm', Pinned: false, Approved: true, Status: true },
			{ ProposalToken: '123', ProposalName: 'Proposal Demo 2', ExpiratioDate: '12/12/2024 12:30pm', Pinned: false, Approved: false, Status: true },
			{ ProposalToken: '123', ProposalName: 'Proposal Demo 2', ExpiratioDate: '12/12/2024 12:30pm', Pinned: true, Approved: false, Status: true },
		*
		**/

		/* Temp. Data */
		itemIDToDelete: null,
		editedIndex: null,
		savedElement: false,

		timeoutRunning: null,

		/* Archived Sweepstakes */
	}),

	watch: {

		createProposalWizardDialog : function(newValue) {

			if(!newValue){

				// Closing
				this.updateProposal()
			}
		},

		expirationDate: function(value) {

			this.formatedExpirationDate = formatDate(value, this.$store.state.Language, this.$store.state.DateFormat, this.$store.state.TimeFormat);
		},

		startDate: function(value) {

			this.formatedStartDate = formatDate(value, this.$store.state.Language, this.$store.state.DateFormat, this.$store.state.TimeFormat);
		},

		endDate: function(value) {

			this.formatedEndDate = formatDate(value, this.$store.state.Language, this.$store.state.DateFormat, this.$store.state.TimeFormat);
		}
	},

    methods: {

		/* Set DataTable ItemsPerPage */
		setDTItemsPerPage(_component, _value) {

			localStorage.setItem('Overture-ItemsPerPage-Proposals', _value);
			this.itemsPerPage = _value;
		},

		onOffSearch() {

			this.showSearchField === false ? this.showSearchField = true : this.showSearchField = false;
			this.showSearchField === false ? this.magnifyIcon = 'mdi-magnify' : this.magnifyIcon = 'mdi-magnify-minus-outline';
			this.showSearchField === false ? this.search = '' : this.search = '';
			this.showSearchField === true ? this.$nextTick(this.$refs.searchField.focus) : false;
		},

		reloadTable() {

			/* Fetch All Proposals */
			this.fetchAllProposals();
		},

		closeDialogs() {

			if(this.timeoutRunning) {

				clearTimeout(this.timeoutRunning);
				this.timeoutRunning = null;
			}

			this.deleteDialog		        = false;
			this.previewProposalDialog      = false;
			this.createProposalWizardDialog = false;
			this.loadingCallToAction        = false;
			this.itemIDToDelete             = null;
		},

		/* Fetch All Proposals */
		fetchAllProposals() {

			this.loadingDatatable = true;
			this.proposalsArray   = [];

			Overture.fetchAllProposals()
			.then(jsonResponse => {

				this.proposalsArray   = [...jsonResponse.ProposalsArray];
				this.loadingDatatable = false;
			})
			.catch((error) => {

				/* Clear and Close */
				this.closeDialogs();

				/* Show Error Message */
				this.snackbar        = true;
				this.snackbarColor   = 'error';
				this.snackbarMessage = error;
			});
		},

		startProposalWizard() {

			/* Fetch Block Library */

			/* Create Draft */
			this.createDraftProposal();

			/* Clear All Fields */
			this.proposalDescription 	= null;
			this.proposalType        	= null;
			this.proposalTypes       	= [];
			this.expirationDate      	= null;
			this.startDate           	= null;
			this.endDate             	= null;
			this.formatedExpirationDate = null;
			this.formatedStartDate		= null;
			this.formatedEndDate		= null;
			this.prizeDescription    	= null;
			this.selectedStates       	= [];
			this.numberOfWinners     	= 1;
			this.blocks              	= [
				{ Id: 1, Name: 'Block #1', Icon: 'mdi-clock', Visible: true, Locked: false, Approved: false, ApprovalDateTime: null, },
				{ Id: 2, Name: 'Block #2', Icon: 'mdi-account', Visible: true, Locked: true, Approved: true, ApprovalDateTime: null, },
				{ Id: 3, Name: 'Block #3', Icon: 'mdi-flag', Visible: false, Locked: false, Approved: true, ApprovalDateTime: null, },
				{ Id: 4, Name: 'Block #4', Icon: 'mdi-heart', Visible: true, Locked: false, Approved: false, ApprovalDateTime: null, },
				{ Id: 5, Name: 'Block #5', Icon: 'mdi-account-group', Visible: true, Locked: false, Approved: false, ApprovalDateTime: null, },
			];

			/* Open Wizard */
			this.createProposalWizardDialog = true;
		},

		createDraftProposal() {

			/**
			* The logic behind the proposal wizard will be that it will always be editing a proposal. The only difference between creating
			* and editing one is that in the first case, when the wizards open it creates a draft.
			**/

			/* Create Proposal Name */
			const proposalName = `New Proposal #${Math.floor(10000 + Math.random() * 90000)}`;

			/* Construct Payload */
			const payload = {
				UserToken    : this.$store.state.UserToken,
				ProposalName : proposalName,
			};

			Overture.createProposal(payload)
			.then((jsonResponse) => {

				this.proposalToken = jsonResponse.ProposalToken;
				this.proposalName  = proposalName;

				/* Fetch All Prospects */
				this.fetchAllProposals();
			});
		},

		async fetchSingleProposal(_proposalToken){

			return Overture.fetchSingleProposal(_proposalToken)
			.then((jsonResponse) => {

				this.proposalName        	= jsonResponse.Metadata.ProposalName;
				this.proposalDescription 	= jsonResponse.Metadata.ProposalDescription;
				this.formatedExpirationDate = jsonResponse.Metadata.ExpirationDate;
				this.formatedStartDate      = jsonResponse.Metadata.StartDate;
				this.formatedEndDate        = jsonResponse.Metadata.EndDate;
				this.expirationDate			= this.formatIsoDate(jsonResponse.Metadata.ExpirationDate);
				this.startDate				= this.formatIsoDate(jsonResponse.Metadata.StartDate);
				this.endDate				= this.formatIsoDate(jsonResponse.Metadata.EndDate);
				this.prizeDescription    	= jsonResponse.Metadata.PrizeDescription;
				this.selectedStates       	= jsonResponse.Metadata.SelectedStates;

			});
		},

		editProposal(_proposalToken) {

			this.proposalToken = _proposalToken;

			this.fetchSingleProposal(_proposalToken)
			.then(() => {

				this.createProposalWizardDialog = true;
			});
		},

		updateProposal() {

			/**
			 * Function called every time we have to update the proposal.
			 * The logic now is that it updates every time a field loses focus.
			 * We can add a cron/timer also.
			 **/

			this.savedElement = true;

			/* Construct Payload */
			const payload = {
				ProposalToken 		: this.proposalToken,
				Metadata 			: {
					ProposalName 		: this.proposalName,
					ProposalDescription : this.proposalDescription,
					ExpirationDate		: new Date(this.formatedExpirationDate),
					StartDate 			: new Date(this.formatedStartDate),
					EndDate 			: new Date(this.formatedEndDate),
					PrizeDescription 	: this.prizeDescription,
					SelectedStates 		: this.selectedStates
				}
			};

			Overture.updateProposal(payload)
			.then((response) => {

				console.log('Updated...');

				/* Wait 1 Sec. and Clear Message */
				setTimeout(() => {

					this.savedElement = false;

				}, 1000);

				// console.log('Succesfully updated proposal', this.proposalToken, response); // Debug purpose

				this.fetchAllProposals(); // Instead of fetching all proposals we can update the table based on the fields that we know that were updated so we can save a request.
			})
			.catch((error) => {

				/* Wait 1 Sec. and Clear Message */
				setTimeout(() => {

					this.savedElement = false;

				}, 1000);

				console.log(error);
			});
		},

		deleteItemConfirmation(_proposalToken) {

			this.itemIDToDelete = _proposalToken;
			this.deleteDialog   = true;
		},

		deleteItem(_proposalToken) {

			this.loadingCallToAction = true;

			Overture.deleteProposal({ ProposalToken : _proposalToken })
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Show Confirmation Message */
					this.snackbar            = true;
					this.snackbarColor       = 'success';
					this.snackbarMessage     = jsonResponse.Message;

					/* Fetch All Prospects */
					this.fetchAllProposals();

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
		},

		timeUpdate() {

			if(this.timeoutRunning) {
				return;
			}

			this.timeoutRunning = setTimeout(() => {

				/* Update Proposal */
				this.updateProposal();

				this.timeoutRunning = null;

			}, 10000);
		},

		getRowPosition(_id) {

		},

		moveRowUp(_id) {

		},

		moveRowDown(_id) {

		},

		editRowDialog(_id) {

		},

		deleteRow(_id) {

		},

		makeVisibleInvisibleRow(_id, _action) {

		},

		lockUnlockRow(_id, _action) {

		},

		rowSettings(_id) {

			/* Can Have Conversations */
			// ...
		},

		openBlockNotes(_id) {

		},

		openBlockFiles(_id) {

		},

		openBlockConversation(_id) {

		},

		getIsoDateNow() {

			const date = new Date();
			return date.toISOString();
		},

		addDays(_date, _days) {

			let result = new Date(_date);

			result.setDate(result.getDate() + _days);

			return result.toISOString();
		},

		formatIsoDate(_date) {

			if(!_date) return null;

			const res = new Date(_date);

			return res.toISOString();
		},

		fetchStates() {

			Renaissance.getStates().then((response) => {

				this.states = response.Data.map(state => state.Name);
			});
		}
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

	created() {

		/* Set DataTable Items Per Page */
		if(!localStorage.getItem('Overture-ItemsPerPage-Proposals')) {

			localStorage.setItem('Overture-ItemsPerPage-Proposals', 25);
			this.itemsPerPage = 25;

		} else {

			this.itemsPerPage = parseInt(localStorage.getItem('Overture-ItemsPerPage-Proposals'));
		}

		/* Fetch All Proposals */
		this.fetchAllProposals();

		/* Fetch States from Reinassence */
		this.fetchStates();
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

<style scoped>
.v-expansion-panel::before {
	box-shadow: none !important;
}
</style>
