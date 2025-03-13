import { allowAll } from '@keystone-6/core/access';
import { text, select, timestamp, relationship } from '@keystone-6/core/fields';

export const authentication = {
  access: allowAll,
  fields: {
    tokenId: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    associatedUser: relationship({ ref: 'User' }),
    expirationDate: timestamp(),
    authenticationType: select({
      options: [
        { label: 'JWT', value: 'jwt' },
        { label: 'Azure AD', value: 'azure_ad' },
      ],
    }),
    adAuthenticationToken: text(),
    refreshToken: text(),
  },
};