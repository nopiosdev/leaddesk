import NetInfo from '@react-native-community/netinfo';


export const checkConnection = NetInfo.addEventListener(state => {
    if (!state.isConnected) {
        return <Popup
            show={true}
            title={'Connection Error!'}
            description={'Please turn on your internet connection!'}
            btnText="Try Again"
        // onPress={() => Update.reloadAsync()}
        />
    }
});