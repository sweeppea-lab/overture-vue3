/*
	 ___
	/ __|_ __ _____ ___ _ __ _ __  ___ __ _
	\__ \ V  V / -_) -_) '_ \ '_ \/ -_) _` |
	|___/\_/\_/\___\___| .__/ .__/\___\__,_|
						|_|  |_|

    Platform  : Sweeppea Overture v1.0
    Path      : /includes/helpers/BlockTypes.js
    Language  : NodeJS (JavaScript)
    Released  : 2022-2023

    (c) Sweeppea, all rights reserved.
*/

'use strict';

/** The purpose of this file is to help map the BlockType attributes. */

const BlockTypes = {

	/** Text Multi-Line (Plain) */
	1: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		BlockData             : 'blockData',
		TextColor             : 'textColorHex',
		TextSize              : 'textSize',
		TextFormatOrientation : 'textFormatOrientation',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Text HTML */
	2: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		BlockData             : 'blockDataHTML',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Text Single-Line */
	3: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		BlockData             : 'blockData',
		TextColor             : 'textColorHex',
		TextSize              : 'textSize',
		TextFormatOrientation : 'textFormatOrientation',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Image URL */
	4: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		ImageURL			  : 'imageURL',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Video URL */
	5: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		VideoURL			  : 'videoURL',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Signature */
	6: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		BlockData             : 'blockData',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Separator */
	7: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		BlockData             : 'blockData',
		Removable             : 'removableByProspect',
	},

	/** Estimate Item */
	8: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		BlockData             : 'blockData',
		Quantity			  : 'quantity',
		FixedCost			  : 'fixedCost',
		CostPerUnit			  : 'costPerUnit',
		DiscountValue		  : 'discountValue',
		DiscountType		  : 'discountType',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Table */
	9: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		Headers		  		  : 'customTableHeaders',
		Items				  : 'customTableItems',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},

	/** Feedback */
	10: {
		BlockType             : 'blockType',
		BlockName             : 'blockName',
		BlockData             : 'blockData',
		Visible               : 'visibleBlock',
		Removable             : 'removableByProspect',
		RequiredToApprove	  : 'requiredToApprove',
	},
};

export default BlockTypes;
