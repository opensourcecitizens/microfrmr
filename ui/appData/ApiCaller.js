
import { ERR_100, ERR_200, ERR_300, API_URL, IPFS_URL } from '../constants';

const api_url = API_URL;
const ipfsUrl = IPFS_URL;

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 2000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  let response ;
  try{
      response = await fetch(resource, {
        ...options,
        signal: controller.signal
      });
      console.log('ApiCaller response = '+JSON.stringify(response))
  }//catch(error){
  //  console.log("fetchWithTimeout error = ",error);
  //  throw error;
  //}
  finally{
    clearTimeout(id);
  }

  return response;
}

const getImagesWebsocket = async () => {
    console.log("getImagesWebsocket IPFS_URL = ",IPFS_URL);
    return IPFS_URL;//ipfsUrl;
}


const getListingsList = async () => {

    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        console.log(" API_URL : " + API_URL);
        const response = await fetchWithTimeout(`${API_URL}/listingslist/`,requestOptions);
        console.log("API response : " + JSON.stringify(response));
        if(!response.ok){
            console.error("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        if(res && res.data){
            console.log('getListingsList res',res );
            return res.data;
        }else return ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

const getListingDetails = async (listingId, agentId, farmId ) => {
    console.log("apicaller getListingDetails ${API_URL}",`${api_url}`);

    if(!listingId) throw new Error(ERR_200,"listingId cannot be empty or null");
    //console.log("apicaller getListingDetails; listingId",listingId, '; agentId=',agentId,'; farmId=',farmId);
    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetchWithTimeout(`${API_URL}/listingdetails/${listingId}`,requestOptions);
        if(!response.ok){
            console.log("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        if(res && res.data){
            //add farm and agent details
            //console.log('apicaller getListingDetails','res.data = ',res.data);
            let ret = await enrichListingDetails(res.data[0], agentId, farmId);
            //console.log('apicaller getListingDetails enrichListingDetails','ret = ',ret);
            return ret;
        }else return ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

const enrichListingDetails = async (listingData, agentId, farmId) => {
    console.log('apicaller enrichListingDetails ...','listingData',listingData,'agentId=',agentId,'farmId=',farmId);
    if(agentId){
       try{
            let prof =  await getUserDetails(agentId);
            console.log('apicaller enrichListingDetails','userDetails prof=',prof);
        }catch(error) {
            //
            console.warn(error);
        }finally{
        }
    }

    if(farmId){
       try{
            let farmres = await getFarmDetails(farmId);
            let farm = farmres[0];
            console.log('apicaller enrichListingDetails','getFarmDetails farm=',farm);
            listingData.farmName = farm?.name;
            listingData.profile_image = farm?.profile_image;
            listingData.farmAddress = farm?.address;
            listingData.farmPhone = farm?.phone;
            listingData.farmEmail = farm?.email;
        }catch(error){
            //
            console.warn(error);
        }finally{
        }
    }
    console.log('apicaller enrichListingDetails ...','listingData',listingData);
    return listingData;
}

const getUserDetails = async (userId) => {
    console.log("apicaller getUserDetails ${API_URL}",`${api_url}`);

    if(!userId) throw new Error(ERR_200,"userId cannot be empty or null");

    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetchWithTimeout(`${API_URL}/userprofile/${userId}`,requestOptions);
        if(!response.ok){
            console.log("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        if(res && res.data){
            return res.data;
        }else return ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

const getFarmDetails = async (farmId) => {
    console.log("apicaller getFarmDetails ${API_URL}",`${api_url}`);

    if(!farmId) throw new Error(ERR_200,"farmId cannot be empty or null");

    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetchWithTimeout(`${API_URL}/farmdetails/${farmId}`,requestOptions);
        if(!response.ok){
            console.log("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        if(res && res.data){
            return res.data;
        }else return ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

/** Replaces dashboardData.cropsAndAnimals */
const getProductSummaryList = async () => {

    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        console.log(" API_URL : " + API_URL);
        const response = await fetchWithTimeout(`${API_URL}/productlist/`,requestOptions);
        console.log("API response : " + JSON.stringify(response));
        if(!response.ok){
            console.error("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        if(res && res.data){
            console.log('getProductSummaryList res',res );
            return res.data;
        }else return ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

/** Replaces dashboardData.cards */
const getProductDetails = async (productId) => {
    console.log("apicaller getProposalAttributes ${API_URL}",`${api_url}`);

    if(!productId) throw new Error(ERR_200,"productId cannot be empty or null");

    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetchWithTimeout(`${API_URL}/productdetails/${productId}`,requestOptions);
        if(!response.ok){
            console.log("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        if(res && res.data){
            return res.data;
        }else return ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

const upsertUserProfile = async (profileObj ) => {
    console.log("apicaller upsertUserProfile ${API_URL}",`${api_url}`);
    console.log("apicaller upsertUserProfile profileObj->",profileObj);

    if(!profileObj || profileObj==={}) throw new Error(ERR_200+"profileObj cannot be empty or null");
    try{
        //const attrData = JSON.stringify(profileObj);//await Base64.encode(JSON.stringify(projObj));
        const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: profileObj
            };
        const response = await fetchWithTimeout(`${API_URL}/userprofile/`,requestOptions);
        if(!response.ok){
            console.log("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        if(res && res.data){
            console.log("upsertUserProfile res data " + JSON.stringify(res.data));
            return res.data;
        }else return ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

const getUserProfile = async (userId)=>{

    console.log("apicaller getUserProfile ${API_URL}",`${api_url}`);
    console.log("apicaller getUserProfile userId=",userId);

    if(!userId) throw new Error(ERR_200+"userId cannot be empty or null");

    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetchWithTimeout(`${API_URL}/userprofile/${userId}`,requestOptions);
        if(!response.ok){
            console.error("API response was not ok: " + JSON.stringify(response));
            throw new Error(ERR_100+'API response was not ok.');
        }
        const res = await response.json();
        //console.log("getUserProfile res " + JSON.stringify(res));
        if(res && res.data){
            console.log("getUserProfile ret " + JSON.stringify(res.data));
            return res.data;
        }else return res ;
    }catch(error){
        console.error(error);
        //throw error;
        throw new Error(ERR_300+error.message);
    }
}

export { getImagesWebsocket, upsertUserProfile, getUserProfile, getProductSummaryList, getProductDetails,
getListingsList, getListingDetails }