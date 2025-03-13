import { type Lists } from '.keystone/types';
import { user } from './User';
import { authentication } from './Autentication';
import { azureADIntegration } from './AzureADIntegration';
import { recognitionLog } from "./RecognitionLog";
import { classSchema } from "./Class";
import { attendance } from "./Attendance";
import { faceComparison } from "./FaceComparison";
import { refPhoto } from './RefPhoto';
import { institution } from './Institution';
import { userInstitution } from './UserInstitution'; // No olvides importar UserInstitution

export const lists = {
    User: user,
    Authentication: authentication,
    AzureADIntegration: azureADIntegration,
    RecognitionLog: recognitionLog,
    Class: classSchema,
    Attendance: attendance,
    FaceComparison: faceComparison,
    RefPhot: refPhoto,
    Institution: institution,
    UserInstitution: userInstitution, // Asegúrate de que esté aquí
}; 
