import express from 'express';
import { uploadImage, downloadImage, uploadDocumentToDB, addUserSignInDataToDB, checkUserExistsInDB, connectProjectUser, getProjectsListFromDB, checkProjectEligibilty, paymentCallBackAPI, paymentInitiateAPI, getBalanceAPI, updateEarnAPI, updateSoldAPI, updatePurchaseAPI, getDropDownDataAPI, fetchProjectAPI} from '../controller/controller.js';
import upload from '../utils/upload.js';
const router = express.Router();

// POST Methods
router.post('/file-upload',upload.single('file'),uploadImage);
router.post('/document-upload',uploadDocumentToDB);
router.post('/add-user-sign-in-data',addUserSignInDataToDB);
router.post('/check-user-exists',checkUserExistsInDB);
router.post('/connect-project-user',connectProjectUser);
router.post('/callback',paymentCallBackAPI);
router.post('/payment',paymentInitiateAPI);
router.post('/update-earn',updateEarnAPI);
router.post('/update-sold',updateSoldAPI);
router.post('/update-purchase',updatePurchaseAPI);
// GET Methods
router.get('/get-projects-list',getProjectsListFromDB);
router.get('/check-project-eligibilty',checkProjectEligibilty);
router.get('/get-balance',getBalanceAPI);
router.get('/get-dropdown-data',getDropDownDataAPI);
router.get('/fetch-project',fetchProjectAPI);

// To set up yet
router.get('/file/:fileID',downloadImage);

export default router;