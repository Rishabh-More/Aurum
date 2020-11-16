import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";

const BASE_URL = "http://35.188.220.243:1337/";
//const BASE_URL = "http://139.59.26.142:1337/";

const AUTH_TOKEN = getAuthToken(); //"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJjcmVhdGVkQXQiOiIyMDIwLTExLTEzVDA4OjU2OjIyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTExLTEzVDA5OjE3OjI1LjAwMFoiLCJpZCI6MTU3LCJkZXZpY2VOYW1lIjoiT25lUGx1cyAzVCBBbmRyb2lkIiwiZGV2aWNlSWQiOiIyMDU5NzM3MWYxMTA3ZWM5IiwiYnJhbmROYW1lIjoiT25lUGx1cyIsIm1vZGVsTmFtZSI6Ik9ORVBMVVMgQTMwMDMiLCJvdHAiOjU2ODksIm90cENyZWF0ZWRBdCI6IjIwMjAtMTEtMTNUMDk6MTc6MjUuMDAwWiIsImF1dGhFeHBpcmVBdCI6bnVsbCwib3RwRXhwaXJlQXQiOiIyMDIwLTExLTEzVDA5OjI3OjI1LjAwMFoiLCJkZWxldGVkQXQiOm51bGwsInNob3BJZCI6MTE1fV0sImlhdCI6MTYwNTI1OTA3MSwiZXhwIjoxNjA1OTE0MjcxfQ.jnpzUUO-AJHEyHdUG2LMIK-K7ktTZ1MspiWgPiNnteQ";

const SHOP_LOGIN = "shoplogin";
const GENERATE_OTP = "generateotp";
const SHOP = "shop";

const FETCH_PRODUCTS = "products/115";
const GET_CUSTOMERS = "customers";
const POST_CUSTOMERS = "customer";

const POST_ORDER = "orderClient";

const GENERATE_LINK = "catalogue/generate";
const GET_CATALOGUE_LINKS = "catalogue";
const REGENERATE_OTP = "catalogue/regenerateOtp";
const DELETE_LINK = "catalogue";

const SHORT_LINK = "shorturl";

const LOG_OUT = "logoutShop";

let service = Axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

async function setAuthTokenToService(token) {
  service.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

async function getAuthToken() {
  try {
    const token = await AsyncStorage.getItem("@auth_token");
    if (token != null) {
      return token;
    }
  } catch (error) {
    console.log("couldn't fetch token from storage");
    return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJjcmVhdGVkQXQiOiIyMDIwLTExLTEzVDA4OjU2OjIyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTExLTEzVDA5OjE3OjI1LjAwMFoiLCJpZCI6MTU3LCJkZXZpY2VOYW1lIjoiT25lUGx1cyAzVCBBbmRyb2lkIiwiZGV2aWNlSWQiOiIyMDU5NzM3MWYxMTA3ZWM5IiwiYnJhbmROYW1lIjoiT25lUGx1cyIsIm1vZGVsTmFtZSI6Ik9ORVBMVVMgQTMwMDMiLCJvdHAiOjU2ODksIm90cENyZWF0ZWRBdCI6IjIwMjAtMTEtMTNUMDk6MTc6MjUuMDAwWiIsImF1dGhFeHBpcmVBdCI6bnVsbCwib3RwRXhwaXJlQXQiOiIyMDIwLTExLTEzVDA5OjI3OjI1LjAwMFoiLCJkZWxldGVkQXQiOm51bGwsInNob3BJZCI6MTE1fV0sImlhdCI6MTYwNTI1OTA3MSwiZXhwIjoxNjA1OTE0MjcxfQ.jnpzUUO-AJHEyHdUG2LMIK-K7ktTZ1MspiWgPiNnteQ";
  }
}

async function SessionValidator(response) {
  try {
    return new Promise(function (resolve, reject) {
      if (!response.data.status && response.data.message == "session has expired") {
        //TODO Logout of Session with Alert
        reject("Session Expired");
      } else {
        //return original response
        resolve(response);
      }
    });
  } catch (error) {}
}

function generateLoginOTP(login) {
  console.log("executing login api");
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(GENERATE_OTP, login, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.data.status) {
        console.log("response received");
        resolve(response.data.status); //TODO resolve either the data or message for otp api
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

function loginToShop(login) {
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(SHOP_LOGIN, login, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.data.status) {
        resolve(response.data.data); //TODO resolve either the data or message for login api
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

function TestSampleApi() {
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.get("https://jsonplaceholder.typicode.com/users");
      if (response.data != null) {
        resolve(response.data);
      } else {
        reject(response.status);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

export { TestSampleApi, generateLoginOTP, loginToShop };
