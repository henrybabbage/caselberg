import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173';

export default defineConfig({
	name: 'default',
	title: 'Caselberg Studio',
	projectId: 'w1pg51yy',
	dataset: 'production',
	plugins: [
		structureTool({ structure }),
		presentationTool({
			previewUrl: {
				initial: previewOrigin,
				previewMode: {
					enable: '/preview/enable',
					disable: '/preview/disable'
				}
			},
			allowOrigins: ['http://localhost:*', 'https://caselbergstudio.com'],
			resolve: {
				mainDocuments: defineDocuments([
					{ route: '/', type: 'clientsPage' },
					{ route: '/about', type: 'aboutPage' },
					{ route: '/contact', type: 'contactPage' }
				]),
				locations: {
					clientsPage: defineLocations({
						select: { title: 'title' },
						resolve: (doc) => ({
							locations: [{ title: doc?.title || 'Clients', href: '/' }]
						})
					}),
					homePage: defineLocations({
						select: { title: 'title' },
						resolve: (doc) => ({
							locations: [{ title: doc?.title || 'Home', href: '/' }]
						})
					}),
					aboutPage: defineLocations({
						select: { title: 'title' },
						resolve: (doc) => ({
							locations: [{ title: doc?.title || 'About', href: '/about' }]
						})
					}),
					contactPage: defineLocations({
						select: { title: 'title' },
						resolve: (doc) => ({
							locations: [{ title: doc?.title || 'Contact', href: '/contact' }]
						})
					}),
					client: defineLocations({
						select: { name: 'name' },
						resolve: (doc) => ({
							locations: [{ title: doc?.name || 'Work slide', href: '/' }]
						})
					}),
					siteSettings: defineLocations({
						message: 'Site settings are used across all pages',
						tone: 'caution'
					})
				}
			}
		}),
		visionTool()
	],
	schema: {
		types: schemaTypes
	}
});
