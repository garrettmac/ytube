function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import axios from 'axios';
import _ from './lowbar';

import YouTube from 'youtube-node';

/**
* Formates JSON resoponce form youtube api
* @method format
* @param  {Bool} hardFormat - Response needs formatted for the first time
* @param  {Bool} flattenThumbs - flattens thumbnails
* @return {Obj}
*/

const thumbs = o => {
  o.thumbnail = _.get(o, 'thumbnails.default.url');
  o.thumbnails = {
    medium: _.get(o, 'thumbnails.medium.url'),
    high: _.get(o, 'thumbnails.high.url'),
    standard: _.get(o, 'thumbnails.standard.url'),
    medium: _.get(o, 'thumbnails.medium.url'),
    maxres: _.get(o, 'thumbnails.maxres.url')
  };
  return o;
};

export const format = (response, hardFormat = false, flattenThumbs = false) => {
  let results = response;
  if (hardFormat == true) results = _.get(response, 'data', { kind: null });
  //  console.log(" results.kind: ",results.kind);
  if (results.kind === "youtube#channel") flattenThumbs = true;
  if (flattenThumbs === true) {
    results.thumbnail = _.get(results, 'thumbnails.default.url');
    results.thumbnails = {
      medium: _.get(results, 'thumbnails.medium.url'),
      high: _.get(results, 'thumbnails.high.url'),
      standard: _.get(results, 'thumbnails.standard.url'),
      medium: _.get(results, 'thumbnails.medium.url'),
      maxres: _.get(results, 'thumbnails.maxres.url')
    };
  }

  if (results.kind === "youtube#searchListResponse") {
    let firstResult = _.get(response, 'data.items', [])[0];
    if (firstResult.id.kind === "youtube#channel") {
      firstResult.kind = "youtube#channel";
      return _.get(firstResult, "snippet");
    } else {
      throw "No YouTube Channel";
    }
  } else if (results.kind === "youtube#playlistListResponse") {

    let channelsPlaylists = _.get(results, 'items', []);
    if (!channelsPlaylists.length) return channelsPlaylists;
    return channelsPlaylists.map(playlist => {
      return {
        kind: playlist.kind,
        playlistId: playlist.id,
        publishedAt: _.get(playlist, "snippet.publishedAt", ""),
        channelId: _.get(playlist, "snippet.channelId", ""),
        title: _.get(playlist, "snippet.title", ""),
        description: _.get(playlist, "snippet.description", ""),
        itemCount: _.get(playlist, "snippet.contentDetails.itemCount", 0)
      };
    });

    //  firstResult.kind="youtube#channel"
  } else if ("youtube#channel") {
    results.kind = "youtube#channel";
    if (!results.items) {
      return results;
    } else {
      //videos in channel
      return results.items.map(video => {
        return {
          kind: video.kind,
          playlistItemId: video.id,
          publishedAt: _.get(video, "snippet.publishedAt", ""),
          channelId: _.get(video, "snippet.channelId", ""),
          title: _.get(video, "snippet.title", ""),
          description: _.get(video, "snippet.description", ""),
          channelTitle: _.get(video, "snippet.contentDetails.channelTitle"),
          playlistId: _.get(video, "snippet.contentDetails.playlistId"),
          position: _.get(video, "snippet.contentDetails.position"),
          kind: _.get(video, "snippet.contentDetails.resourceId.kind"),
          videoId: _.get(video, "snippet.contentDetails.resourceId.videoId"),
          thumbnail: _.get(video, 'snippet.thumbnails.default.url'),
          thumbnails: {
            medium: _.get(video, 'snippet.thumbnails.medium.url'),
            high: _.get(video, 'snippet.thumbnails.high.url'),
            standard: _.get(video, 'snippet.thumbnails.standard.url'),
            medium: _.get(video, 'snippet.thumbnails.medium.url'),
            maxres: _.get(video, 'snippet.thumbnails.maxres.url')
          }
        };
      });
    }
  } else if ("youtube#playlist") {
    results.kind = "youtube#playlist";
    return results;
  } else if ("youtube#playlist") {
    results.kind = "youtube#playlist";

    let playlist = _.get(results, "snippet");
    delete playlist.localized;
  } else {
    return results;
  }
};

export default class ytube {
  constructor(YOUTUBE_API_KEY) {
    this.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
    this.YouTubeNode = new YouTube();
    this.YouTubeNode.setKey(YOUTUBE_API_KEY);
  }

  get YouTubeAPI() {
    return axios.create({
      baseURL: `https://www.googleapis.com/youtube/v3`,
      responseType: "json",
      timeout: 5000,
      params: {
        key: this.YOUTUBE_API_KEY
      }
    });
  }
  log() {
    console.log(" this.YOUTUBE_API_KEY: ", this.YOUTUBE_API_KEY);
  }

  //  async getYouTubePlayListItems(YouTubePlaylistId,params=""){
  //   return this.YouTubeAPI(`playlistItems?part=snippet&maxResults=50&playlistId=${YouTubePlaylistId}${params}`)
  //   //.map(p=>_.get(p,'snippet',[]))
  //   .then((o)=>_.get(o, 'data.items', []).map(p=>p.snippet))
  //   .then(data=>{
  // return data.map((i) => {
  //       i.videoId=i.resourceId.videoId
  //       i.thumbnail= _.get(i, 'thumbnails.default.url')
  //       let thumbnails=[]
  //       _.keys(i.thumbnails).map((o,x) =>thumbnails[x]=i.thumbnails[o].url)
  //       i.thumbnails=thumbnails
  //       delete i.resourceId
  //       return i
  //     })
  // }).catch(console.warn)
  // }

