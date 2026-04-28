#!/usr/bin/env node
/**
 * Run from studio/: npm run seed
 * Requires: SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_API_WRITE_TOKEN in .env
 */
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
	console.error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env');
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: '2024-01-01',
	token,
	useCdn: false
});

function key() {
	return `k${Math.random().toString(36).slice(2, 10)}`;
}

const aboutCopy =
	'At the intersection of creativity and innovation, Caselberg Studio uses an integrated approach to ensure creative excellence and business strategy work in harmony.';

const documents = [
	{
		_id: 'siteSettings',
		_type: 'siteSettings',
		siteName: 'Caselberg Studio',
		navigation: [
			{
				_type: 'navigationItem',
				_key: key(),
				label: 'Clients',
				href: '/clients',
				isExternal: false
			},
			{
				_type: 'navigationItem',
				_key: key(),
				label: 'About',
				href: '/about',
				isExternal: false
			},
			{
				_type: 'navigationItem',
				_key: key(),
				label: 'Contact',
				href: '/contact',
				isExternal: false
			}
		]
	},
	{
		_id: 'homePage',
		_type: 'homePage'
	},
	{
		_id: 'clientsPage',
		_type: 'clientsPage',
		title: 'Clients',
		carouselLabel: 'Featured work',
		carouselSlides: []
	},
	{
		_id: 'aboutPage',
		_type: 'aboutPage',
		title: 'About',
		body: [
			{
				_type: 'block',
				_key: key(),
				style: 'normal',
				markDefs: [],
				children: [
					{
						_type: 'span',
						_key: key(),
						text: aboutCopy,
						marks: []
					}
				]
			}
		]
	},
	{
		_id: 'contactPage',
		_type: 'contactPage',
		heading: 'Caselberg Studio',
		email: 'isabella@caselbergstudio.com',
		emailDisplay: 'isabella@caselbergstudio.com',
		instagramUrl: 'https://www.instagram.com/caselberg.studio',
		instagramHandle: '@caselberg.studio',
		phoneTel: '+64212499499',
		phoneDisplay: '(+64) 21 249 9499'
	}
];

try {
	const tx = client.transaction();
	for (const doc of documents) {
		tx.createOrReplace(doc);
	}
	await tx.commit();
	console.log('Seed committed OK:', projectId, dataset);
} catch (err) {
	console.error(err);
	process.exit(1);
}
