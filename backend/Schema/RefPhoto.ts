import { allowAll } from '@keystone-6/core/access';
import { text, relationship } from '@keystone-6/core/fields';

export const refPhoto = {
    access: allowAll,
    fields: {
      imageURL: text(), // URL de la imagen de perfil del usuario
      embeddings: text(), // Representación de la imagen en texto para comparación facial
      user: relationship({
          ref: 'User', // Referencia a la lista de usuarios
          many: false,
        }),
    }

}