import { AsteriskIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const aboutPageType = defineType({
	name: 'aboutPage',
	title: 'About page',
	type: 'document',
	icon: AsteriskIcon,
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			readOnly: true,
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'blockContent'
		})
	]
});
