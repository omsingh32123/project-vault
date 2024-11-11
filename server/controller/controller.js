import homeFeatureProjects from "../models/homeFeatureProjects.js";
import myDocument from "../models/mydocument.js";
import blankUserData from "../models/userdata.js";
import websiteMetaData from "../models/metaData.js";
import deletedProjects from "../models/deletedProjects.js";
import contactMessage from "../models/contactMessage.js";
// import PaytmChecksum from 'paytmchecksum';
// var mid = "XXXXXXXXXX"    
// var key = "XXXXXXXXXX"
// var mobileNo = "XXXXXXXXXX"

export const uploadDocumentToDB = async (request, response) => {
    try{
        const doc = await myDocument.create(request.body);
        response.status(200).json({id:doc._id});
    }
    catch(error)
    {
        response.status(500).json({error:error.message});
    }
};

export const addUserSignInDataToDB = async (request, response) => {
    try{
        const doc = await blankUserData.create(request.body);
        response.status(200).json({id:doc._id});
    }
    catch(error)
    {
        response.status(500).json({error:error.message});
    }
};

export const checkUserExistsInDB = async (request, response) => {
    try{
        const doc = await blankUserData.findOne({ email: request.body['email'] });
        if(doc)
        {
            response.status(200).json({exists:true});
        }
        else
        {
            response.status(200).json({exists:false});
        }
    }
    catch(error)
    {
        response.status(500).json({error:error.message});
    }
};

export const connectProjectUser = async (request, response) => {
    const userEmail = request.body.email;
    const projectID = request.body.id;
    try{
        await blankUserData.findOneAndUpdate(
            { email: userEmail },
            { $push: { documents: projectID } },
            { new: true }
        );
        response.status(200);
    }
    catch(error)
    {
        response.status(500).json({error:error.message});
    }
};

