import { DocumentIcon, UsersIcon } from '@sanity/icons';
import type { StructureBuilder, StructureResolver } from 'sanity/structure';

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
	id: string
) {
	return S.listItem()
		.title(title)
		.icon(DocumentIcon)
		.child(S.document().schemaType(type).documentId(id));
}

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Caselberg Studio')
		.items([
			singletonListItem(S, 'siteSettings', 'Site settings', singletonIds.siteSettings),
			S.divider(),
			singletonListItem(S, 'homePage', 'Home', singletonIds.homePage),
			singletonListItem(S, 'clientsPage', 'Clients', singletonIds.clientsPage),
			singletonListItem(S, 'aboutPage', 'About', singletonIds.aboutPage),
			singletonListItem(S, 'contactPage', 'Contact', singletonIds.contactPage),
			S.divider(),
			S.listItem()
				.title('Work slides')
				.icon(UsersIcon)
				.child(S.documentTypeList('client').title('Work slides'))
		]);
