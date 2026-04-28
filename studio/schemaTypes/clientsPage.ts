import { defineField, defineType } from 'sanity';

export const clientsPageType = defineType({
	name: 'clientsPage',
	title: 'Clients page',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			readOnly: true
		}),
		defineField({
			name: 'carouselLabel',
			title: 'Carousel aria-label',
			type: 'string',
			initialValue: 'Featured work',
			hidden: true
		}),
		defineField({
			name: 'carouselSlides',
			title: 'Carousel slides',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'client' }] }],
			description: 'Add at least one work slide for the carousel to appear on the site.',
			validation: (Rule) => Rule.min(0)
		})
	]
});
