import { defineField, defineType } from 'sanity';

/**
 * Work slide for the cascading carousel: image + name + description
 * match the Osmo-style slider (data-slide-title / data-slide-description).
 */
export const clientType = defineType({
	name: 'client',
	title: 'Client work slide',
	type: 'document',
	fields: [
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			description: 'Shown as the slide title in the carousel (e.g. brand name).',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 4,
			description: 'Shown below the carousel with the active slide.',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'imageMobile',
			title: 'Image — mobile (optional, ≤479px)',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'imageTablet',
			title: 'Image — tablet (optional, ≤767px)',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'projectUrl',
			title: 'Project URL (optional)',
			type: 'url'
		})
	],
	preview: {
		select: { name: 'name', media: 'image' },
		prepare({ name, media }) {
			return { title: name ?? 'Untitled', media };
		}
	}
});
