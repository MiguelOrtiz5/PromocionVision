import { integer, timestamp, float, text, relationship, select } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const attendance = {
    access: allowAll,
    fields: {
        date: timestamp({
            validation: { isRequired: true },
            defaultValue: { kind: 'now' }, // Configura la fecha actual por defecto
        }),
        recognized: select({
            options: [
                { label: 'Reconocido', value: '1' },
                { label: 'No Reconocido', value: '0' },
            ],
            defaultValue: '0',
            ui: { displayMode: 'segmented-control' },
        }),
        confidenceScore: float({
            validation: { isRequired: true },
        }),
        imageCapturedURL: text(), // URL de la imagen capturada
        user: relationship({
            ref: 'User', // Referencia a la tabla User
            many: false,
            ui: { displayMode: 'select' },
        }),
        class: relationship({
            ref: 'Class', // Referencia a la tabla Class
            many: false,
            ui: { displayMode: 'select' },
        }),
    },
};
