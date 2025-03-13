import { integer, timestamp, text, relationship, float, select } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const recognitionLog = {
  access: allowAll,
  fields: {
    timestamp: timestamp({
      validation: { isRequired: true },
      defaultValue: { kind: 'now' }, // Configura la fecha actual por defecto
    }),
    success: select({
      options: [
        { label: 'Éxito', value: '1' },
        { label: 'Fallo', value: '0' },
      ],
      defaultValue: '0',
      ui: { displayMode: 'segmented-control' },
    }),
    confidence: float({
      validation: { isRequired: true },
    }),
    imageURL: text(), // URL de la imagen capturada por la cámara
    errorDetails: text(), // Detalles del error en caso de falla
    user: relationship({
      ref: 'User', // Referencia a la tabla user
      many: false,
      ui: { displayMode: 'select' },
    }),
  },
};
