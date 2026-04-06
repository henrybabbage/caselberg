import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	fields: [
		defineField({
			name: 'siteName',
			title: 'Site name',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'logo',
			title: 'Logo',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'defaultSeoTitle',
			title: 'Default SEO title',
			type: 'string'
		}),
		defineField({
			name: 'defaultSeoDescription',
			title: 'Default SEO description',
			type: 'text',
			rows: 3
		}),
		defineField({
			name: 'defaultOgImage',
			title: 'Default social image',
			type: 'image'
		}),
		defineField({
			name: 'navigation',
			title: 'Main navigation',
			type: 'array',
			of: [{ type: 'navigationItem' }]
		})
	]
});
