import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FetchAlbums, FetchSelected } from '../actions'
import 'bootstrap/dist/css/bootstrap.min.css';
class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            albums : [],
            loading : true
        };
      }

    componentDidMount = () => {
        this.props.toggleInit();
    }

    handleClick = (e) => {
        this.props.toggleSelectAlbum(e.target.id, e.target.getAttribute('name'));
        this.props.history.push('/SelectedAlbum');
    }

    render = () => {
        return(
            <React.Fragment>
                <center>
                <h1>Albums</h1><br/>
                <table style={{width:'80%'}} className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Album Title</th>
                        <th>Album Owner ID</th>
                    </tr>
                </thead>
                <tbody>
                {
                    (!this.props.loading) ? 
                    (this.props.albums.map(album => {
                        return(
                            <tr key={album.id}>
                                <td id ={album.id} name={album.title} onClick={this.handleClick}>{album.title}</td>
                                <td>{album.userName}</td>
                            </tr>
                        )
                    })
                ) : (
                <tr key="1">
                    <td>Loading...</td>
                    <td>Loading...</td>
                </tr>
                )
                }
                </tbody>
            </table>
            </center>
            </React.Fragment>
        )
    }

}

List.propTypes = {
    albums: PropTypes.array,
    toggleInit: PropTypes.func.isRequired,
    toggleSelectAlbum: PropTypes.func.isRequired
  }

var mapStateToProps = function(state){
    return {
      albums : state.albums,
      users : state.users,
      loading : state.loadingList
    };
  }
var mapDispatchToProps = function(dispatch){
    return {
      toggleInit:()=>{
        dispatch(FetchAlbums())
      },
      toggleSelectAlbum:(albumId, albumTitle)=>{
        dispatch(FetchSelected(albumId, albumTitle))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(List);