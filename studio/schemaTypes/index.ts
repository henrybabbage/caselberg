import { type SchemaTypeDefinition } from 'sanity';

import { aboutPageType } from './aboutPage';
import { blockContentType } from './blockContent';
import { clientType } from './client';
import { clientsPageType } from './clientsPage';
import { contactPageType } from './contactPage';
import { homePageType } from './homePage';
import { navigationItemType } from './navigationItem';
import { siteSettingsType } from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
	blockContentType,
	navigationItemType,
	clientType,
	siteSettingsType,
	homePageType,
	clientsPageType,
	aboutPageType,
	contactPageType
];
