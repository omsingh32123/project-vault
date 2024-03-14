import { request, response } from "express";
import File from "../models/file.js";
import myDocument from "../models/mydocument.js";
import blankUserData from "../models/userdata.js";
import websiteMetaData from "../models/metaData.js";
import axios from 'axios';
import PaytmChecksum from 'paytmchecksum';
var mid = "RtZYvX44163568075252"    
var key = "4vnQO9l9aHZzM1X%"
var mobileNo = "8933066862"

export const uploadImage = async (request, response) => {
    const fileObj = {
        path: request.file.path,
        name: request.file.originalname,    
    }
    try{
        const file = await File.create(fileObj);
        response.status(200).json({path:`http://localhost:8000/file/${file._id}`});
    }
    catch(error)
    {
        response.status(500).json({error:error.message});
    }
};

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

export const downloadImage = async (request,response) => {
    try {
        const file = await File.findById(request.params.fileID);
        file.downloadContent++;
        await file.save();
        response.download(file.path,file.name);
    } catch (error) {
        console.log(error.message);
        return response.status(500).json({error: error.message});
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

export const paymentInitiateAPI = (req, res) => {
    const {amount, email, seller, buyer, projectID} = req.body
    const totalAmount = JSON.stringify(amount);

    var orderId = `ORDERID_${Date.now()}`
    var custId = `CUST_${Date.now()}`
    var params = {};
  
    /* initialize an array */
    (params["MID"] = mid),
    (params["WEBSITE"] = "DEFAULT"),
    (params["CHANNEL_ID"] = "WEB"),
    (params["INDUSTRY_TYPE_ID"] = "Retail"),
    (params["ORDER_ID"] = orderId),
    (params["CUST_ID"] = custId),
    (params["TXN_AMOUNT"] = totalAmount),
    (params["CALLBACK_URL"] = "http://localhost:8000/callback"),
    (params["EMAIL"] = email),
    (params["MOBILE_NO"] = mobileNo);

    // Extra data 
    (params["SELLER"] = seller);
    (params["BUYER"] = buyer);
    (params["PROJECT_ID"] = projectID);
  
    /**
     * Generate checksum by parameters we have
     * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
     */
    var paytmChecksum = PaytmChecksum.generateSignature(
      params,
      key
    );
    paytmChecksum
      .then(function (checksum) {
        let paytmParams = {
          ...params,
          CHECKSUMHASH: checksum,
        };
        res.json(paytmParams);
      })
      .catch(function (error) {
        console.log(error);
      });
};

export const paymentCallBackAPI = async (req, res) => {
    try {
        const {ORDERID, RESPMSG, SELLER, BUYER, TXN_AMOUNT, PROJECT_ID} = req.body
        
        console.log("Received body:", req.body);

        var paytmChecksum = req.body.CHECKSUMHASH;
        delete req.body.CHECKSUMHASH;
        delete req.body.SELLER;
        delete req.body.BUYER;
        delete req.body.PROJECT_ID;
        var isVerifySignature = PaytmChecksum.verifySignature(req.body, key, paytmChecksum);
        
        if (isVerifySignature) {
            console.log("Checksum Matched");
            if(req.body.STATUS === "TXN_SUCCESS"){
                try {   
                    // Make an API request to fetch data from the database
                    const balanceResponse = await axios.get(`${API_URI}/get-balance`, {
                        params: {email: SELLER},});
                    const earn = balanceResponse.data.earned;
                    earn = earn + TXN_AMOUNT * 0.153;
                    await axios.post(`${API_URI}/update-earn`, JSON.stringify({updatedEarn: earn, email: SELLER}), {
                        headers: {'Content-Type': 'application/json',},});
                    await axios.post(`${API_URI}/update-sold`, JSON.stringify({projectID: PROJECT_ID, email: SELLER}), {
                        headers: {'Content-Type': 'application/json',},});
                    await axios.post(`${API_URI}/update-purchase`, JSON.stringify({projectID: PROJECT_ID, email: BUYER}), {
                        headers: {'Content-Type': 'application/json',},});
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
                return res.redirect(`http://localhost:3000/success?orderId=${ORDERID}&message=${RESPMSG}`);
            } else{
                return res.redirect(`http://localhost:3000/failure?orderId=${ORDERID}&message=${RESPMSG}`);
            }
        } else {
            console.log("Checksum Mismatched");
            return res.send("something went wrong");
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error 2");
    }
};

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
            {type: "domaintopic"}
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
        response.status(200).json({ project: result });
    } catch (error) {
        response.status(500).json({ error: error.message, done:false });
    }
};
