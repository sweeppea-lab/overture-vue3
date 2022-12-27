<template>
    <div>

      <!-- Navigation Bars -->
      <Navbar />

      <v-main>
        <v-container fluid class="pa-8">
          <v-row align="center" justify="center">
            <v-col cols="12">

              <h1 class="pb-5">Blocks Library</h1>

              <!-- Snackbar -->
              <v-snackbar
                v-model="snackbar"
                :timeout="this.$store.state.SnackbarTimeout"
                :color="snackbarColor">
                {{ snackbarMessage }}
              </v-snackbar>

              <!-- New Block -->
              <v-btn
                color="primary"
                class="mb-5 mr-2"
                dark @click="openCreateNewBlockDialog">
                <v-icon class="mr-2">
                  mdi-plus-circle
                </v-icon>
                New Block
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

              <!-- Delete Block Dialog -->
              <v-dialog v-model="deleteBlockDialog" width="500">
                <v-card>
                  <v-card-text class="pa-10 deleteDialogBackground">
                    <p class="headline white--text">
                      Are you sure you want to delete this block from the library?
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

              <!-- New Block Dialog -->
              <v-dialog v-model="openBlockDialog" width="unset" persistent scrollable>
                <v-card min-width="750">

                  <v-card-title class="headline black lighten-1 white--text" primary-title>
                    <v-icon class="pr-4" color="white">
                      mdi-format-line-style
                    </v-icon>
                    {{ interactionNames[interaction] }}
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

                      <!-- Block Type -->
                      <v-select
                        ref="blockType"
                        v-model="blockType"
                        item-text="item.Text"
                        :items="blocksTypes"
                        v-on:change="this.cleanFields"

                        item-value="Value"
                        filled outlined
                        :disabled="interaction !== 2"
                        label="Select Block Type"
                        append-icon="mdi-format-line-style">
                      </v-select>

                      <!-- Block Name -->
                      <v-text-field
                        type="text"
                        ref="blockName"
                        label="Block Name"
                        maxlength="100"
                        v-model="blockName"
                        :disabled="!interaction"
                        @input="blockName = blockName.charAt(0).toUpperCase() + blockName.slice(1);"
                        autofocus filled
                        autocomplete="off"
                        append-icon="mdi-form-textbox">
                      </v-text-field>

                      <!-- Block Data (plain text multiline) -->
                      <v-textarea
                        v-if="blockType === 1 || blockType === 6 || blockType === 8 || blockType === 10"
                        ref="blockData"
                        v-model="blockData"
                        filled
                        :disabled="!interaction"
                        rows="7"
                        no-resize
                        maxlength="5000"
                        counter="5000"
                        label="Enter block data or instructions here (optional) ..."
                        @input="blockData = blockData.charAt(0).toUpperCase() + blockData.slice(1);"
                        autocomplete="off">
                      </v-textarea>

                      <!-- Block Data (plain text single line) -->
                      <v-text-field
                        v-if="blockType === 3"
                        type="text"
                        ref="blockData"
                        label="Enter text here ..."
                        maxlength="500"
                        v-model="blockData"
                        :disabled="!interaction"
                        filled
                        autocomplete="off"
                        append-icon="mdi-text">
                      </v-text-field>

                      <!-- Block Data (html only) -->
                      <ckeditor
                        v-if="blockType === 2"
                        ref="blockDataHTML"
                        :disabled="!interaction"
                        v-model="blockDataHTML"
                        :config="editorConfig"
                        :editor="editor">
                      </ckeditor>

                      <div v-if="blockType === 2" class="pt-7"></div>

                      <!-- Text Color -->
                      <span v-if="blockType === 1 || blockType === 3">
                        <strong>
                          <p>Text Color</p>
                        </strong>
                      </span>

                      <v-slider
                        v-if="blockType === 1 || blockType === 3"
                        v-model="textColor"
                        :color="colors[textColor].Value"
                        @change="onChangeColor"
                        :label="colors[textColor].Text"
                        step="1"
                        :disabled="!interaction"
                        :max="this.colors.length - 1"
                        ticks="always"
                        tick-size="4">
                      </v-slider>

                      <!-- Text Size -->
                      <span v-if="blockType === 1 || blockType === 3">
                        <strong>
                          <p>Text Size</p>
                        </strong>
                      </span>

                      <v-slider
                        v-if="blockType === 1 || blockType === 3"
                        v-model="textSize"
                        @change="onChangeSize"
                        step="50"
                        ticks="always"
                        :disabled="!interaction"
                        tick-size="4">
                      </v-slider>

                      <!-- Text Format/Orientation -->
                      <v-select
                        v-if="blockType === 1 || blockType === 3"
                        ref="textFormatOrientation"
                        v-model="textFormatOrientation"
                        :items="textFormats"
                        item-text="Text"
                        :disabled="!interaction"
                        item-value="Value"
                        filled outlined
                        label="Select Text Format/Orientation"
                        append-icon="mdi-format-align-center">
                      </v-select>

                      <!-- Upload Image -->

                      <!-- Image URL -->
                      <v-text-field
                        v-if="blockType === 4"
                        type="text"
                        ref="imageURL"
                        label="Image URL"
                        :disabled="!interaction"
                        maxlength="100"
                        v-model="imageURL"
                        @input="imageURL = imageURL"
                        filled
                        autocomplete="off"
                        append-icon="mdi-image-frame">
                      </v-text-field>

                      <!-- Video URL -->
                      <v-text-field
                        v-if="blockType === 5"
                        type="text"
                        ref="videoURL"
                        :disabled="!interaction"
                        label="Video URL"
                        maxlength="100"
                        v-model="videoURL"
                        @input="videoURL = videoURL"
                        filled
                        autocomplete="off"
                        append-icon="mdi-youtube">
                      </v-text-field>

                      <!-- Image/Video Preview from URL -->
                      <v-flex shrink>

                        <!-- Image Preview -->
                        <v-img
                          v-if="blockType === 4 && imageURL"
                          :src="imageURL"
                          max-width="100%"
                          justify="center">
                        </v-img>

                        <!-- Youtube Video Preview -->
                        <iframe width="100%" height="400"
                          v-if="blockType === 5 && videoURL && videoURL.includes('youtube.com')"
                          :src=" getYoutubeEmbed() "
                          controls
                          allowFullScreen>
                        </iframe>

                      </v-flex>

                      <!-- Quantity -->
                      <v-select
                        v-if="blockType === 8"
                        ref="quantity"
                        label="Quantity"
                        :disabled="!interaction"
                        :items="Array.from({length: 100}, (_, n) => n + 1)"
                        v-model="quantity"
                        filled
                        append-icon="mdi-counter">
                      </v-select>

                      <!-- Fixed Cost -->
                      <v-text-field
                        v-if="blockType === 8"
                        type="number"
                        ref="fixedCost"
                        label="Fixed Cost"
                        max="99999"
                        min="0"
                        :disabled="!interaction"
                        v-model="fixedCost"
                        filled
                        @keydown.space.prevent
                        @keypress="onlyNumbers"
                        autocomplete="off"
                        append-icon="mdi-currency-usd">
                      </v-text-field>

                      <!-- Cost per Unit -->
                      <v-text-field
                        v-if="blockType === 8"
                        type="number"
                        ref="costPerUnit"
                        label="Cost per Unit"
                        v-model="costPerUnit"
                        :disabled="!interaction"
                        max="99999"
                        min="0"
                        filled
                        @keydown.space.prevent
                        @keypress="onlyNumbers"
                        autocomplete="off"
                        append-icon="mdi-currency-usd">
                      </v-text-field>

                      <!-- Discount Value as Fixed amount -->
                      <v-text-field
                        v-if="blockType === 8 && discountType === 2"
                        type="number"
                        ref="discountValue"
                        label="Discount Value"
                        min="1"
                        :max="costPerUnit"
                        v-model="discountValue"
                        :disabled="!interaction"
                        filled
                        @keydown.space.prevent
                        @keypress="onlyNumbers"
                        autocomplete="off"
                        append-icon="mdi-numeric">
                      </v-text-field>

                      <!-- Discount Value as a percentage -->
                      <v-select
                        v-if="blockType === 8 && discountType === 1"
                        ref="discountValue"
                        label="Discount Value"
                        :disabled="!interaction"
                        :items="Array.from(Array(100).keys())"
                        v-model="discountValue"
                        filled
                        append-icon="mdi-numeric">
                      </v-select>

                      <!-- Discount Type/Metric -->
                      <v-select
                        v-if="blockType === 8"
                        ref="discountType"
                        v-model="discountType"
                        :items="discountTypes"
                        item-text="Text"
                        :disabled="!interaction"
                        item-value="Value"
                        filled outlined
                        label="Select Discount Type"
                        append-icon="mdi-cart-percent">
                      </v-select>

                      <!-- --------------------- Data Table ------------------- -->
                      <v-template v-if="blockType === 9" >
                        <template>

                          <!-- Set Columns -->
                          <v-btn
                            v-if="interaction"
                            color="primary"
                            dark class="mr-2"
                            @click="columnsDialog = true; isEditingItem = false;">
                            <v-icon small class="mr-2">
                              mdi-table-column-plus-after
                            </v-icon>
                            Columns
                          </v-btn>

                          <!-- Add Item -->
                          <v-btn
                            v-if="interaction"
                            :disabled="!customTableHeaders.length || customTableItems.length > 50"
                            color="primary"
                            dark
                            @click="addItemDialog = true; isEditingItem = false;">
                            <v-icon small class="mr-2">
                              mdi-table-row-plus-after
                            </v-icon>
                            Rows
                          </v-btn>

                          <!-- --------- Columns dialog -------- -->
                          <v-dialog v-model="columnsDialog" width="500">

                            <v-card>

                              <v-card-title class="headline black lighten-1 white--text" primary-title>
                                <v-icon class="pr-2" color="white">
                                  mdi-table-column-plus-after
                                </v-icon>
                                Add Columns
                                <v-spacer></v-spacer>
                                <v-btn icon @click="columnsDialog = false" color="red">
                                  <v-icon>
                                    mdi-close
                                  </v-icon>
                                </v-btn>
                              </v-card-title>

                              <v-card-text class="pt-8">

                                <!-- Warning -->
                                <v-alert type="warning" v-if="!temporaryTableHeaders.length">
                                  There are no columns to display. Please add some columns.
                                </v-alert>

                                <v-container class="pr-15" v-for="(header, index) in temporaryTableHeaders" :key="index">

                                  <v-row>

                                    <v-col cols="11">

                                      <!-- Column Title -->
                                      <v-text-field
                                        filled
                                        label="Column Title"
                                        :value="header.text"
                                        v-model="temporaryTableHeaders[index].text">
                                      </v-text-field>
                                    </v-col>

                                    <v-col cols="1">

                                      <!-- Delete Column -->
                                      <v-btn
                                        dark class="mt-3"
                                        color="error"
                                        @click="temporaryTableHeaders.splice(index, 1);">
                                        <v-icon>
                                          mdi-trash-can
                                        </v-icon>
                                      </v-btn>
                                    </v-col>

                                  </v-row>
                                </v-container>
                              </v-card-text>

                              <v-card-actions class="pb-10 pr-8">

                                <v-spacer></v-spacer>

                                <!-- New Column -->
                                <v-btn
                                  v-if="temporaryTableHeaders.length < 10"
                                  color="primary"
                                  dark large
                                  @click="addHeader">
                                  <v-icon class="mr-2">
                                    mdi-plus-circle
                                  </v-icon>
                                  New Column
                                </v-btn>

                                <!-- Save -->
                                <v-btn
                                  v-if="temporaryTableHeaders.length > 0"
                                  color="success"
                                  dark large
                                  @click="columnsDialog = false; customTableHeaders = temporaryTableHeaders">
                                  <v-icon class="mr-2">
                                    mdi-checkbox-marked-circle
                                  </v-icon>
                                  Save Changes
                                </v-btn>

                              </v-card-actions>
                            </v-card>
                          </v-dialog>

                          <!-- --------- Item dialog -------- -->
                          <v-dialog
                            v-model="addItemDialog"
                            width="500">

                            <v-card align="center">

                              <v-card-title class="headline black lighten-1 white--text mb-5" primary-title>

                                <v-icon
                                  class="pr-3"
                                  color="white">
                                    mdi-table-row-plus-after
                                </v-icon>

                                {{isEditingItem ? 'Update Cells' : 'Add Cells'}}

                                <v-spacer></v-spacer>

                                <v-btn icon @click="addItemDialog = false" color="red">
                                  <v-icon>
                                    mdi-close
                                  </v-icon>
                                </v-btn>
                              </v-card-title>

                              <v-card-text class="pt-8">

                                <v-container v-for="(header, index) in customTableHeaders" :key="index">
                                  <v-row>
                                    <!-- Editable Text Field -->
                                    <v-text-field
                                      class="mr-3 ml-3"
                                      :label="header.text"
                                      :value="isEditingItem ? temporaryItem[header.value] : null"
                                      v-model="temporaryItem[header.value]"
                                      filled>
                                    </v-text-field>
                                  </v-row>
                                </v-container>

                                <!-- Button -->
                                <v-btn
                                  :color="isEditingItem ? 'success' : 'success'"
                                  large block
                                  class="mt-5 mb-5"
                                  :disabled="Object.values(temporaryItem).every(item => item === null || item === '')"
                                  @click="isEditingItem ? updateItemTable() : addItemToTable()">
                                  <v-icon class="mr-2">
                                      {{isEditingItem ? 'mdi-checkbox-marked-circle' : 'mdi-plus-circle'}}
                                  </v-icon>
                                  {{isEditingItem ? 'Save Changes' : 'Save Changes'}}
                                </v-btn>

                              </v-card-text>

                            </v-card>
                          </v-dialog>
                        </template>

                        <!-- Datatable -->
                        <v-data-table
                          :headers="[...customTableHeaders, { text: '', value: 'actions', sortable: false, width: '1%' }]"
                          :items="customTableItems"
                          :items-per-page="5"
                          class="elevation-0 mt-5"
                          :disable-pagination="true"
                          :disable-filtering="true"
                          :disable-sort="true"
                          :hide-default-footer="true">

                          <template v-slot:item.actions="{ item }" >

                            <v-menu left>
                              <template v-slot:activator="{ on }">
                                <v-btn small color="primary" dark v-on="on">
                                  <v-icon>
                                    mdi-menu-down
                                  </v-icon>
                                </v-btn>
                              </template>

                              <v-list>

                                <!-- Edit -->
                                <v-list-item @click="editTableRowItem(item)" :disabled="!interaction">
                                  <v-list-item-title>
                                    <v-icon class="mr-2">
                                      mdi-pencil
                                    </v-icon>
                                    Edit
                                  </v-list-item-title>
                                </v-list-item>

                                <!-- Duplicate -->
                                <v-list-item @click="customTableItems.push(Object.assign({}, customTableItems[customTableItems.indexOf(item)]))" :disabled="!interaction">
                                  <v-list-item-title>
                                    <v-icon class="mr-2">
                                      mdi-content-duplicate
                                    </v-icon>
                                    Duplicate
                                  </v-list-item-title>
                                </v-list-item>

                                <v-divider></v-divider>

                                <!-- Delete -->
                                <v-list-item @click="deleteTableRowItem(item)" :disabled="!interaction">
                                  <v-list-item-title style="color: crimson;">
                                    <v-icon class="mr-2" style="color: crimson;">
                                      mdi-trash-can
                                    </v-icon>
                                    Delete
                                  </v-list-item-title>
                                </v-list-item>

                              </v-list>
                            </v-menu>

                            <!-- Edit -->
                            <!-- <v-icon
                              small
                              class="mr-2"
                              @click="editTableRowItem(item)"
                              :disabled="!interaction">
                              mdi-pencil
                            </v-icon> -->

                            <!-- Delete -->
                            <!-- <v-icon
                              small
                              @click="deleteTableRowItem(item)"
                              :disabled="!interaction">
                              mdi-trash-can
                            </v-icon> -->

                          </template>
                        </v-data-table>
                      </v-template>

                      <!-- Audio Note -->
                      <v-btn
                        :disabled="!interaction"
                        v-if="blockType === 11"
                        color="success"
                        block x-large outlined
                        @click="false">
                        <v-icon left>
                          mdi-microphone
                        </v-icon>
                        Record Audio
                      </v-btn>

                      <!-- Visible -->
                      <v-switch
                        :disabled="!interaction"
                        class="pt-5"
                        inset
                        ref="visibleBlock"
                        v-if="blockType !== 7"
                        v-model="visibleBlock"
                        label="Visible Block">
                      </v-switch>

                      <!-- Removable by Prospect -->
                      <v-switch

                        :disabled="!interaction"
                        inset
                        ref="removableByProspect"
                        v-if="blockType !== 7"
                        v-model="removableByProspect"
                        label="This block can be removed by a prospect">
                      </v-switch>

                      <!-- Required to Approve Proposal -->
                      <v-switch
                        :disabled="!interaction"
                        inset
                        ref="requiredToApprove"
                        v-if="blockType !== 7"
                        v-model="requiredToApprove"
                        label="Required to approve proposal">
                      </v-switch>

                    </form>

                    <!-- Create Block Button -->
                    <v-btn
                      class="mt-5"
                      color="success"
                      block large
                      @click="createNewBlock"
                      v-if="this.interaction === 2"
                      :disabled="!validateForm()"
                      :loading="loadingCallToAction">
                      Create Block
                    </v-btn>

                    <!-- Update Block Button -->
                    <v-btn
                      class="mt-5"
                      color="success"
                      block large
                      @click="updateBlock"
                      v-if="this.interaction === 1"
                      :loading="loadingCallToAction">
                      Update Block
                    </v-btn>

                  </v-card-text>

                </v-card>
              </v-dialog>

              <!-- Datatable -->
              <v-data-table
                :headers="headers"
                :items="blocksList"
                :items-per-page="itemsPerPage"
                :search="search"
                :loading="loadingDatatable"
                :multi-sort="true"
                :footer-props="{'items-per-page-options': [-1, 10, 25, 50, 100, 500]}"
                @update:items-per-page="setDTItemsPerPage('Library', $event)">

                <!-- Block Name -->
                <template v-slot:item.BlockName="{ item }">
                  {{ item.Metadata.BlockName }}
                </template>

                <!-- Block Type -->
                <template v-slot:item.BlockType="{ item }">
                  <div v-if="item.Metadata.BlockType === 1">Text Multi-Line (plain)</div>
                  <div v-if="item.Metadata.BlockType === 2">Text Multi-Line (HTML)</div>
                  <div v-if="item.Metadata.BlockType === 3">Text Single-Line</div>
                  <div v-if="item.Metadata.BlockType === 4">Image</div>
                  <div v-if="item.Metadata.BlockType === 5">Video</div>
                  <div v-if="item.Metadata.BlockType === 6">Signature</div>
                  <div v-if="item.Metadata.BlockType === 7">Separator</div>
                  <div v-if="item.Metadata.BlockType === 8">Estimate Item</div>
                  <div v-if="item.Metadata.BlockType === 9">Table</div>
                  <div v-if="item.Metadata.BlockType === 10">Feedback (open field)</div>
                  <div v-if="item.Metadata.BlockType === 11">Audio Note</div>
                </template>

                <!-- Creation Date -->
                <template v-slot:item.CreationDate="{ item }">
                  {{ formatDateTime(item.CreationDate, $store.state.Language, $store.state.DateFormat, $store.state.TimeFormat) }}
                </template>

                <!-- Locked -->
                <template v-slot:item.Locked="{ item }">
                  <div v-if="item.Locked">
                    <v-icon small color="red">
                      mdi-lock
                    </v-icon>
                  </div>

                  <div v-else>
                    <v-icon small color="green">
                      mdi-lock-open
                    </v-icon>
                  </div>
                </template>

                <!-- Status -->
                <template v-slot:item.Status="{ item }">

                  <!-- Published -->
                  <v-chip
                    label
                    small
                    v-if="item.Status === true"
                    color="success">
                    Published
                  </v-chip>

                  <!-- Unpublished -->
                  <v-chip
                    label
                    small
                    v-if="item.Status === false"
                    color="warning">
                    Unpublished
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

                      <!-- View Block Info -->
                      <v-list-item @click="viewBlock(item.BlockToken)">
                        <v-list-item-title>
                          <v-icon class="mr-2">
                            mdi-information-outline
                          </v-icon>
                          Information
                        </v-list-item-title>
                      </v-list-item>

                      <!-- Edit Block -->
                      <v-list-item @click="editBlock(item.BlockToken)">
                        <v-list-item-title>
                          <v-icon class="mr-2">
                            mdi-pencil
                          </v-icon>
                          Edit
                        </v-list-item-title>
                      </v-list-item>

                      <!-- Publish -->
                      <v-list-item v-if="!item.Status" @click="publishBlock(item.BlockToken)">
                        <v-list-item-title>
                          <v-icon class="mr-2">
                            mdi-eye-outline
                          </v-icon>
                          Publish
                        </v-list-item-title>
                      </v-list-item>

                      <!-- Unpublish -->
                      <v-list-item v-if="item.Status" @click="unpublishBlock(item.BlockToken)">
                        <v-list-item-title>
                          <v-icon class="mr-2">
                            mdi-eye-off-outline
                          </v-icon>
                          Unpublish
                        </v-list-item-title>
                      </v-list-item>

                      <v-divider></v-divider>

                      <!-- Delete Block -->
                      <v-list-item @click="deleteItemConfirmation(item.BlockToken)">
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
import BlockTypes from '../includes/helpers/BlockTypes.js';
import Overture from '../services/Overture';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Font from '@ckeditor/ckeditor5-font/src/font';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
// import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';

