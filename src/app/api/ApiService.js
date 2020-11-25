import Axios from "axios";
import { getAuthToken } from "../config/Persistence";
import { LogoutUser } from "../config/Persistence";
import { Alert } from "react-native";

const BASE_URL = "http://35.188.220.243:1337/";

const SHOP_LOGIN = "shoplogin";
const GENERATE_OTP = "generateotp";
const SHOP = "shop";

const FETCH_PRODUCTS = "products";
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

service.interceptors.response.use((response) => {
  console.log("[API] response intercepted data", response.data.message);
  if (!response.data.status && response.data.tokenExpired) {
    //TODO Show Alert Session has expired
    Alert.alert(
      "Your Session has Expired!",
      "Don't worry though. You just need to login again & you're set.",
      [
        {
          text: "Continue",
          style: "default",
          onPress: () => {
            LogoutUser()
              .then((success) => {
                if (success) {
                  //setAuthorization(false);
                }
              })
              .catch((error) => {
                console.log("failed to logout after session expiry", error);
              });
          },
        },
      ]
    );
  }
  return response;
});

async function SessionValidator(response) {
  try {
    return new Promise(function (resolve, reject) {
      if (!response.data.status && response.data.message === "session has expired") {
        //TODO Logout of Session with Alert
        reject("Session Expired");
      } else {
        //return original response
        resolve(response);
      }
    });
  } catch (error) {}
}

async function generateLoginOTP(login) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(GENERATE_OTP, login, {
        headers: {
          Authorization: `Bearer ${token}`,
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

async function loginToShop(login) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(SHOP_LOGIN, login, {
        headers: {
          Authorization: `Bearer ${token}`,
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

async function getProductsFromShop(shopId) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.get(`${FETCH_PRODUCTS}/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function getCustomersForShop(shopId) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.get(`${GET_CUSTOMERS}/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function addCustomerToShop(customer) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(POST_CUSTOMERS, customer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function generateOrder(order) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(POST_ORDER, order, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function getCatalogueLinks(shopId) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.get(`${GET_CATALOGUE_LINKS}/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function generateCatalogueLink(link) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(GENERATE_LINK, link, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function regenerateLinkOtp(link) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(REGENERATE_OTP, link, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function expireCatalogueLink(linkId) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.delete(`${DELETE_LINK}/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.status);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function shortShareableLink(link) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(
        SHORT_LINK,
        { Url: link },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        resolve(response.data.data);
      } else {
        reject(response.data.message);
      }
    });
  } catch (error) {
    console.log("request error", error.message);
  }
}

async function logoutFromShop(shopId, deviceId) {
  var token = await getAuthToken();
  try {
    return new Promise(async function (resolve, reject) {
      const response = await service.post(`${LOG_OUT}/${shopId}/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        resolve(response.data.status);
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

export {
  TestSampleApi,
  generateLoginOTP,
  loginToShop,
  getProductsFromShop,
  getCustomersForShop,
  addCustomerToShop,
  generateOrder,
  getCatalogueLinks,
  generateCatalogueLink,
  regenerateLinkOtp,
  expireCatalogueLink,
  shortShareableLink,
  logoutFromShop,
};
