import { allowAll } from '@keystone-6/core/access';
import { text, select, relationship } from '@keystone-6/core/fields';

export const institution = {
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    size: select({
      options: [
        { label: 'Pequeña', value: 'small' },
        { label: 'Mediana', value: 'medium' },
        { label: 'Grande', value: 'large' },
      ],
      validation: { isRequired: true },
    }),
    userInstitutions: relationship({ ref: 'UserInstitution.institution', many: true }), // Relación con UserInstitution
  },
};
