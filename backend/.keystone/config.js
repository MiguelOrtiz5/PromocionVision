var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core = require("@keystone-6/core");

// Schema/User.ts
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var user = {
  access: import_access.allowAll,
  fields: {
    name: (0, import_fields.text)({ validation: { isRequired: true } }),
    email: (0, import_fields.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
    }),
    password: (0, import_fields.password)({ validation: { isRequired: true } }),
    role: (0, import_fields.select)({
      options: [
        { label: "Estudiante", value: "student" },
        { label: "Profesor", value: "teacher" },
        { label: "Administrador", value: "administrator" }
      ],
      defaultValue: "student",
      validation: { isRequired: true }
    }),
    studentID: (0, import_fields.text)(),
    userInstitutions: (0, import_fields.relationship)({ ref: "UserInstitution.user", many: true })
    // Esta relación debe apuntar correctamente
  }
};

// Schema/Autentication.ts
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var authentication = {
  access: import_access2.allowAll,
  fields: {
    tokenId: (0, import_fields2.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
    associatedUser: (0, import_fields2.relationship)({ ref: "User" }),
    expirationDate: (0, import_fields2.timestamp)(),
    authenticationType: (0, import_fields2.select)({
      options: [
        { label: "JWT", value: "jwt" },
        { label: "Azure AD", value: "azure_ad" }
      ]
    }),
    adAuthenticationToken: (0, import_fields2.text)(),
    refreshToken: (0, import_fields2.text)()
  }
};

// Schema/AzureADIntegration.ts
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var azureADIntegration = {
  access: import_access3.allowAll,
  fields: {
    adUserId: (0, import_fields3.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
    adTenantId: (0, import_fields3.text)({ validation: { isRequired: true } }),
    roleMapping: (0, import_fields3.text)(),
    accessTokenValidity: (0, import_fields3.checkbox)(),
    loginHistory: (0, import_fields3.text)()
  }
};

// Schema/RecognitionLog.ts
var import_fields4 = require("@keystone-6/core/fields");
var import_access4 = require("@keystone-6/core/access");
var recognitionLog = {
  access: import_access4.allowAll,
  fields: {
    timestamp: (0, import_fields4.timestamp)({
      validation: { isRequired: true },
      defaultValue: { kind: "now" }
      // Configura la fecha actual por defecto
    }),
    success: (0, import_fields4.select)({
      options: [
        { label: "\xC9xito", value: "1" },
        { label: "Fallo", value: "0" }
      ],
      defaultValue: "0",
      ui: { displayMode: "segmented-control" }
    }),
    confidence: (0, import_fields4.float)({
      validation: { isRequired: true }
    }),
    imageURL: (0, import_fields4.text)(),
    // URL de la imagen capturada por la cámara
    errorDetails: (0, import_fields4.text)(),
    // Detalles del error en caso de falla
    user: (0, import_fields4.relationship)({
      ref: "User",
      // Referencia a la tabla user
      many: false,
      ui: { displayMode: "select" }
    })
  }
};

// Schema/Class.ts
var import_fields5 = require("@keystone-6/core/fields");
var import_access5 = require("@keystone-6/core/access");
var classSchema = {
  access: import_access5.allowAll,
  fields: {
    name: (0, import_fields5.text)({
      validation: { isRequired: true },
      ui: { displayMode: "input" }
    }),
    // Nombre de la clase
    description: (0, import_fields5.text)(),
    // Descripción de la clase
    schedule: (0, import_fields5.text)({ validation: { length: { max: 50 } } }),
    // Horario de la clase
    teacher: (0, import_fields5.relationship)({
      ref: "User",
      // Referencia a la tabla User
      many: false,
      ui: { displayMode: "select" }
    })
  }
};

// Schema/Attendance.ts
var import_fields6 = require("@keystone-6/core/fields");
var import_access6 = require("@keystone-6/core/access");
var attendance = {
  access: import_access6.allowAll,
  fields: {
    date: (0, import_fields6.timestamp)({
      validation: { isRequired: true },
      defaultValue: { kind: "now" }
      // Configura la fecha actual por defecto
    }),
    recognized: (0, import_fields6.select)({
      options: [
        { label: "Reconocido", value: "1" },
        { label: "No Reconocido", value: "0" }
      ],
      defaultValue: "0",
      ui: { displayMode: "segmented-control" }
    }),
    confidenceScore: (0, import_fields6.float)({
      validation: { isRequired: true }
    }),
    imageCapturedURL: (0, import_fields6.text)(),
    // URL de la imagen capturada
    user: (0, import_fields6.relationship)({
      ref: "User",
      // Referencia a la tabla User
      many: false,
      ui: { displayMode: "select" }
    }),
    class: (0, import_fields6.relationship)({
      ref: "Class",
      // Referencia a la tabla Class
      many: false,
      ui: { displayMode: "select" }
    })
  }
};

// Schema/FaceComparison.ts
var import_fields7 = require("@keystone-6/core/fields");
var import_access7 = require("@keystone-6/core/access");
var faceComparison = {
  access: import_access7.allowAll,
  fields: {
    comparisonDate: (0, import_fields7.timestamp)({
      defaultValue: { kind: "now" },
      // Fecha de comparación por defecto
      validation: { isRequired: true }
    }),
    imageCapturedURL: (0, import_fields7.text)(),
    // URL de la imagen capturada
    confidenceScore: (0, import_fields7.float)({
      validation: { isRequired: true }
      // Nivel de confianza
    }),
    comparisonResult: (0, import_fields7.select)({
      options: [
        { label: "Coincide", value: "1" },
        { label: "No coincide", value: "0" }
      ],
      defaultValue: "0",
      ui: { displayMode: "segmented-control" }
    }),
    attendance: (0, import_fields7.relationship)({
      ref: "Attendance",
      // Referencia a la lista de Attendance
      many: false
    })
  }
};

// Schema/RefPhoto.ts
var import_access8 = require("@keystone-6/core/access");
var import_fields8 = require("@keystone-6/core/fields");
var refPhoto = {
  access: import_access8.allowAll,
  fields: {
    imageURL: (0, import_fields8.text)(),
    // URL de la imagen de perfil del usuario
    embeddings: (0, import_fields8.text)(),
    // Representación de la imagen en texto para comparación facial
    user: (0, import_fields8.relationship)({
      ref: "User",
      // Referencia a la lista de usuarios
      many: false
    })
  }
};

// Schema/Institution.ts
var import_access9 = require("@keystone-6/core/access");
var import_fields9 = require("@keystone-6/core/fields");
var institution = {
  access: import_access9.allowAll,
  fields: {
    name: (0, import_fields9.text)({ validation: { isRequired: true } }),
    size: (0, import_fields9.select)({
      options: [
        { label: "Peque\xF1a", value: "small" },
        { label: "Mediana", value: "medium" },
        { label: "Grande", value: "large" }
      ],
      validation: { isRequired: true }
    }),
    userInstitutions: (0, import_fields9.relationship)({ ref: "UserInstitution.institution", many: true })
    // Relación con UserInstitution
  }
};

// Schema/UserInstitution.ts
var import_access10 = require("@keystone-6/core/access");
var import_fields10 = require("@keystone-6/core/fields");
var userInstitution = {
  access: import_access10.allowAll,
  fields: {
    user: (0, import_fields10.relationship)({ ref: "User.userInstitutions", many: false }),
    // Asegúrate de que esta relación apunte correctamente
    institution: (0, import_fields10.relationship)({ ref: "Institution.userInstitutions", many: false })
    // Igual aquí
  }
};

// Schema/Schema.ts
var lists = {
  User: user,
  Authentication: authentication,
  AzureADIntegration: azureADIntegration,
  RecognitionLog: recognitionLog,
  Class: classSchema,
  Attendance: attendance,
  FaceComparison: faceComparison,
  RefPhot: refPhoto,
  Institution: institution,
  UserInstitution: userInstitution
  // Asegúrate de que esté aquí
};

// keystone.ts
var keystone_default = (0, import_core.config)({
  server: {
    port: 3e3,
    // Puerto en el que se ejecutará Keystone
    cors: {
      origin: [
        "http://localhost:8081",
        // Permitir el frontend local
        "http://192.168.1.0/24",
        // Permitir cualquier dispositivo dentro de la red local
        "http://192.168.148.2"
        //ip raspberry
      ],
      credentials: true
      // Necesario si usas cookies o autenticación
    }
  },
  db: {
    provider: "sqlite",
    url: "file:./db/classtrack.db"
    // Ruta de la base de datos SQLite
  },
  lists
  //session,
});
//# sourceMappingURL=config.js.map
