import React, { Component } from 'react';
import { MyThunkDispatch } from '../shared/types/common';
import { bindActionCreators } from 'redux';
import { AppState } from '../shared/types/states';
import SongsBody from '../components/Songs/SongsBody';
import { connect } from 'react-redux';
import { fetchTracks } from '../services/track';
import { Track } from '../shared/types/soundCloud';
import InfiniteScroll from '../components/InfiniteScroll';
import Loader from '../components/Loader';
import { updateCurrentTrack } from '../store/actions/PlayerActions';

const mapStateToProps = (state: AppState) => {
  const activeGenre =
    state.songsFilter.genres[state.songsFilter.activeGenreIndex].query;
  const activeTime =
    state.songsFilter.times[state.songsFilter.activeTimeIndex].key;
  return {
    currentTrack: state.player.currentTrack,
    activeGenre,
    activeTime
  };
};

const mapDispatchToProps = (dispatch: MyThunkDispatch) =>
  bindActionCreators({
    updateCurrentTrack,
  }, dispatch);
export type SongsBodyContainerProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;
export type SongsBodyContainerState = {
  trackList: Track[];
  limit: number;
  offset: number;
};
class SongsBodyContainer extends Component<
  SongsBodyContainerProps,
  SongsBodyContainerState
> {
  readonly state: SongsBodyContainerState = {
    trackList: [],
    limit: 50,
    offset: 0
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(
    prevProps: SongsBodyContainerProps,
    prevState: SongsBodyContainerState
  ) {
    if (prevProps.activeGenre !== this.props.activeGenre) {
      this.setState(() => ({
        trackList: [],
        offset: 0
      }));
      this.fetchData();
    }
  }

  fetchData = () => {
    const { activeGenre, activeTime } = this.props;
    const { offset, limit } = this.state;
    fetchTracks({
      filters: {
        tags: activeGenre,
        limit,
        offset
      }
    }).then(tracks => {
      this.setState(state => ({
        trackList: [...state.trackList, ...tracks],
        offset: state.offset + state.limit
      }));
    });
  };

  handleCardClick = (track: Track) => {
    this.props.updateCurrentTrack(track);
  };

  render() {
    const { currentTrack } = this.props;
    const { trackList } = this.state;
    return (
      <InfiniteScroll
        dataLength={trackList.length}
        next={this.fetchData}
        hasMore={true}
        loader={<Loader className="loader--full" isLoading={true} />}
        endMessage={<div>no more</div>}
        refreshFunction={() => console.log(`refreshFunction`)}
      >
        <SongsBody
          tracks={trackList}
          currentTrack={currentTrack}
          onCardclick={this.handleCardClick}
        />
      </InfiniteScroll>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongsBodyContainer);
