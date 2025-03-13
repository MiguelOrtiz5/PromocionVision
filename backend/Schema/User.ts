// import { allowAll } from '@keystone-6/core/access';
// import { text, select, checkbox } from '@keystone-6/core/fields';

// export const user = {
//   access: allowAll,
//   fields: {
//     fullName: text({ validation: { isRequired: true } }),
//     email: text({ validation: { isRequired: true } }),
//     phoneNumber: text({ validation: { isRequired: true } }),
//     userRole: select({
//       options: [
//         { label: 'Admin', value: 'admin' },
//         { label: 'Docent', value: 'Docent' },
//         { label: 'Student', value: 'Student' },
//       ],
//       defaultValue: 'Student',
//     }),
//     profilePicture: text(),
//     accountStatus: select({
//       options: [
//         { label: 'Active', value: 'active' },
//         { label: 'Inactive', value: 'inactive' },
//         { label: 'Suspended', value: 'suspended' },
//       ],
//       defaultValue: 'active',
//     }),
//     adAuthenticationStatus: checkbox(),
//   },
// };

// import { allowAll } from '@keystone-6/core/access';
// import { text, select, password } from '@keystone-6/core/fields';

// export const user = {
//   access: allowAll,
//   fields: {
//     name: text({ validation: { isRequired: true } }), // Nombre del usuario
//     email: text({ 
//       validation: { isRequired: true },
//       isIndexed: 'unique', // Para establecer el campo como único en la base de datos
//     }), 
//     password: password({ validation: { isRequired: true } }), // Contraseña
//     role: select({
//       options: [
//         { label: 'Estudiante', value: 'student' },
//         { label: 'Profesor', value: 'teacher' },
//         { label: 'Administrador', value: 'administrator' },
//       ],
//       defaultValue: 'student',
//       validation: { isRequired: true },
//     }),
//     studentID: text(), // Solo para estudiantes, se puede dejar vacío
  
//   },
// };

// import { allowAll } from '@keystone-6/core/access';
// import { text, select, checkbox } from '@keystone-6/core/fields';

// export const user = {
//   access: allowAll,
//   fields: {
//     fullName: text({ validation: { isRequired: true } }),
//     email: text({ validation: { isRequired: true } }),
//     phoneNumber: text({ validation: { isRequired: true } }),
//     userRole: select({
//       options: [
//         { label: 'Admin', value: 'admin' },
//         { label: 'Docent', value: 'Docent' },
//         { label: 'Student', value: 'Student' },
//       ],
//       defaultValue: 'Student',
//     }),
//     profilePicture: text(),
//     accountStatus: select({
//       options: [
//         { label: 'Active', value: 'active' },
//         { label: 'Inactive', value: 'inactive' },
//         { label: 'Suspended', value: 'suspended' },
//       ],
//       defaultValue: 'active',
//     }),
//     adAuthenticationStatus: checkbox(),
//   },
// };

import { allowAll } from '@keystone-6/core/access';
import { text, select, password, relationship } from '@keystone-6/core/fields';

export const user = {
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    password: password({ validation: { isRequired: true } }),
    role: select({
      options: [
        { label: 'Estudiante', value: 'student' },
        { label: 'Profesor', value: 'teacher' },
        { label: 'Administrador', value: 'administrator' },
      ],
      defaultValue: 'student',
      validation: { isRequired: true },
    }),
    studentID: text(),
    userInstitutions: relationship({ ref: 'UserInstitution.user', many: true }), // Esta relación debe apuntar correctamente
  },
};
