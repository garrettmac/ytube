'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lowbar = require('./lowbar');

var _lowbar2 = _interopRequireDefault(_lowbar);

var _youtubeNode = require('youtube-node');

var _youtubeNode2 = _interopRequireDefault(_youtubeNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var format = function format(response) {
  var needHardFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var getThumbnails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var results = response;
  if (needHardFormat == true) results = _lowbar2.default.get(response, 'data', { kind: null });
  //  console.log(" results.kind: ",results.kind);
  if (results.kind === "youtube#channel") getThumbnails = true;
  if (getThumbnails === true) {
    var _results$thumbnails;

    results.thumbnail = _lowbar2.default.get(results, 'thumbnails.default.url');
    results.thumbnails = (_results$thumbnails = {
      medium: _lowbar2.default.get(results, 'thumbnails.medium.url'),
      high: _lowbar2.default.get(results, 'thumbnails.high.url'),
      standard: _lowbar2.default.get(results, 'thumbnails.standard.url')
    }, _defineProperty(_results$thumbnails, 'medium', _lowbar2.default.get(results, 'thumbnails.medium.url')), _defineProperty(_results$thumbnails, 'maxres', _lowbar2.default.get(results, 'thumbnails.maxres.url')), _results$thumbnails);
  }
  //  console.log(" ______ results.kind: ",results.kind);

  if (results.kind === "youtube#searchListResponse") {
    var firstResult = _lowbar2.default.get(response, 'data.items', [])[0];
    if (firstResult.id.kind === "youtube#channel") {
      firstResult.kind = "youtube#channel";
      return _lowbar2.default.get(firstResult, "snippet");
    } else {
      throw "No YouTube Channel";
    }
  } else if (results.kind === "youtube#playlistListResponse") {

    var channelsPlaylists = _lowbar2.default.get(results, 'items', []);
    if (!channelsPlaylists.length) return channelsPlaylists;
    return channelsPlaylists.map(function (playlist) {
      return {
        kind: playlist.kind,
        playlistId: playlist.id,
        publishedAt: _lowbar2.default.get(playlist, "snippet.publishedAt", ""),
        channelId: _lowbar2.default.get(playlist, "snippet.channelId", ""),
        title: _lowbar2.default.get(playlist, "snippet.title", ""),
        description: _lowbar2.default.get(playlist, "snippet.description", ""),
        itemCount: _lowbar2.default.get(playlist, "snippet.contentDetails.itemCount", 0)
      };
    });

    //  firstResult.kind="youtube#channel"
  } else if ("youtube#channel") {
    results.kind = "youtube#channel";
    if (!results.items) {
      return results;
    } else {
      //videos in channel
      return results.items.map(function (video) {
        var _thumbnails, _ref;

        return _ref = {
          kind: video.kind,
          playlistItemId: video.id,
          publishedAt: _lowbar2.default.get(video, "snippet.publishedAt", ""),
          channelId: _lowbar2.default.get(video, "snippet.channelId", ""),
          title: _lowbar2.default.get(video, "snippet.title", ""),
          description: _lowbar2.default.get(video, "snippet.description", ""),
          channelTitle: _lowbar2.default.get(video, "snippet.contentDetails.channelTitle"),
          playlistId: _lowbar2.default.get(video, "snippet.contentDetails.playlistId"),
          position: _lowbar2.default.get(video, "snippet.contentDetails.position")
        }, _defineProperty(_ref, 'kind', _lowbar2.default.get(video, "snippet.contentDetails.resourceId.kind")), _defineProperty(_ref, 'videoId', _lowbar2.default.get(video, "snippet.contentDetails.resourceId.videoId")), _defineProperty(_ref, 'thumbnail', _lowbar2.default.get(video, 'snippet.thumbnails.default.url')), _defineProperty(_ref, 'thumbnails', (_thumbnails = {
          medium: _lowbar2.default.get(video, 'snippet.thumbnails.medium.url'),
          high: _lowbar2.default.get(video, 'snippet.thumbnails.high.url'),
          standard: _lowbar2.default.get(video, 'snippet.thumbnails.standard.url')
        }, _defineProperty(_thumbnails, 'medium', _lowbar2.default.get(video, 'snippet.thumbnails.medium.url')), _defineProperty(_thumbnails, 'maxres', _lowbar2.default.get(video, 'snippet.thumbnails.maxres.url')), _thumbnails)), _ref;
      });
    }
  } else if ("youtube#playlist") {
    results.kind = "youtube#playlist";
    return results;
  } else if ("youtube#playlist") {
    results.kind = "youtube#playlist";

    var playlist = _lowbar2.default.get(results, "snippet");
    delete playlist.localized;
  } else {
    return results;
  }
};

var ytube = function () {
  function ytube(YOUTUBE_API_KEY) {
    _classCallCheck(this, ytube);

    this.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
    this.YouTubeNode = new _youtubeNode2.default();
    this.YouTubeNode.setKey(YOUTUBE_API_KEY);
  }

  _createClass(ytube, [{
    key: 'log',
    value: function log() {
      console.log(" this.YOUTUBE_API_KEY: ", this.YOUTUBE_API_KEY);
    }
  }, {
    key: 'getYouTubePlayListItems',
    value: async function getYouTubePlayListItems(YouTubePlaylistId) {
      return this.YouTubeAPI('playlistItems?part=snippet&maxResults=50&playlistId=' + YouTubePlaylistId)
      //.map(p=>_.get(p,'snippet',[]))
      .then(function (o) {
        return _lowbar2.default.get(o, 'data.items', []).map(function (p) {
          return p.snippet;
        });
      }).then(function (data) {
        return data.map(function (i) {
          i.videoId = i.resourceId.videoId;
          i.thumbnail = _lowbar2.default.get(i, 'thumbnails.default.url');
          var thumbnails = [];
          _lowbar2.default.keys(i.thumbnails).map(function (o, x) {
            return thumbnails[x] = i.thumbnails[o].url;
          });
          i.thumbnails = thumbnails;
          delete i.resourceId;
          return i;
        });
      }).catch(console.warn);
    }

    // channels?part=contentDetails&forUsername=OneDirectionVEVO


  }, {
    key: 'getYouTubeById',
    value: async function getYouTubeById(id) {
      // return this.YouTubeAPI(`search?q=${q}`)
      // .then(console.log)
      return new Promise(function (resolve, reject) {
        if (!id) return reject("no id");
        return YouTubeNode.getById(id, function (error, result) {
          console.log("result: raw", result);
          var o = {};
          o.videos = _lowbar2.default.get(result, 'items', []).map(function (p) {
            return p.snippet;
          });
          o.statistics = result.statistics;
          resolve(o);
        });
      });
    }
  }, {
    key: 'searchYouTubeChannel',
    value: async function searchYouTubeChannel(q) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      //  async searchYouTubeForCompany(q,count=1) {
      try {
        var response = await this.YouTubeAPI('search?q=' + q + '&maxResults=' + count + '&part=snippet');
        var responseFormatted = await format(response, true);
        responseFormatted = await format(responseFormatted, false, true);
        return responseFormatted;
      } catch (error) {
        console.error(error);
      }
    }
  }, {
    key: 'getYouTubeChannelVideosr',
    value: async function getYouTubeChannelVideosr(q) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

      //  async searchYouTubeForCompany(q,count=1) {
      try {
        var response = await this.YouTubeAPI('channels?part=contentDetails&forUsername=' + q + '&maxResults=' + count);
        var responseFormatted = await format(response, true);
        responseFormatted = await format(responseFormatted, false, true);
        return responseFormatted;
      } catch (error) {
        console.error(error);
      }
    }
  }, {
    key: 'getPlaylistVideos',
    value: async function getPlaylistVideos(playListId) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

      try {
        // return this.YouTubeAPI(`playlistItems?part=snippet&maxResults=50&playlistId=${YouTubePlaylistId}`)

        var response = await this.YouTubeAPI('playlistItems?part=snippet&playlistId=' + playListId + '&maxResults=' + count);
        // console.log(" response: ",response);
        var responseFormatted = await format(response, true);
        responseFormatted = await format(responseFormatted, false, true);
        return responseFormatted;
      } catch (error) {
        console.error(error);
      }
    }
  }, {
    key: 'getChannelsPlayLists',
    value: async function getChannelsPlayLists(channelId) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

      //  async searchYouTubeForCompany(q,count=1) {
      try {
        var response = await this.YouTubeAPI('playlists?channelId=' + channelId + '&part=snippet,contentDetails&maxResults=' + count);
        var responseFormatted = await format(response, true);
        responseFormatted = await format(responseFormatted, false, true);
        return responseFormatted;
      } catch (error) {
        console.error(error);
      }
    }
  }, {
    key: 'getYouTubeVideoComments',
    value: async function getYouTubeVideoComments(VideoID) {
      return this.YouTubeAPI('commentThreads?&textFormat=plainText&part=snippet&maxResults=50&videoId=' + VideoID).then(function (o) {
        return _lowbar2.default.get(o, 'data.items', []).map(function (p) {
          return p.snippet;
        });
      });
    }
  }, {
    key: 'fetchAllYouTube',
    value: async function fetchAllYouTube(companyName) {
      var _this = this;

      try {
        var yt = await this.searchYouTubeChannel(companyName);
        if (!yt) throw "No YouTube Channel Found";
        yt.thumbnails = _lowbar2.default.removeFalsy(yt.thumbnails);
        if (yt.channelId) {
          var channelsPlaylists = await this.getChannelsPlayLists(yt.channelId);
          var playlists = await Promise.all(channelsPlaylists.map(async function (playlist, i) {
            //get videos in channel
            var videos = await _this.getPlaylistVideos(playlist.playlistId);
            //return videos into playlist item
            return Object.assign({}, channelsPlaylists[i], { videos: videos });
          }));
          yt.playlists = playlists;
          return yt;
        }
        return yt;
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: 'YouTubeAPI',
    get: function get() {
      return _axios2.default.create({
        baseURL: 'https://www.googleapis.com/youtube/v3',
        responseType: "json",
        timeout: 5000,
        params: {
          key: this.YOUTUBE_API_KEY
        }
      });
    }
  }]);

  return ytube;
}();

exports.default = ytube;