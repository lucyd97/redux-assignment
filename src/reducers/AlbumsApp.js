const defaultState = {
    albums : [],
    selectedAlbumPhotos : [],
    selectedAlbumTitle : '',
    selectedPhoto : '',
    loadingList : true,
    loadingAlbums : true
  }
  
  const defectsApp = (state = defaultState, action) => {
      switch (action.type) {
        case 'TOGGLE_INIT':
        return Object.assign({},state,
            {albums: [
                ...action.albums
            ],
            loadingList : false
            });
        case 'TOGGLE_LOADING':
        return Object.assign({},state,
            {
            loadingAlbums : true
            });
        case 'TOGGLE_SELECT_ALBUM':
        return Object.assign({},state,
            {selectedAlbumPhotos: [
                ...action.photos
            ],
            selectedAlbumTitle:action.title,
            loadingAlbums : false
            });
        case 'TOGGLE_SELECT_PHOTO':
        return Object.assign({}, state,
        {
            selectedPhoto:action.photo
        });
        default:
          return state
      }
    }
    
    export default defectsApp