import { onlyNumbers, formatDateTime } from '../includes/functions.js';

ClassicEditor.builtinPlugins = [
    Essentials,
    UploadAdapter,
    Autoformat,
    Bold,
    Font,
    Italic,
	Strikethrough,
    BlockQuote,
    Heading,
    // Link,
    List,
    Paragraph,
    Alignment,
	Highlight,
	AutoLink,
	HtmlEmbed,
];

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
		interaction: 1, // Interaction defines if the user is 0: viewing, 1: editing, 2: creating
		interactionNames: ['View Block', 'Edit Block', 'Create Block'],
		openBlockDialog: false,
		deleteBlockDialog: false,

		/* --------- Block Types Definitions ------ */
		blockType: 1,
		blocksTypes: [
			{ Text: 'Text Multi-Line (plain)', Value: 1 },
			{ Text: 'Text Multi-Line (HTML)', Value: 2 },
			{ Text: 'Text Single-Line', Value: 3 },
			{ Text: 'Image', Value: 4 },
			{ Text: 'Video', Value: 5 },
			{ Text: 'Signature', Value: 6 },
			{ Text: 'Separator', Value: 7 },
			{ Text: 'Estimate Item', Value: 8 },
			{ Text: 'Table', Value: 9 },
			{ Text: 'Feedback (open field)', Value: 10 },
			{ Text: 'Audio Note', Value: 11 },
		],

		blockToken: null,
		blockName: null,
		blockData: null,
		blockDataHTML: '',
		textColor: 0,

		colors: [
			{ Text: 'Black', 	Value: '#000000'},
			{ Text: 'Blue',  	Value: '#0000FF'},
			{ Text: 'Gray',  	Value: '#808080'},
			{ Text: 'Green', 	Value: '#008000'},
			{ Text: 'Purple',	Value: '#800080'},
			{ Text: 'Red',   	Value: '#FF0000'},
			{ Text: 'HotPink', 	Value: '#FF69B4'},
			{ Text: 'Lemon', 	Value: '#FFFACD'},
			{ Text: 'White', 	Value: '#FFFFFF'},
		],

		textColorHex: '#000000',
		textSize: null,
		textFormatOrientation: 'left',

		textFormats: [
			{ Text: 'Left Aligned', Value: 'left' },
			{ Text: 'Center', Value: 'center' },
			{ Text: 'Right Aligned', Value: 'right' },
		],

		imageURL: null,
		videoURL: null,
		quantity: 0,
		fixedCost: 0,
		costPerUnit: 0,
		discountValue: 0,
		discountType: 1,

		discountTypes: [
			{ Text: 'Percentage', Value: 1 },
			{ Text: 'Fixed Amount', Value: 2 },
		],

		/* ---------- Data table selector ---------- */
		columnsDialog: false,
		addItemDialog: false,
		isEditingItem: false,
		editingItemIndex: null,
		temporaryItem: {},

		customTableHeaders: [],
		temporaryTableHeaders : [],
		customTableItems: [],

		/* --------- Selectors --------- */
		visibleBlock: true,
		removableByProspect: true,
		requiredToApprove: true,

		/* ------- Call to Actions ------ */
		saveButton: true,
		loadingCallToAction: false,

		/* ---------- Datatables -------- */
		headers: [
			{ text: 'Name', align: 'left', value: 'BlockName', sortable: false, width: '55%' },
			{ text: `Type`, align: 'left', value: 'BlockType', sortable: true, width: '15%' },
			{ text: 'Creation', align: 'left', value: 'CreationDate', sortable: false, width: '20%' },
			{ text: 'Locked', align: 'left', value: 'Locked', sortable: false, width: '5%' },
			{ text: 'Status', align: 'left', value: 'Status', sortable: false, width: '5%' },
			{ text: '', align: 'end', value: 'Actions', sortable: false, width: '1%' },
		],

		loadingDatatable: false,
		itemsPerPage: null,
		blocksList: [],

		/* Temp. Data */
		itemIDToDelete: null,

		/* HTML Editor Config */
		editor: ClassicEditor,
		editorConfig: {
			language: null,
			htmlSupport: 'allow',
			toolbar: {
				items: [
					'heading',
					'|',
					'fontColor',
					'fontSize',
					'alignment',
					'bold',
					'italic',
					'strikethrough',
					// 'link',
					'bulletedList',
					'numberedList',
					'blockQuote',
					'undo',
					'redo',
					'highlight',
					'|',
					'htmlEmbed',
				],
				// viewportTopOffset: 30,
				viewportOffset: 30,
				shouldNotGroupWhenFull: true
			},
			link: {
				addTargetToExternalLinks: true,
				defaultProtocol: 'https://',
				decorators: {
					toggleDownloadable: {
						mode: 'manual',
						label: 'Downloadable',
						attributes: {
							download: 'file'
						}
					},
					openInNewTab: {
						mode: 'manual',
						label: 'Open in a new tab',
						defaultValue: true,
						attributes: {
							target: '_blank',
							rel: 'noopener noreferrer'
						}
					}
				}
			},
			htmlEmbed: {
				showPreviews: true,
				// sanitizeHtml: ( inputHtml ) => {
				// 	// Strip unsafe elements and attributes, e.g.:
				// 	// the `<script>` elements and `on*` attributes.
				// 	const outputHtml = sanitize( inputHtml );
				// 	return {
				// 		html: outputHtml,
				// 		// true or false depending on whether the sanitizer stripped anything.
				// 		hasChanged: true
				// 	};
				// }
			},
		},
	}),

	watch: {

		addItemDialog: function(data) {

			if(!data) {

				this.temporaryItem = {};
			}
		},

		columnsDialog: function(data) {

			if(!data) {

				this.temporaryTableHeaders = [];

			} else {

				this.temporaryTableHeaders = structuredClone(this.customTableHeaders);
			}
		}
	},

    methods: {

		/* Set DataTable ItemsPerPage */
		setDTItemsPerPage(_component, _value) {

			localStorage.setItem('Overture-ItemsPerPage-Library', _value);
			this.itemsPerPage = _value;
		},

		onOffSearch() {

			this.showSearchField === false ? this.showSearchField = true : this.showSearchField = false;
			this.showSearchField === false ? this.magnifyIcon = 'mdi-magnify' : this.magnifyIcon = 'mdi-magnify-minus-outline';
			this.showSearchField === false ? this.search = '' : this.search = '';
			this.showSearchField === true ? this.$nextTick(this.$refs.searchField.focus) : false;
		},

		reloadTable() {

			/* Fetch All Blocks */
			this.fetchAllBlocks();
		},

		cleanFields() {

			this.blockToken 		   = null;
			this.blockName             = null;
			this.blockData             = null;
			this.blockDataHTML         = null;
			this.textColor             = 0;
			this.textSize              = null;
			this.textFormatOrientation = 'left';
			this.imageURL			   = null;
			this.videoURL			   = null;
			this.quantity			   = null;
			this.fixedCost			   = null;
			this.costPerUnit		   = null;
			this.discountValue		   = null;
			this.discountType		   = null;
			this.visibleBlock          = true;
			this.removableByProspect   = true;
			this.requiredToApprove	   = true;
			this.columnsDialog 		   = false,
			this.addItemDialog 		   = false;
			this.isEditingItem		   = false;
			this.editingItemIndex 	   = null;
			this.temporaryItem 		   = {};
			this.customTableHeaders    = [];
			this.temporaryTableHeaders = [];
			this.customTableItems      = [];

		},

		onChangeColor(_index){

			this.textColor    = _index;
			this.textColorHex = this.colors[_index].Value;
		},

		onChangeSize(_index){

			this.textSize = _index;
		},

		closeDialogs() {

			/* Clean Fields */
			this.cleanFields();

			this.blockType           = 1;
			this.errorAlert          = false;
			this.errorMessage        = '';
			this.openBlockDialog     = false;
			this.deleteBlockDialog   = false;
			this.itemIDToDelete      = null;
			this.loadingCallToAction = false;
		},

		fetchAllBlocks() {

			this.loadingDatatable = true;
			this.blocksList       = [];

			Overture.fetchAllBlocks()
			.then((jsonResponse) => {

				this.interaction = 0;

				/* Populate Blocks Array */
				this.blocksList       = [...jsonResponse.blocksArray];
				this.loadingDatatable = false;
			})
			.catch((error) => {

				this.loadingDatatable = false;
				console.log(error);
			});
		},

		openCreateNewBlockDialog() {

			this.openBlockDialog = true;
			this.textColor       = 0;
			this.interaction     = 2;
		},

		createNewBlock() {

			/** Set Loading on true **/
			this.loadingCallToAction = true;

			/** To avoid a giant if, we will map the keys from BlockTypes to the keys of the 'this' object. **/
			const metadata = {};

			Object.keys(BlockTypes[this.blockType]).forEach((key) => {
				metadata[key] = this[BlockTypes[this.blockType][key]];
			});
			/** Spread metadata object **/
			const payload = {
				Metadata: {...metadata}
			};

			Overture.createBlock(payload)
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Show Confirmation Message */
					this.snackbar        = true;
					this.snackbarColor   = 'success';
					this.snackbarMessage = jsonResponse.Message;

					/* Fetch All Blocks */
					this.fetchAllBlocks();

					/* Clear and Close */
					this.closeDialogs();

				} else {

					/* Show Error Message */
					this.loadingCallToAction = false;
					this.errorAlert          = true;
					this.errorMessage        = jsonResponse.Message;
				}
			})
			.catch(console.error);
		},

		editBlock(_blockToken) {

			this.interaction = 1;

			this.fetchBlock(_blockToken).then((jsonResponse) => {
				this.openBlockDialog = true;
				this.blockType       = jsonResponse.Metadata.BlockType;
				this.blockToken      = jsonResponse.BlockToken;
			})
			.catch(console.error);
		},

		viewBlock(_blockToken) {

			this.interaction = 0;

			this.fetchBlock(_blockToken).then((jsonResponse) => {
				this.openBlockDialog = true;
				this.viewing         = true;
				this.blockToken      = jsonResponse.BlockToken;
			})
			.catch(console.error);
		},

		async fetchBlock(_blockToken) {

			return Overture.fetchSingleBlock(_blockToken)
			.then((jsonResponse) => {

				if(jsonResponse.Response === true) {

					this.blockType = jsonResponse.Metadata.BlockType;

					Object.keys(BlockTypes[this.blockType]).forEach((key) => {
						this[BlockTypes[this.blockType][key]] = jsonResponse.Metadata[key];
					});

					this.textColor = this.colors.findIndex((color, index) => color.Value === jsonResponse.Metadata.TextColor);

					return jsonResponse;

				} else {

					/* Show Error Message */
					this.snackbar        = true;
					this.snackbarColor   = 'error';
					this.snackbarMessage = jsonResponse.Message;
				}
			})
			.catch(console.error);
		},

		updateBlock() {

			this.loadingCallToAction = true;

			const metadata = {};

			Object.keys(BlockTypes[this.blockType]).forEach((key) => {
				metadata[key] = this[BlockTypes[this.blockType][key]];
			});

			/* Construct Payload */
			const payload = {
				BlockToken : this.blockToken,
				Metadata   : metadata
			};

			Overture.updateBlock(payload)
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Show Confirmation Message */
					this.snackbar        = false;
					this.snackbarColor   = 'success';
					this.snackbarMessage = jsonResponse.Message;

					/* Fetch All Prospects */
					this.fetchAllBlocks();

					/* Clear and Close */
					this.closeDialogs();

				} else {

					/* Show Error Message */
					this.loadingCallToAction = false;
					this.errorAlert          = true;
					this.errorMessage        = jsonResponse.Message;
				}
			})
			.catch(console.error);
		},

		deleteItemConfirmation(_blockToken) {

			this.itemIDToDelete    = _blockToken;
			this.deleteBlockDialog = true;
		},

		deleteItem(_blockToken) {

			this.loadingCallToAction = true;

			Overture.deleteBlock({ BlockToken : _blockToken })
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Show Confirmation Message */
					this.snackbar            = true;
					this.snackbarColor       = 'success';
					this.snackbarMessage     = jsonResponse.Message;
					this.loadingCallToAction = false;

					/* Fetch All Prospects */
					this.fetchAllBlocks();

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

		getYoutubeEmbed() {

			if(!this.videoURL || !this.videoURL.includes('youtube.com')){
				return '';
			}

			/* Replace https://www.youtube.com/watch?v= by https://www.youtube.com/embed/ */
			const finalUrl = this.videoURL.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');

			return finalUrl;
		},

		validateForm(){

			if(!this.blockName || !this.blockName.length){
				return false;
			}

			if(this.blockType === 4){
				return !!this.imageURL;
			}

			if(this.blockType === 5){
				return !!this.videoURL;
			}

			if(this.blockType === 9){
				return !!this.customTableItems.length;
			}

			return true;
		},

		/* --------- Table Functions --------- */

		addHeader() {

			/* New header index. Will use this as key of the header. */
			const index = this.temporaryTableHeaders.length;

			this.temporaryTableHeaders.push({
				text  : `Custom Header #${index + 1}`,
				value : `header${index}`
			});
		},

		addItemToTable() {

			this.customTableItems.push({...this.temporaryItem});
			this.addItemDialog = false;
			this.temporaryItem = {};
		},

		deleteTableRowItem(_item) {

			const index = this.customTableItems.indexOf(_item);
			this.customTableItems.splice(index, 1);
		},

		editTableRowItem(_item) {

			this.temporaryItem    = _item;
			this.editingItemIndex = this.customTableItems.indexOf(_item);
			this.addItemDialog    = true;
			this.isEditingItem    = true;
		},

		updateItemTable() {

			this.addItemDialog = false;
			this.temporaryItem = {};
		},

		publishBlock(_blockToken) {

			/* Construct Payload */
			const payload = { BlockToken : _blockToken };

			Overture.publishBlock(payload)
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Fetch All Prospects */
					this.fetchAllBlocks();

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

		unpublishBlock(_blockToken) {

			/* Construct Payload */
			const payload = { BlockToken : _blockToken };

			Overture.unpublishBlock(payload)
			.then((jsonResponse) => {

				if (jsonResponse.Response === true) {

					/* Fetch All Prospects */
					this.fetchAllBlocks();

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
		if(!localStorage.getItem('Overture-ItemsPerPage-Library')) {

			localStorage.setItem('Overture-ItemsPerPage-Library', 25);
			this.itemsPerPage = 25;

		} else {

			this.itemsPerPage = parseInt(localStorage.getItem('Overture-ItemsPerPage-Library'));
		}

		/* Fetch All Blocks from Lib */
		this.fetchAllBlocks();
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

<style>
.ck-editor__editable
{
	min-height: 250px !important;
	max-height: 600px !important;
}
</style>
