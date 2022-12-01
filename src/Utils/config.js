import LocalStorage from "../common/LocalStorage";


export const googlemapApiForAutoCheckPoint = "AIzaSyBneTg3c_jrr3lB3XHeeg8EV_B6ntUUXzs";
let url = "https://theleaddesk.com";

export const handleUrl = () => {
  LocalStorage.GetData('URL')
    .then(res => {
      console.log('REs', res)
      if (res) {
        url = res
      } else {
        url = "https://theleaddesk.com"
      }
    })
}
export const urlDev = `${url}/api/index.php/`;
export const urlResource = `${url}/assets/uploads/`;

export var initialUrl = urlDev;
export default {
  clientId: "8puWuJWZYls1Ylawxm6CMiYREhsGGSyw",
  url: initialUrl,
  bannerUnitId: "",
  interstitialUnitId: "",
  rewardedUnitId: ""
};
