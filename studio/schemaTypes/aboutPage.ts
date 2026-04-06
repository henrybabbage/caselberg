import { defineField, defineType } from 'sanity';

export const aboutPageType = defineType({
	name: 'aboutPage',
	title: 'About page',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'blockContent'
		})
	]
});
