import { text, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const classSchema = {
    access: allowAll,
    fields: {
        name: text({
            validation: { isRequired: true },
            ui: { displayMode: 'input' },
        }), // Nombre de la clase
        description: text(), // Descripción de la clase
        schedule: text({ validation: { length: { max: 50 } } }), // Horario de la clase
        teacher: relationship({
            ref: 'User', // Referencia a la tabla User
            many: false,
            ui: { displayMode: 'select' },
        }),
    },
};
