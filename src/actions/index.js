import axios from 'axios';

export function toggleInit(albums){
    return {
      type:"TOGGLE_INIT",
      albums
    }
  }

export function toggleSelectAlbum(photos, title){
    return {
        type:"TOGGLE_SELECT_ALBUM",
        photos,
        title
    }
}

export function toggleSelectPhoto(photo){
    return {
        type:"TOGGLE_SELECT_PHOTO",
        photo
    }
}

export function toggleLoading(){
    return {
        type:"TOGGLE_LOADING"
    }
}

export function FetchAlbums() {
    const requestOne = axios.get("http://jsonplaceholder.typicode.com/albums");
    const requestTwo = axios.get("http://jsonplaceholder.typicode.com/users");
    return function(dispatch) {
    return axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
        const albums = responses[0].data
        const users = responses[1].data
        albums.map(album => {
            var userPos = album.userId - 1;
            album.userName = users[userPos].name;
        });
        dispatch(toggleInit(albums))
      }));
    }
}

export function FetchSelected(albumId, title) {
    var url = "http://jsonplaceholder.typicode.com/albums/" + albumId + "/photos"
    return function(dispatch) {
        dispatch(toggleLoading())
        return axios.get(url)
          .then(({ data }) => {
          dispatch(toggleSelectAlbum(data, title));
        });
      };  
}