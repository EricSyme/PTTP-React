import React, { Component } from 'react';
import Home from './HomeComponent';
import About from './AboutComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import RecordingDetail from './RecordingDetailComponent';
import Favorites from './FavoriteComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, postFeedback, fetchRecordings, fetchComments, fetchPromos, fetchLeaders, loginUser, logoutUser, fetchFavorites, postFavorite, deleteFavorite } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
      recordings: state.recordings,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders,
      favorites: state.favorites,
      auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
  postComment: (recordingId, rating, comment) => dispatch(postComment(recordingId, rating, comment)),
  fetchRecordings: () => {dispatch(fetchRecordings())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},
  fetchLeaders: () => dispatch(fetchLeaders()),
  postFeedback: (feedback) => dispatch(postFeedback(feedback)),
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  fetchFavorites: () => dispatch(fetchFavorites()),
  postFavorite: (recordingId) => dispatch(postFavorite(recordingId)),
  deleteFavorite: (recordingId) => dispatch(deleteFavorite(recordingId))
});

class Main extends Component {

  componentDidMount() {
    this.props.fetchRecordings();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    this.props.fetchFavorites();
  }

  render() {

    const HomePage = () => {
      return(
        <Home recording={this.props.recordings.recordings.filter((recording) => recording.featured)[0]}
        recordingsLoading={this.props.recordings.isLoading}
        recordingsErrMess={this.props.recordings.errMess}
          promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
          promosLoading={this.props.promotions.isLoading}
          promosErrMess={this.props.promotions.errMess}
          leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
          leaderLoading={this.props.leaders.isLoading}
          leaderErrMess={this.props.leaders.errMess}
        />
      );
    }

    const RecordingWithId = ({match}) => {
      return(
        this.props.auth.isAuthenticated
        ?
        <RecordingDetail recording={this.props.recordings.recordings.filter((recording) => recording._id === match.params.recordingId)[0]}
          isLoading={this.props.recordings.isLoading}
          errMess={this.props.recordings.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.recording === match.params.recordingId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          favorite={this.props.favorites.favorites.recordings.some((recording) => recording._id === match.params.recordingId)}
          postFavorite={this.props.postFavorite}
          />
        :
        <RecordingDetail recording={this.props.recordings.recordings.filter((recording) => recording._id === match.params.recordingId)[0]}
          isLoading={this.props.recordings.isLoading}
          errMess={this.props.recordings.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.recording === match.params.recordingId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          favorite={false}
          postFavorite={this.props.postFavorite}
          />
      );
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.props.auth.isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }} />
      )} />
    );

    return (
      <div className="background">
        <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser} 
          />   
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />} />
              <Route exact path="/menu" component={() => <Menu recordings={this.props.recordings} />} />
              <Route path="/menu/:recordingId" component={RecordingWithId} />
              <PrivateRoute exact path="/favorites" component={() => <Favorites favorites={this.props.favorites} deleteFavorite={this.props.deleteFavorite} />} />
              <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
