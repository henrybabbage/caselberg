import { defineField, defineType } from 'sanity';

export const contactPageType = defineType({
	name: 'contactPage',
	title: 'Contact page',
	type: 'document',
	fields: [
		defineField({
			name: 'heading',
			title: 'Contact block heading',
			type: 'string',
			initialValue: 'Caselberg Studio',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'email',
			title: 'Email address (mailto)',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'emailDisplay',
			title: 'Email display text',
			type: 'string',
			description: 'Optional; defaults to email'
		}),
		defineField({
			name: 'instagramUrl',
			title: 'Instagram URL',
			type: 'url',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'instagramHandle',
			title: 'Instagram display (e.g. @handle)',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'phoneTel',
			title: 'Phone (tel href, E.164 or digits)',
			type: 'string',
			description: 'e.g. +64212499499',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'phoneDisplay',
			title: 'Phone display text',
			type: 'string',
			description: 'e.g. (+64) 21 249 9499',
			validation: (Rule) => Rule.required()
		})
	]
});
