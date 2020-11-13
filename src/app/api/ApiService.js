import Axios from "axios";

const BASE_URL = "http://35.188.220.243:1337/";
//const BASE_URL = "http://139.59.26.142:1337/";

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
