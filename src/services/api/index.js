import { ToastAndroid } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import _ from "lodash";
import apiConfig from "./config";
import { CheckConnection } from '../../common/checkNetConnection'
import axios from 'axios';

export const getApi = async (action, headers = {}) => {
  const userToken = await AsyncStorage.getItem("userToken");

  return await axios.get(`${apiConfig.url}${action}`, { headers: { "Content-Type": "multipart/form-data" } })
    .then(async ({ data }) => {
      return data;
    })
    .catch((error) => {
      return { success: false, message: "" };
    });
}



export const postApi = async (action, data) => {
  const userToken = await AsyncStorage.getItem("userToken");
  return await axios.post(`${apiConfig.url}${action}`, data, { headers: { "Content-Type": "multipart/form-data" } })
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      return {
        success: false,
        error
      };
    });
};


// export const postApi = async (action, headers = {}, body = {}) => {
//   try {
//     console.log(`body: ${body}`);
//     const userToken = await AsyncStorage.getItem("userToken");
//     let requestHeaders = _.pickBy(
//       {
//         ...(userToken
//           ? {
//               Authorization: `Bearer ${userToken}`
//             }
//           : {
//               "Client-ID": apiConfig.clientId
//             }),
//         ...headers,
//         ...{
//           "Content-Type": "application/json"
//         }
//       },
//       item => !_.isEmpty(item)
//     );
//     var object = {
//       method: 'POST',
//       headers:requestHeaders,
//       body:body
//   };
//     console.log(`postApi url: ${apiConfig.url}${action}`);
//     console.log(`postApi body`,object);
//     let response = await fetch(`${apiConfig.url}${action}`, object);
//     let responseJson = await response.json();
//     console.log("responseJson",responseJson);
//      if (response.ok) {
//       return { result: responseJson, isSuccess: true, message: "" };
//     }
//     return { result: null, isSuccess: false, message: "" };
//   } catch (error) {
//     console.error(error);
//     return { result: null, isSuccess: false, message: error };
//   }
// };
export const loginPostApi = async (action, headers = {}, body = {}) => {
  try {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        console.log(`body: ${body}`);
        const userToken = await AsyncStorage.getItem("userToken");
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
              // "Content-Type": "application/x-www-form-urlencoded"
            }
          },
          item => !_.isEmpty(item)
        );
        console.log(`postApi url: ${apiConfig.url}${action}`);
        console.log(`postApi body`, "userName=" + encodeURIComponent(body.UserName) +
          "&password=" + encodeURIComponent(body.Password) +
          "&grant_type=password");
        let response = await fetch(`${apiConfig.url}${action}`, {
          method: "POST",
          headers: requestHeaders,
          body: "UserName=" + encodeURIComponent(body.UserName) +
            "&Password=" + encodeURIComponent(body.Password) +
            "&grant_type=password",
        });

        console.log
        let responseJson = await response.json();
        console.log("responseJson", responseJson);
        if (response.ok) {
          return { result: responseJson, isSuccess: true, message: "" };
        }
        return { result: null, isSuccess: false, message: "" };
      } else {
        ToastAndroid.show('Please Connect to Internet', ToastAndroid.TOP);
      }
    });
  } catch (error) {
    console.error(error);
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
        const userToken = await AsyncStorage.getItem("userToken");
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
        const userToken = await AsyncStorage.getItem("userToken");
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

        console.log(`${apiConfig.url}${action}`);
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
        const userToken = await AsyncStorage.getItem("userToken");
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

        console.log(`${apiConfig.url}${action}`);
        let response = await fetch(`${apiConfig.url}${action}`, {
          method: "DELETE",
          headers: requestHeaders
        });
        console.log(response, '..........................')
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