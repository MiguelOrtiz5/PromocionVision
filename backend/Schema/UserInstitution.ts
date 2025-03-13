import { allowAll } from '@keystone-6/core/access';
import { relationship } from '@keystone-6/core/fields';

export const userInstitution = {
  access: allowAll,
  fields: {
    user: relationship({ ref: 'User.userInstitutions', many: false }), // Asegúrate de que esta relación apunte correctamente
    institution: relationship({ ref: 'Institution.userInstitutions', many: false }), // Igual aquí
  },
};
