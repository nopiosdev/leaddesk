import LocalStorage from "../common/LocalStorage";


export const googlemapApiForAutoCheckPoint = "AIzaSyBneTg3c_jrr3lB3XHeeg8EV_B6ntUUXzs";

export let hostUrl = "";
export let urlDev = `${hostUrl}/api/index.php/`;
export let urlResource = `${hostUrl}/assets/uploads/`;
export var initialUrl = urlDev;

LocalStorage.GetData("URL").then((res) => {
  handleUrl(res || "");
});

export const handleUrl = (changeUrl) => {
  if (changeUrl.trim() != "") {
    hostUrl = changeUrl;
  } else {
    hostUrl = "https://theleaddesk.com";
  }
  LocalStorage.SetData("URL", hostUrl);
  urlDev = `${changeUrl}/api/index.php/`;
  urlResource = `${changeUrl}/assets/uploads/`;
  initialUrl = urlDev;
}
console.log(hostUrl);

export default {
  clientId: "8puWuJWZYls1Ylawxm6CMiYREhsGGSyw",
  url: initialUrl,
  bannerUnitId: "",
  interstitialUnitId: "",
  rewardedUnitId: ""
};
