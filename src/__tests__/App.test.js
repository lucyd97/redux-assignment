import React from 'react';
import App from '../components/App'
import configureMockStore from 'redux-mock-store'
import  thunk  from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom'
import { render, fireEvent } from '@testing-library/react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as actions from '../actions'
import AlbumsApp from '../reducers/AlbumsApp';
import { albums, users, photos, mockLoadingState, mockLoadedState, mockSelectedPhotoState, 
    mockDefaultState, mockSelectedAlbumState } from '../mocks/MockStates'
import moxios from 'moxios';

Enzyme.configure({ adapter: new Adapter() })

const mockStore = configureMockStore([thunk]);

describe('Action creators', () => {
    it('should create an action to initialise the app - fetch and store the initial data', () => {
      const expectedAction = {
        type: "TOGGLE_INIT",
        albums
      }
      expect(actions.toggleInit(albums)).toEqual(expectedAction)
    })

    it('should create an action to select an album', () => {
        var title = albums[0].title;
        const expectedAction = {
          type: "TOGGLE_SELECT_ALBUM",
          photos,
          title
        }
        expect(actions.toggleSelectAlbum(photos, title)).toEqual(expectedAction)
      })

    it('should create an action to select a photo', () => {
        var photo = photos[0];
        const expectedAction = {
            type: "TOGGLE_SELECT_PHOTO",
          photo
        }
        expect(actions.toggleSelectPhoto(photo)).toEqual(expectedAction)
    })

    it('should create an action to toggle loading state', () => {
        const expectedAction = {
            type: "TOGGLE_LOADING"
        }
        expect(actions.toggleLoading()).toEqual(expectedAction)
    })
  })

describe('Reducer ', () => {
    it('should return the inital state', () => {
        expect(AlbumsApp(undefined, {})).toEqual(
            {
                albums : [],
                selectedAlbumPhotos : [],
                selectedAlbumTitle : '',
                selectedPhoto : '',
                loadingList : true,
                loadingAlbums : true
            }
          )
    })

    it('should handle TOGGLE_LOADING', () => {
        expect(
            AlbumsApp(mockDefaultState, {
                type: "TOGGLE_LOADING",
            })
        ).toEqual(
            {
                loadingAlbums : true,
                ...mockDefaultState
            }
        )
    })

    it('should handle TOGGLE_INIT', () => {
        expect(
            AlbumsApp(mockDefaultState, {
                type: "TOGGLE_INIT",
                albums: albums
            })
        ).toEqual(
            {
                albums : albums,
                loadingList : false,
                ...mockLoadedState
            }
        )
    })

    it('should handle TOGGLE_SELECT_ALBUM', () => {
        var title = albums[0].title;
        expect(
            AlbumsApp(mockLoadedState, {
                type: "TOGGLE_SELECT_ALBUM",
                photos: photos,
                title: title

            })
        ).toEqual(
            {
                selectedAlbumPhotos : photos,
                selectedAlbumTitle : title,
                loadingAlbums : false,
                ...mockSelectedAlbumState
            }
        )
    })

    it('should handle TOGGLE_SELECT_PHOTO', () => {
        var photo = photos[0];
        expect(
            AlbumsApp(mockSelectedAlbumState, {
                type: "TOGGLE_SELECT_PHOTO",
                photo: photo

            })
        ).toEqual(
            {
                selectedPhoto : photo,
                ...mockSelectedPhotoState
            }
        )
    })

})

describe('Component rendering/routing', () => {
    it('renders App component then renders List component and displays "Loading..." when loadingList state is true', () => {
        const store = mockStore(mockLoadingState);
        const { container } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        expect(container.innerHTML).toMatch('Albums')
        expect(container.innerHTML).toMatch('Loading...')
    })

    it('renders App component then renders List component and displays list of Albums when loadingList state is false', () => {
        const store = mockStore(mockLoadedState);
        const { container } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        expect(container.innerHTML).toMatch('Albums')
        expect(container.innerHTML).toMatch('quidem molestiae enim')
    })

    it('renders Album component and displays "Loading..." when "loading" state is true', () => {
        const store = mockStore(mockLoadedState);
        const { container, getByText } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        fireEvent.click(getByText(/quidem molestiae enim/i))
        expect(container.innerHTML).toMatch('Loading...')
    })

    it('renders Album component and displays the contents of the album when "loading" state is false', () => {
        const store = mockStore(mockSelectedAlbumState);
        const { container } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        expect(container.innerHTML).toMatch("Album 'quidem molestiae enim'")
    })

    it('routes back to List component when "Home" link is clicked from Album component', () => {
        const store = mockStore(mockSelectedAlbumState);
        const { container, getByText } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        expect(container.innerHTML).toMatch("Album 'quidem molestiae enim'")
        fireEvent.click(getByText(/Home/i))
        expect(container.innerHTML).toMatch('Albums')
    })

    it('renders Photo component when photo is selected', () => {
        const store = mockStore(mockSelectedPhotoState);
        const { container, getByText, getByAltText } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        fireEvent.click(getByText(/quidem molestiae enim/i))
        fireEvent.click(getByAltText(/accusamus beatae ad facilis cum similique qui sunt/i))
        expect(container.innerHTML).toMatch('accusamus beatae ad facilis cum similique qui sunt')
    })

    it('routes back to Album component when album name link is clicked from Photo component', () => {
        const store = mockStore(mockSelectedPhotoState);
        const { container, getByText } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        expect(container.innerHTML).toMatch('accusamus beatae ad facilis cum similique qui sunt')
        fireEvent.click(getByText(/quidem molestiae enim/i))
        expect(container.innerHTML).toMatch("Album 'quidem molestiae enim'")
    })

    it('routes back to Home component when "Home "link is clicked from Photo component', () => {
        const store = mockStore(mockSelectedPhotoState);
        const { container, getByText } = render(
        <Router>
        <App store={store}/>
        </Router>
        )
        expect(container.innerHTML).toMatch('accusamus beatae ad facilis cum similique qui sunt')
        fireEvent.click(getByText(/Home/i))
        expect(container.innerHTML).toMatch("Albums")
    })

})

describe('async middleware', () => {
    beforeEach(() => moxios.install())
    afterEach(() => moxios.uninstall())
    it('FetchAlbums dispatches toggleInit with correct data', () => {
          moxios.wait(() => {
            const request = moxios.requests.at(0);
            const request2 = moxios.requests.at(1);
            request.respondWith({
              status: 200,
              response: albums,
            });
            request2.respondWith({
                status: 200,
                response: users,
              });
          });

        const expectedActions = [
            {
              type: "TOGGLE_INIT",
              albums: albums
            }
          ];
          
          const store = mockStore({});
          
          return store.dispatch(actions.FetchAlbums()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
    })
    it('FetchSelected dispatches toggleLoading and toggleSelectAlbum with correct data', () => {
        moxios.wait(() => {
          const request = moxios.requests.at(0);
          request.respondWith({
            status: 200,
            response: photos,
          });
        });

      const expectedActions = [
          {
              type: "TOGGLE_LOADING"
          },
          {
            type: "TOGGLE_SELECT_ALBUM",
            photos: photos,
            title: "quidem molestiae enim"
          }
        ];
        
        const store = mockStore({});
        
        return store.dispatch(actions.FetchSelected(1,"quidem molestiae enim")).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
  })
})