export const getProjectsListFromDB = async (request, response) => {
    try {
        const projectList = await myDocument.find({ 
            domain: request.query.domain,  
            tags: { $in: [request.query.topic] }
        });

        if (projectList) {
            response.status(200).json({ exists: true, projects: projectList });
        } else {
            response.status(200).json({ exists: false });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

export const checkProjectEligibilty = async (request, response) => {
    try {
        const DBresponse = await blankUserData.find({ 
            email: request.query.email,
            purchased: { $in: [request.query.projectID] }
        });
        if (DBresponse.length > 0) {
            response.status(200).json({ eligible: true });
        } else {
            response.status(200).json({ eligible: false });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

// export const paymentInitiateAPI = (req, res) => {
//     const {amount, email, seller, buyer, projectID} = req.body
//     const totalAmount = JSON.stringify(amount);

//     var orderId = `ORDERID_${Date.now()}`
//     var custId = `CUST_${Date.now()}`
//     var params = {};
  
//     /* initialize an array */
//     (params["MID"] = mid),
//     (params["WEBSITE"] = "DEFAULT"),
//     (params["CHANNEL_ID"] = "WEB"),
//     (params["INDUSTRY_TYPE_ID"] = "Retail"),
//     (params["ORDER_ID"] = orderId),
//     (params["CUST_ID"] = custId),
//     (params["TXN_AMOUNT"] = totalAmount),
//     (params["CALLBACK_URL"] = "http://localhost:8000/callback"),
//     (params["EMAIL"] = email),
//     (params["MOBILE_NO"] = mobileNo);

//     // Extra data 
//     (params["SELLER"] = seller);
//     (params["BUYER"] = buyer);
//     (params["PROJECT_ID"] = projectID);
  
//     /**
//      * Generate checksum by parameters we have
//      * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
//      */
//     var paytmChecksum = PaytmChecksum.generateSignature(
//       params,
//       key
//     );
//     paytmChecksum
//       .then(function (checksum) {
//         let paytmParams = {
//           ...params,
//           CHECKSUMHASH: checksum,
//         };
//         res.json(paytmParams);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
// };

// export const paymentCallBackAPI = async (req, res) => {
//     try {
//         const {ORDERID, RESPMSG, SELLER, BUYER, TXN_AMOUNT, PROJECT_ID} = req.body
        
//         console.log("Received body:", req.body);

//         var paytmChecksum = req.body.CHECKSUMHASH;
//         delete req.body.CHECKSUMHASH;
//         delete req.body.SELLER;
//         delete req.body.BUYER;
//         delete req.body.PROJECT_ID;
//         var isVerifySignature = PaytmChecksum.verifySignature(req.body, key, paytmChecksum);
        
//         if (isVerifySignature) {
//             console.log("Checksum Matched");
//             if(req.body.STATUS === "TXN_SUCCESS"){
//                 try {   
//                     // Make an API request to fetch data from the database
//                     const balanceResponse = await axios.get(`${API_URI}/get-balance`, {
//                         params: {email: SELLER},});
//                     const earn = balanceResponse.data.earned;
//                     earn = earn + TXN_AMOUNT * 0.153;
//                     await axios.post(`${API_URI}/update-earn`, JSON.stringify({updatedEarn: earn, email: SELLER}), {
//                         headers: {'Content-Type': 'application/json',},});
//                     await axios.post(`${API_URI}/update-sold`, JSON.stringify({projectID: PROJECT_ID, email: SELLER}), {
//                         headers: {'Content-Type': 'application/json',},});
//                     await axios.post(`${API_URI}/update-purchase`, JSON.stringify({projectID: PROJECT_ID, email: BUYER}), {
//                         headers: {'Content-Type': 'application/json',},});
//                 } catch (error) {
//                     console.error('Error fetching data:', error.message);
//                 }
//                 return res.redirect(`http://localhost:3000/success?orderId=${ORDERID}&message=${RESPMSG}`);
//             } else{
//                 return res.redirect(`http://localhost:3000/failure?orderId=${ORDERID}&message=${RESPMSG}`);
//             }
//         } else {
//             console.log("Checksum Mismatched");
//             return res.send("something went wrong");
//         }
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error 2");
//     }
// };

export const getBalanceAPI = async (request, response) => {
    try {
        console.log(request.query.email);
        const DBresponse = await blankUserData.findOne({ 
            email: request.query.email,
        });
        response.status(200).json({ earned: DBresponse.earned });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

export const updateEarnAPI = async (request, response) => {
    try {
        const updatedEarn = request.body.updatedEarn;
        const email = request.body.email;
        await blankUserData.findOneAndUpdate(
            { email: email },
            { $set: { earned: updatedEarn } },
        );
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const updateSoldAPI = async (request, response) => {
    try {
        const projectID = request.body.projectID;
        const email = request.body.email;
        const result = await blankUserData.findOneAndUpdate(
            { email: email },
            { $push: { sold: projectID } },
        );
        if (!result) {
            return response.status(404).json({ done: false, error: 'User not found.' });
        }
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const updateProjectAPI = async (request, response) => {
    try {
        const project = request.body;
        const result = await myDocument.findOneAndUpdate(
            { _id: project._id },
            { $set: project },
            { new: true }
        );
        if (!result) {
            return response.status(404).json({ done: false, error: 'User not found.' });
        }
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const updateUserDataAPI = async (request, response) => {
    try {
        const userData = request.body;
        const result = await blankUserData.findOneAndUpdate(
            { _id: userData._id },
            { $set: userData },
            { new: true }
        );
        if (!result) {
            return response.status(404).json({ done: false, error: 'User not found.' });
        }
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const updateAvailableDropDownDataAPI = async (request, response) => {
    try {
        const dropdownData = request.body;
        const result = await websiteMetaData.findOneAndUpdate(
            { type: 'available' },
            { $set: dropdownData },
            { new: true }
        );
        if (!result) {
            return response.status(404).json({ done: false, error: 'User not found.' });
        }
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const updatePurchaseAPI = async (request, response) => {
    try {
        const projectID = request.body.projectID;
        const email = request.body.email;
        const result = await blankUserData.findOneAndUpdate(
            { email: email },
            { $push: { purchased: projectID } },
        );
        if (!result) {
            return response.status(404).json({ done: false, error: 'User not found.' });
        }
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const getDropDownDataAPI = async (request, response) => {
    try {
        const result = await websiteMetaData.findOne(
            {type: request.query.range}
        );
        response.status(200).json({ data: result });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const fetchProjectAPI = async (request, response) => {
    try {
        const result = await myDocument.findOne(
            {_id: request.query.projectID}
        );
        response.status(200).json({ project: result , done:true});
    } catch (error) {
        response.status(500).json({ error: error.message, done:false, project: null });
    }
};

export const fetchAllProjectsOfUserAPI = async (request, response) => {
    try {
        const result = await blankUserData.findOne(
            {email: request.query.email}
        );
        response.status(200).json({ projects: result });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const deleteProjectAPI = async (request, response) => {
    try {
        const id = request.body.ID;
        const result = await myDocument.findOneAndDelete({ _id: id });
        if (!result) {
            return response.status(404).json({ done: false, error: 'project not found.' });
        }
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const deleteUserAccountAPI = async (request, response) => {
    try {
        const id = request.body.ID;
        const result = await blankUserData.findOneAndDelete({ _id: id });
        if (!result) {
            return response.status(404).json({ done: false, error: 'project not found.' });
        }
        response.status(200).json({ done: true });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};

export const moveProjectToDeletedAPI = async (request, response) => {
    try{
        const doc = await deletedProjects.create(request.body);
        response.status(200).json({done:true});
    }
    catch(error)
    {
        response.status(500).json({error:error.message, done: false});
    }
};

export const isProjectDeletedAPI = async (request, response) => {
    try{
        const doc = await deletedProjects.findOne({ id: request.query.projectID });
        if(doc)
        {
            response.status(200).json({deleted:true});
        }
        else
        {
            response.status(200).json({deleted:false});
        }
    }
    catch(error)
    {
        response.status(500).json({error:error.message,deleted:true});
    }
};

export const checkProjectOwnershipAPI = async (request, response) => {
    try {
        const { email, projectID } = request.query;
        const doc = await blankUserData.findOne({
            email: email,
            documents: projectID
        });

        if (doc) {
            response.status(200).json({ owner: true });
        } else {
            response.status(200).json({ owner: false });
        }
    } catch (error) {
        response.status(500).json({ error: error.message, owner: false });
    }
};

export const getHomeFeatureProjectsAPI = async (request, response) => {
    try {
        const projectList = await homeFeatureProjects.find();
        if (projectList) {
            response.status(200).json({ exists: true, projects: projectList });
        } else {
            response.status(200).json({ exists: false, projects: null });
        }
    } catch (error) {
        response.status(500).json({ error: error.message, projects: null });
    }
};

export const sendContactMessageAPI = async (request, response) => {
    try{
        const doc = await contactMessage.create(request.body);
        response.status(200).json({id:doc._id});
    }
    catch(error)
    {
        response.status(500).json({error:error.message});
    }
};