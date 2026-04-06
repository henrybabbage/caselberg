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
			description: 'Optional. Leave empty for a minimal home; used in the browser tab title when set.'
		}),
		defineField({
			name: 'subtitle',
			title: 'Subtitle',
			type: 'text',
			rows: 3
		}),
		defineField({
			name: 'heroImage',
			title: 'Hero image',
			type: 'image',
			options: { hotspot: true }
		})
	]
});
