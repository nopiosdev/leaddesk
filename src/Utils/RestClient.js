import { ToastAndroid } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import _ from "lodash";
import apiConfig, { urlDev } from "./config";
import axios from 'axios';
import LocalStorage from "../common/LocalStorage";

export const getApi = async (action, headers = {}) => {
  const Token = await LocalStorage.GetData("userToken");

  return await axios.get(`${urlDev}${action}`, { headers: { 'Authorization': 'Bearer ' + (Token != '' ? Token : '') } })
    .then(({ data }) => {
      if (data?.message == 'Unauthorize user!') {
        LocalStorage.ClearData();
      }
      return data;
    })
    .catch((error) => {
      return { success: false, message: "" };
    });
}

export const postApi = async (action, data) => {
  const Token = await LocalStorage.GetData("userToken")
  const url = await LocalStorage.GetData('URL')

  return await axios.post(`${urlDev}${action}`, data, { headers: { "Content-Type": "multipart/form-data", 'Authorization': 'Bearer ' + (Token != '' ? Token : '') } })
    .then(({ data }) => {
      if (data?.message == 'Unauthorize user!') {
        LocalStorage.ClearData();
      }
      return data;
    })
    .catch((error) => {
      return {
        success: false,
        error
      };
    });
};

export const loginPostApi = async (action, headers = {}, body = {}) => {
  try {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        console.log(`body: ${body}`);
        const userToken = await LocalStorage.getItem("userToken");
        let requestHeaders = _.pickBy(
          {
            ...(userToken
              ? {
                Authorization: `Bearer ${userToken}`
              }
              : {
                "Client-ID": apiConfig.clientId
              }),
            ...headers,
            ...{
            }
          },
          item => !_.isEmpty(item)
        );
        let response = await fetch(`${apiConfig.url}${action}`, {
          method: "POST",
          headers: requestHeaders,
          body: "UserName=" + encodeURIComponent(body.UserName) +
            "&Password=" + encodeURIComponent(body.Password) +
            "&grant_type=password",
        });

        let responseJson = await response.json();
        if (response.ok) {
          return { result: responseJson, isSuccess: true, message: "" };
        }
        return { result: null, isSuccess: false, message: "" };
      } else {
        ToastAndroid.show('Please Connect to Internet', ToastAndroid.TOP);
      }
    });
  } catch (error) {
    return { result: null, isSuccess: false, message: error };
  }
};

export const postApiFormDataForPDF = async (
  action,
  headers = {},
  keyValue = {},
  uri = "",
  fileType = "",
  fileName = ""
) => {
  try {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        const userToken = await LocalStorage.getItem("userToken");
        let requestHeaders = _.pickBy(
          {
            ...(userToken
              ? {
                Authorization: `Bearer ${userToken}`
              }
              : {
                "Client-ID": apiConfig.clientId
              }),
            ...headers,
            ...{
              Accept: "application/json",
              "Content-Type": "multipart/form-data"
            }
          },
          item => !_.isEmpty(item)
        );

        var formData = new FormData();
        //Fields in the post
        formData.append(keyValue.key, keyValue.Value);
        // pictureSource is object containing image data.

        if (uri) {
          var document = {
            uri: uri,
            type: 'document/pdf',
            name: 'files.pdf'
          };
          formData.append("files", document);
        }

        console.log(`${apiConfig.url}${action}`);
        let response = await fetch(`${apiConfig.url}${action}`, {
          method: "POST",
          headers: requestHeaders,
          body: formData
        });
        let responseJson = await response.json();
        return { result: responseJson, isSuccess: true, message: "" };
      } else {
        ToastAndroid.show('Please Connect to Internet', ToastAndroid.TOP);
      }
    });
  } catch (error) {
    console.error(error);
    return { result: null, isSuccess: false, message: error };
  }
};

export const postApiFormData = async (
  action,
  headers = {},
  keyValue = {},
  uri = "",
  fileType = "",
  fileName = ""
) => {
  try {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        const userToken = await LocalStorage.getItem("userToken");
        let requestHeaders = _.pickBy(
          {
            ...(userToken
              ? {
                Authorization: `Bearer ${userToken}`
              }
              : {
                "Client-ID": apiConfig.clientId
              }),
            ...headers,
            ...{
              Accept: "application/json",
              "Content-Type": "multipart/form-data"
            }
          },
          item => !_.isEmpty(item)
        );

        var formData = new FormData();
        // Fields in the post
        formData.append(keyValue.key, keyValue.Value);

        // pictureSource is object containing image data.

        if (uri) {
          var photo = {
            uri: uri,
            type: fileType,
            name: fileName
          };
          formData.append("files", photo);
        }
        let response = await fetch(`${apiConfig.url}${action}`, {
          method: "POST",
          headers: requestHeaders,
          body: formData
        });

        if (response.ok) {
          let responseJson = await response.json();
          return { result: responseJson, isSuccess: true, message: "" };
        }
        return { result: null, isSuccess: false, message: response.statusText };
      } else {
        ToastAndroid.show('Please Connect to Internet', ToastAndroid.TOP);
      }
    });
  } catch (error) {
    console.error(error);
    return { result: null, isSuccess: false, message: error };
  }
};

export const deleteApi = async (action, headers = {}) => {
  try {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        const userToken = await LocalStorage.getItem("userToken");
        let requestHeaders = _.pickBy(
          {
            ...(userToken
              ? {
                Authorization: `bearer ${userToken}`
              }
              : {
                "Client-ID": apiConfig.clientId
              }),
            ...headers,
            ...{
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          },
          item => !_.isEmpty(item)
        );

        let response = await fetch(`${apiConfig.url}${action}`, {
          method: "DELETE",
          headers: requestHeaders
        });
        if (response.ok) {
          let responseJson = await response.json();
          return { result: responseJson, isSuccess: true, message: "" };
        }
        return { result: null, isSuccess: false, message: response.statusText };
      } else {
        ToastAndroid.show('Please Connect to Internet', ToastAndroid.TOP);
      }
    });
  } catch (error) {
    return { result: null, isSuccess: false, message: error };
  }
};