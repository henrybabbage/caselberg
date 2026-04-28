#!/usr/bin/env node
/**
 * Imports client carousel assets + copy from caselbergstudio.com Squarespace CDN,
 * updates about body from site meta, and syncs contact fields.
 *
 * Run from studio/: npm run scrape-import
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

const CDN_V1 = 'https://images.squarespace-cdn.com/content/v1/684657b0d8539c6c2a0bddba';
const CDN = 'https://images.squarespace-cdn.com/content/684657b0d8539c6c2a0bddba';

function imgV1(uuid, file) {
	return `${CDN_V1}/${uuid}/${file}?format=webp`;
}
function imgNoV1(uuid, file) {
	return `${CDN}/${uuid}/${file}?format=webp`;
}

/** Slide order + Squarespace image mapping (desktop / tablet / mobile). */
const slides = [
	{
		_id: 'client-baina',
		name: 'Baina',
		description:
			'Baina\'s identity balances heritage and progression with a refined visual language developed across print, packaging, and digital touchpoints.',
		imageUrl: imgV1('c3a1b16f-c531-48a3-8350-cd95897075c3', 'baina-web-1.webp'),
		imageMobileUrl: imgV1('a17ad04f-dc8b-4b0f-a489-a2c34e631df5', 'baina-web-2.webp'),
		imageTabletUrl: imgV1('0ebd24ef-4072-45ca-8875-e641e56d5b9c', 'baina-web-3.webp')
	},
	{
		_id: 'client-elm-lab',
		name: 'Elm Lab',
		description:
			'Elm Lab\'s identity celebrates colostrum as a potent, ancestral nutrient, reflecting the scientific rigour and familial care of the brand.',
		imageUrl: imgV1('d1f91632-1184-479e-8841-230f05765ac6', 'elm-lab-web-1.webp'),
		imageTabletUrl: imgV1('e87da657-3f54-4e8e-9e34-d36271d6b430', 'elm-lab-web-2.webp'),
		imageMobileUrl: imgV1('e87da657-3f54-4e8e-9e34-d36271d6b430', 'elm-lab-web-2.webp')
	},
	{
		_id: 'client-embodyme',
		name: 'Embodyme',
		description:
			'Embodyme\'s identity is designed to reflect the ritualistic nature of the products, promoting a sense of balance and self-connection.',
		imageUrl: imgV1('dfbaabc1-0159-4d13-afac-d6786cbd8fff', 'embodyme-web-1.webp')
	},
	{
		_id: 'client-ohen',
		name: 'Ohen',
		description:
			'Ohen\'s identity captures the duality of softness and strength, reflecting the brand\'s commitment to both comfort and empowerment.',
		imageUrl: imgNoV1('27dd18e5-81e1-4c70-8bc4-29d396e75764', 'ohen-web-1.webp'),
		imageMobileUrl: imgNoV1('27cdd553-6c64-409e-be0a-b74b2631f84f', 'ohen-web-2.webp')
	},
	{
		_id: 'client-olivia-cashmore',
		name: 'Olivia Cashmore',
		description:
			'Olivia Cashmore\'s identity is a quiet expression of luxury through type, texture, and restraint.',
		imageUrl: imgV1('841f0ec1-4d96-498e-ae3d-3d6a742025fb', 'olivia-cashmore-web-1.webp')
	},
	{
		_id: 'client-tolaga-bay-cashmere',
		name: 'Tolaga Bay Cashmere',
		description:
			'Tolaga Bay Cashmere\'s identity embraces a sense of place, quality, and craft, designed for a global audience with a uniquely New Zealand story.',
		imageUrl: imgV1('2a3a18fa-e2b8-4370-909c-a5a1c913fefb', 'tolaga-bay-web-1.webp'),
		imageMobileUrl: imgV1('f66da938-3acf-48e7-bb7f-f8fe3acf11a5', 'tolaga-bay-web-2.webp'),
		imageTabletUrl: imgV1('f66da938-3acf-48e7-bb7f-f8fe3acf11a5', 'tolaga-bay-web-2.webp')
	}
];

