import { firebase } from "../../config.js";

const firebaseUrl = (url) => {
    return firebase.database().ref(url);
}

export default firebaseUrl;