  // channels?part=contentDetails&forUsername=OneDirectionVEVO


  getYouTubeById(id) {
    return _asyncToGenerator(function* () {
      // return this.YouTubeAPI(`search?q=${q}`)
      // .then(console.log)
      return new Promise(function (resolve, reject) {
        if (!id) return reject("no id");
        return YouTubeNode.getById(id, function (error, result) {
          console.log("result: raw", result);
          var o = {};
          o.videos = _.get(result, 'items', []).map(p => p.snippet);
          o.statistics = result.statistics;
          resolve(o);
        });
      });
    })();
  }

  searchYouTubeChannel(q, count = 1, params = "") {
    var _this = this;

    return _asyncToGenerator(function* () {
      //  async searchYouTubeForCompany(q,count=1) {
      try {
        let response = yield _this.YouTubeAPI(`search?q=${q}&maxResults=${count}&part=snippet${params}`);
        let responseFormatted = yield format(response, true);
        responseFormatted = yield format(responseFormatted, false, true);
        return responseFormatted;
      } catch (e) {
        return Promise.reject(e);
      }
    })();
  }

  getYouTubeChannelVideos(q, count = 5, params = "") {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      //  async searchYouTubeForCompany(q,count=1) {
      try {
        let response = yield _this2.YouTubeAPI(`channels?part=contentDetails&forUsername=${q}&maxResults=${count}${params}`);
        let responseFormatted = yield format(response, true);
        responseFormatted = yield format(responseFormatted, false, true);
        return responseFormatted;
      } catch (e) {
        return Promise.reject(e);
      }
    })();
  }
  getChannelsLatestVideos(channelId, count = 5, params = "") {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      try {
        let response = yield _this3.YouTubeAPI(`search?order=date&part=snippet&channelId=${channelId}&maxResults=${count}${params}`).then(function (x) {
          return x.data;
        }).then(function (o) {
          let nextPageToken = o.nextPageToken;
          let totalResults = o.pageInfo.totalResults;
          let resultsPerPage = o.pageInfo.resultsPerPage;
          return { nextPageToken, totalResults, resultsPerPage, latest: o.items.map(function (o) {
              return Object.assign({}, o.id, o.snippet);
            }).map(function (x) {
              return thumbs(x);
            }) };
        });
        return response;
      } catch (e) {
        return Promise.reject(e);
      }
    })();
  }

  getPlaylistVideos(playListId, count = 5, params = "") {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      try {
        // return this.YouTubeAPI(`playlistItems?part=snippet&maxResults=50&playlistId=${YouTubePlaylistId}`)

        let response = yield _this4.YouTubeAPI(`playlistItems?part=snippet&playlistId=${playListId}&maxResults=${count}${params}`);
        // console.log(" response: ",response);
        let responseFormatted = yield format(response, true);
        responseFormatted = yield format(responseFormatted, false, true);
        return responseFormatted;
      } catch (e) {
        return Promise.reject(e);
      }
    })();
  }

  getChannelsPlayLists(channelId, count = 5, params = "") {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      //  async searchYouTubeForCompany(q,count=1) {
      try {
        let response = yield _this5.YouTubeAPI(`playlists?channelId=${channelId}&part=snippet,contentDetails&maxResults=${count}${params}`);
        let responseFormatted = yield format(response, true);
        responseFormatted = yield format(responseFormatted, false, true);
        return responseFormatted;
      } catch (e) {
        return Promise.reject(e);
      }
    })();
  }
  getYouTubeVideoComments(VideoID) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return _this6.YouTubeAPI(`commentThreads?&textFormat=plainText&part=snippet&maxResults=50&videoId=${VideoID}${params}`).then(function (o) {
        return _.get(o, 'data.items', []).map(function (p) {
          return p.snippet;
        });
      });
    })();
  }

  fetchAllYouTube(companyName) {
    var _this7 = this;

    return _asyncToGenerator(function* () {

      try {
        let yt = yield _this7.searchYouTubeChannel(companyName);
        if (!yt) throw "No YouTube Channel Found";
        yt.thumbnails = _.removeFalsy(yt.thumbnails);
        if (yt.channelId) {
          let channelsPlaylists = yield _this7.getChannelsPlayLists(yt.channelId);
          const playlists = yield Promise.all(channelsPlaylists.map((() => {
            var _ref = _asyncToGenerator(function* (playlist, i) {
              //get videos in channel
              let videos = yield _this7.getPlaylistVideos(playlist.playlistId);
              //return videos into playlist item
              return Object.assign({}, channelsPlaylists[i], { videos: videos });
            });

            return function (_x, _x2) {
              return _ref.apply(this, arguments);
            };
          })()));
          yt.playlists = playlists;
          return yt;
        }
        return yt;
      } catch (e) {
        return Promise.reject(e);
      }
    })();
  }
}