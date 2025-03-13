import { integer, timestamp, text, float, relationship, select } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const faceComparison = {
    access: allowAll,
    fields: {
        comparisonDate: timestamp({
            defaultValue: { kind: 'now' }, // Fecha de comparación por defecto
            validation: { isRequired: true },
        }),
        imageCapturedURL: text(), // URL de la imagen capturada
        confidenceScore: float({
            validation: { isRequired: true }, // Nivel de confianza
        }),
        comparisonResult: select({
            options: [
                { label: 'Coincide', value: '1' },
                { label: 'No coincide', value: '0' },
            ],
            defaultValue: '0',
            ui: { displayMode: 'segmented-control' },
        }),
        attendance: relationship({
            ref: 'Attendance', // Referencia a la lista de Attendance
            many: false,
        }),
    },
};
