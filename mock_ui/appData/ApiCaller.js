
import { ERR_100, ERR_200, ERR_300, API_URL, IPFS_URL } from '/constants';

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

    return IPFS_URL;//ipfsUrl;
}

/** Replaces dashboardData.cropsAndAnimals */
const getProductSummaryList = async () => {

    try{
        const requestOptions = {
             method: 'GET',
             headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetchWithTimeout(`${API_URL}/productlist/`,requestOptions);
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

export { getImagesWebsocket, upsertUserProfile, getUserProfile, getProductSummaryList, getProductDetails }