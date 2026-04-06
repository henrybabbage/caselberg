import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'w1pg51yy';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
	name: 'default',
	title: 'Caselberg Studio',
	projectId,
	dataset,
	plugins: [structureTool({ structure }), visionTool()],
	schema: {
		types: schemaTypes
	}
});
