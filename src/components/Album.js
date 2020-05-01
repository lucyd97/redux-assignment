import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toggleSelectPhoto } from '../actions'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
class Album extends React.Component {

    handleClick = (e) => {
        var selectedPhoto = e.target.getAttribute('name');
        this.props.photos.map(photo => {
            if (photo.id == selectedPhoto) {
                this.props.toggleSelectPhoto(photo);
            }
        })
        this.props.history.push('/SelectedPhoto');
    }

    returnHome = () => {
        this.props.history.push('/');
    }

    render = () => {
        return(
            <React.Fragment>
                <center>
                {
                    this.props.loading ? (
                        <React.Fragment>
                            <h1>Loading...</h1>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <h1>Album '{this.props.albumTitle}'</h1><br/>
                            <nav>
                                <p><span onClick={this.returnHome} className="link">Home</span> > {this.props.albumTitle}</p> 
                            </nav>
                            <table style={{width:'80%'}} className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Thumbnail</th>
                                    <th>Photo Title</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.photos.map(photo => {
                                    return(
                                        <tr key={photo.id} id={photo.id}>
                                        <td><img src={photo.thumbnailUrl} name={photo.id} onClick={this.handleClick} alt={photo.title}/></td>
                                        <td>{photo.title}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                            </table>
                        </React.Fragment>
                    )
                }
                
                </center>
            </React.Fragment>
        )
    }

}

Album.propTypes = {
    photos: PropTypes.array,
    albumeTitle: PropTypes.string,
    loading: PropTypes.bool,
    toggleSelectPhoto: PropTypes.func.isRequired
  }

var mapStateToProps = function(state){
    return {
      photos : state.selectedAlbumPhotos,
      albumTitle : state.selectedAlbumTitle,
      loading : state.loadingAlbums
    };
  }
var mapDispatchToProps = function(dispatch){
    return {
      toggleSelectPhoto:(photo)=>{
        dispatch(toggleSelectPhoto(photo))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Album);