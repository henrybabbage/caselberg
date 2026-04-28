import { DesktopIcon } from '@sanity/icons';
import { defineType } from 'sanity';

export const navigationItemType = defineType({
	title: 'Navigation item',
	name: 'navigationItem',
	type: 'object',
	icon: DesktopIcon,
	fields: [
		{ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() },
		{ name: 'href', title: 'Path or URL', type: 'string', validation: (Rule) => Rule.required() },
		{
			name: 'isExternal',
			title: 'External link',
			type: 'boolean',
			initialValue: false
		}
	]
});
