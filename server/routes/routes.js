import express from 'express';
import { sendContactMessageAPI, checkProjectOwnershipAPI, deleteUserAccountAPI, updateAvailableDropDownDataAPI, getHomeFeatureProjectsAPI, isProjectDeletedAPI, updateUserDataAPI, moveProjectToDeletedAPI, deleteProjectAPI, updateProjectAPI, uploadDocumentToDB, addUserSignInDataToDB, checkUserExistsInDB, connectProjectUser, getProjectsListFromDB, checkProjectEligibilty, getBalanceAPI, updateEarnAPI, updateSoldAPI, updatePurchaseAPI, getDropDownDataAPI, fetchProjectAPI, fetchAllProjectsOfUserAPI} from '../controller/controller.js';
// import upload from '../utils/upload.js';
const router = express.Router();

// POST Methods
router.post('/document-upload',uploadDocumentToDB);
router.post('/send-contact-message',sendContactMessageAPI);
router.post('/add-user-sign-in-data',addUserSignInDataToDB);
router.post('/check-user-exists',checkUserExistsInDB);
router.post('/connect-project-user',connectProjectUser);
// router.post('/callback',paymentCallBackAPI);
// router.post('/payment',paymentInitiateAPI);
router.post('/update-earn',updateEarnAPI);
router.post('/update-sold',updateSoldAPI);
router.post('/update-purchase',updatePurchaseAPI);
router.post('/update-project',updateProjectAPI);
router.post('/delete-project',deleteProjectAPI);
router.post('/delete-user-account',deleteUserAccountAPI);
router.post('/move-project-to-deleted',moveProjectToDeletedAPI);
router.post('/update-user-data', updateUserDataAPI);
router.post('/update-available-dropdown', updateAvailableDropDownDataAPI);
// GET Methods
router.get('/get-projects-list',getProjectsListFromDB);
router.get('/check-project-eligibilty',checkProjectEligibilty);
router.get('/get-balance',getBalanceAPI);
router.get('/fetch-project',fetchProjectAPI);
router.get('/fetch-projects-of-user',fetchAllProjectsOfUserAPI);
router.get('/is-project-deleted',isProjectDeletedAPI);
router.get('/check-project-ownership',checkProjectOwnershipAPI);
router.get('/get-dropdown-data',getDropDownDataAPI);
router.get('/get-home-feature-projects',getHomeFeatureProjectsAPI);

export default router;