import { allowAll } from '@keystone-6/core/access';
import { text, checkbox } from '@keystone-6/core/fields';

export const azureADIntegration = {
  access: allowAll,
  fields: {
    adUserId: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    adTenantId: text({ validation: { isRequired: true } }),
    roleMapping: text(),
    accessTokenValidity: checkbox(),
    loginHistory: text(),
  },
};