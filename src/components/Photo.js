import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
class Photo extends React.Component {

    returnToAlbum = () => {
        this.props.history.push('/SelectedAlbum');
    }
    
    returnHome = () => {
        this.props.history.push('/');
    }

    render = () => {
        return(
            <React.Fragment>
                <center>
                <h1>Photo: '{this.props.photo.title}'</h1><br/>
                <nav>
                    <p><span onClick={this.returnHome} className="link">Home</span> > <span onClick={this.returnToAlbum} className="link">{this.props.albumTitle}</span> > {this.props.photo.title}</p> 
                </nav>
                <img src={this.props.photo.url} alt={this.props.photo.title}/>
                </center>
            </React.Fragment>
        )
    }

}

Photo.propTypes = {
    photo: PropTypes.object,
  }

var mapStateToProps = function(state){
    return {
      photo : state.selectedPhoto,
      albumTitle : state.selectedAlbumTitle
    };
  }

export default connect(mapStateToProps)(Photo);