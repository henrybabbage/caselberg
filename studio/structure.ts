import {
	CogIcon,
	EnvelopeIcon,
	HomeIcon,
	InfoOutlineIcon,
	PresentationIcon,
	UsersIcon
} from '@sanity/icons';
import type { StructureBuilder, StructureResolver } from 'sanity/structure';
import type { ComponentType } from 'react';

const singletonIds = {
	siteSettings: 'siteSettings',
	homePage: 'homePage',
	clientsPage: 'clientsPage',
	aboutPage: 'aboutPage',
	contactPage: 'contactPage'
} as const;

function singletonListItem(
	S: StructureBuilder,
	type: string,
	title: string,
	id: string,
	icon: ComponentType
) {
	return S.listItem()
		.title(title)
		.icon(icon)
		.child(S.document().schemaType(type).documentId(id));
}

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Caselberg Studio')
		.items([
			singletonListItem(
				S,
				'siteSettings',
				'Site settings',
				singletonIds.siteSettings,
				CogIcon
			),
			S.divider(),
			singletonListItem(S, 'homePage', 'Home', singletonIds.homePage, HomeIcon),
			singletonListItem(
				S,
				'clientsPage',
				'Clients',
				singletonIds.clientsPage,
				UsersIcon
			),
			singletonListItem(
				S,
				'aboutPage',
				'About',
				singletonIds.aboutPage,
				InfoOutlineIcon
			),
			singletonListItem(
				S,
				'contactPage',
				'Contact',
				singletonIds.contactPage,
				EnvelopeIcon
			),
			S.divider(),
			S.listItem()
				.title('Work slides')
				.icon(PresentationIcon)
				.child(S.documentTypeList('client').title('Work slides'))
		]);