const ABOUT_COPY =
	'At the intersection of creativity and innovation, Caselberg Studio uses an integrated approach to ensure creative excellence and business strategy work in harmony.';

const CONTACT = {
	title: 'Contact',
	heading: 'Caselberg Studio',
	email: 'isabella@caselbergstudio.com',
	emailDisplay: 'isabella@caselbergstudio.com',
	instagramUrl: 'https://www.instagram.com/caselberg.studio',
	instagramHandle: '@caselberg.studio',
	phoneTel: '+64212499499',
	phoneDisplay: '(+64) 21 249 9499'
};

function key() {
	return `k${Math.random().toString(36).slice(2, 10)}`;
}

function blockParagraph(text) {
	return {
		_type: 'block',
		_key: key(),
		style: 'normal',
		markDefs: [],
		children: [{ _type: 'span', _key: key(), text, marks: [] }]
	};
}

function imageField(asset) {
	return {
		_type: 'image',
		asset: { _type: 'reference', _ref: asset._id }
	};
}

async function uploadImageFromUrl(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
	const buf = Buffer.from(await res.arrayBuffer());
	const rawCt = res.headers.get('content-type')?.split(';')[0]?.trim();
	const contentType = rawCt && rawCt !== 'application/octet-stream' ? rawCt : 'image/webp';
	const filename = new URL(url).pathname.split('/').pop() || 'image.webp';
	return client.assets.upload('image', buf, { filename, contentType });
}

async function fetchSlideCopyFromLiveSite() {
	const res = await fetch('https://www.caselbergstudio.com/clients');
	if (!res.ok) throw new Error(`clients page ${res.status}`);
	const html = await res.text();
	const re = /data-slide-title="([^"]+)"[^>]*data-slide-description="([^"]+)"/g;
	const map = new Map();
	let m;
	while ((m = re.exec(html))) {
		map.set(m[1], m[2]);
	}
	return map;
}

async function fetchAboutFromLiveSite() {
	const res = await fetch('https://www.caselbergstudio.com/');
	if (!res.ok) throw new Error(`home ${res.status}`);
	const html = await res.text();
	const m = html.match(/property="og:description" content="([^"]*)"/);
	return m ? m[1].replace(/&amp;/g, '&') : ABOUT_COPY;
}

async function main() {
	const slideCopy = await fetchSlideCopyFromLiveSite();
	const aboutText = await fetchAboutFromLiveSite();

	for (const slide of slides) {
		const liveDesc = slideCopy.get(slide.name);
		if (liveDesc) slide.description = liveDesc;
	}

	const tx = client.transaction();

	for (const slide of slides) {
		const mainAsset = await uploadImageFromUrl(slide.imageUrl);
		const doc = {
			_id: slide._id,
			_type: 'client',
			name: slide.name,
			description: slide.description,
			image: imageField(mainAsset)
		};
		if (slide.imageMobileUrl) {
			doc.imageMobile = imageField(await uploadImageFromUrl(slide.imageMobileUrl));
		}
		if (slide.imageTabletUrl) {
			doc.imageTablet = imageField(await uploadImageFromUrl(slide.imageTabletUrl));
		}
		tx.createOrReplace(doc);
	}

	const carouselSlides = slides.map((s, i) => ({
		_type: 'reference',
		_ref: s._id,
		_key: `import-${i}-${s._id.replace('client-', '')}`
	}));

	tx.patch('clientsPage', (p) => p.set({ carouselSlides }));
	tx.patch('aboutPage', (p) =>
		p.set({
			body: [blockParagraph(aboutText)]
		})
	);
	tx.patch('contactPage', (p) => p.set(CONTACT));

	await tx.commit();
	console.log('scrape-import OK:', projectId, dataset);
	console.log('  clients:', slides.length, 'slides');
	console.log('  about length:', aboutText.length);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
