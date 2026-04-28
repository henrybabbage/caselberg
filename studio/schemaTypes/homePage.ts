import { defineField, defineType } from 'sanity';

export const homePageType = defineType({
	name: 'homePage',
	title: 'Home',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			readOnly: true,
			description:
				'Optional. Leave empty for a minimal home; used in the browser tab title when set. Read-only in Studio.'
		})
	]
});
