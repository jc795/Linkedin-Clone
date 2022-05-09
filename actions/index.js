import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { auth, Provider, storage } from "../firebase";
import db from "../firebase";

import {
  SET_USER,
  SET_LOADING_STATUS,
  GET_ARTICLES,
} from "../actions/actionType";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (state) => ({
  type: SET_LOADING_STATUS,
  // status: status,
});

export function getArticles(payload) {
  return {
    type: GET_ARTICLES,
    payload: payload,
  };
}
export function signInAPI() {
  return (dispatch) => {
    auth
      .signInWithPopup(Provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function singOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));

    if (payload.image !== "") {
      const storageRef = ref(storage, "images/${payload.image.name}");
      const upload = uploadBytesResumable(storageRef, payload.image);

      upload.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          console.log("Progress: ${progress}%");
          if (snapshot.state === "RUN") {
            console.log("Progress: ${progress}%");
          }
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await getDownloadURL(upload.snapshot.ref).then(
            (url) => console.log(url)
          );
          db.collection("article").add({
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL,
            },
            video: payload.video,
            shareImg: downloadURL,
            comments: 0,
            description: payload.description,
          });
          dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      db.collection("articles").add({
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        shareImg: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticlesAPI() {
  return (dispatch) => {
    dispatch(setLoading(true));
    let payload;
    let id;
    db.collection("articles")
      .orderBy("actor.date", "desc")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => doc.data());
        id = snapshot.docs.map((doc) => doc.id);
        dispatch(getArticles(payload));
      });
    dispatch(setLoading(false));
  };
}
