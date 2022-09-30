import { ToastAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

export const CheckConnection = {

    async isconnection(){
        NetInfo.fetch().then(state => {
            if (state.isConnected){
                ToastAndroid.show('Connected', ToastAndroid.TOP);
            } else{
                ToastAndroid.show('Plese Connect the Internet', ToastAndroid.TOP);
            }
        });
    }
    
}
