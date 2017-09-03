'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lowbar = require('./lowbar');

var _lowbar2 = _interopRequireDefault(_lowbar);

var _youtubeNode = require('youtube-node');

var _youtubeNode2 = _interopRequireDefault(_youtubeNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
* Formates JSON resoponce form youtube api
* @method format
* @param  {Bool} hardFormat - Response needs formatted for the first time
* @param  {Bool} flattenThumbs - flattens thumbnails
* @return {Obj}
*/

var thumbs = function thumbs(o) {
  var _o$thumbnails;

  o.thumbnail = _lowbar2.default.get(o, 'thumbnails.default.url');
  o.thumbnails = (_o$thumbnails = {
    medium: _lowbar2.default.get(o, 'thumbnails.medium.url'),
    high: _lowbar2.default.get(o, 'thumbnails.high.url'),
    standard: _lowbar2.default.get(o, 'thumbnails.standard.url')
  }, _defineProperty(_o$thumbnails, 'medium', _lowbar2.default.get(o, 'thumbnails.medium.url')), _defineProperty(_o$thumbnails, 'maxres', _lowbar2.default.get(o, 'thumbnails.maxres.url')), _o$thumbnails);
  return o;
};

var format = exports.format = function format(response) {
  var hardFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var flattenThumbs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var results = response;
  if (hardFormat == true) results = _lowbar2.default.get(response, 'data', { kind: null });
  //  console.log(" results.kind: ",results.kind);
  if (results.kind === "youtube#channel") flattenThumbs = true;
  if (flattenThumbs === true) {
    var _results$thumbnails;

    results.thumbnail = _lowbar2.default.get(results, 'thumbnails.default.url');
    results.thumbnails = (_results$thumbnails = {
      medium: _lowbar2.default.get(results, 'thumbnails.medium.url'),
      high: _lowbar2.default.get(results, 'thumbnails.high.url'),
      standard: _lowbar2.default.get(results, 'thumbnails.standard.url')
    }, _defineProperty(_results$thumbnails, 'medium', _lowbar2.default.get(results, 'thumbnails.medium.url')), _defineProperty(_results$thumbnails, 'maxres', _lowbar2.default.get(results, 'thumbnails.maxres.url')), _results$thumbnails);
  }

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


  }, {
    key: 'getYouTubeById',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new Promise(function (resolve, reject) {
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
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getYouTubeById(_x3) {
        return _ref2.apply(this, arguments);
      }

      return getYouTubeById;
    }()
  }, {
    key: 'searchYouTubeChannel',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(q) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        var response, responseFormatted;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.YouTubeAPI('search?q=' + q + '&maxResults=' + count + '&part=snippet' + params);

              case 3:
                response = _context2.sent;
                _context2.next = 6;
                return format(response, true);

              case 6:
                responseFormatted = _context2.sent;
                _context2.next = 9;
                return format(responseFormatted, false, true);

              case 9:
                responseFormatted = _context2.sent;
                return _context2.abrupt('return', responseFormatted);

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2['catch'](0);
                return _context2.abrupt('return', Promise.reject(_context2.t0));

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 13]]);
      }));

      function searchYouTubeChannel(_x4) {
        return _ref3.apply(this, arguments);
      }

      return searchYouTubeChannel;
    }()
  }, {
    key: 'getYouTubeChannelVideos',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(q) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        var response, responseFormatted;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.YouTubeAPI('channels?part=contentDetails&forUsername=' + q + '&maxResults=' + count + params);

              case 3:
                response = _context3.sent;
                _context3.next = 6;
                return format(response, true);

              case 6:
                responseFormatted = _context3.sent;
                _context3.next = 9;
                return format(responseFormatted, false, true);

              case 9:
                responseFormatted = _context3.sent;
                return _context3.abrupt('return', responseFormatted);

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3['catch'](0);
                return _context3.abrupt('return', Promise.reject(_context3.t0));

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 13]]);
      }));

      function getYouTubeChannelVideos(_x7) {
        return _ref4.apply(this, arguments);
      }

      return getYouTubeChannelVideos;
    }()
  }, {
    key: 'getChannelsLatestVideos',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(channelId) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        var response;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.YouTubeAPI('search?order=date&part=snippet&channelId=' + channelId + '&maxResults=' + count + params).then(function (x) {
                  return x.data;
                }).then(function (o) {
                  var nextPageToken = o.nextPageToken;
                  var totalResults = o.pageInfo.totalResults;
                  var resultsPerPage = o.pageInfo.resultsPerPage;
                  return { nextPageToken: nextPageToken, totalResults: totalResults, resultsPerPage: resultsPerPage, latest: o.items.map(function (o) {
                      return Object.assign({}, o.id, o.snippet);
                    }).map(function (x) {
                      return thumbs(x);
                    }) };
                });

              case 3:
                response = _context4.sent;
                return _context4.abrupt('return', response);

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4['catch'](0);
                return _context4.abrupt('return', Promise.reject(_context4.t0));

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 7]]);
      }));

      function getChannelsLatestVideos(_x10) {
        return _ref5.apply(this, arguments);
      }

      return getChannelsLatestVideos;
    }()
  }, {
    key: 'getPlaylistVideos',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(playListId) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        var response, responseFormatted;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.YouTubeAPI('playlistItems?part=snippet&playlistId=' + playListId + '&maxResults=' + count + params);

              case 3:
                response = _context5.sent;
                _context5.next = 6;
                return format(response, true);

              case 6:
                responseFormatted = _context5.sent;
                _context5.next = 9;
                return format(responseFormatted, false, true);

              case 9:
                responseFormatted = _context5.sent;
                return _context5.abrupt('return', responseFormatted);

              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5['catch'](0);
                return _context5.abrupt('return', Promise.reject(_context5.t0));

              case 16:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 13]]);
      }));

      function getPlaylistVideos(_x13) {
        return _ref6.apply(this, arguments);
      }

      return getPlaylistVideos;
    }()
  }, {
    key: 'getChannelsPlayLists',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(channelId) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        var response, responseFormatted;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.YouTubeAPI('playlists?channelId=' + channelId + '&part=snippet,contentDetails&maxResults=' + count + params);

              case 3:
                response = _context6.sent;
                _context6.next = 6;
                return format(response, true);

              case 6:
                responseFormatted = _context6.sent;
                _context6.next = 9;
                return format(responseFormatted, false, true);

              case 9:
                responseFormatted = _context6.sent;
                return _context6.abrupt('return', responseFormatted);

              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6['catch'](0);
                return _context6.abrupt('return', Promise.reject(_context6.t0));

              case 16:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 13]]);
      }));

      function getChannelsPlayLists(_x16) {
        return _ref7.apply(this, arguments);
      }

      return getChannelsPlayLists;
    }()
  }, {
    key: 'getYouTubeVideoComments',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(VideoID) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt('return', this.YouTubeAPI('commentThreads?&textFormat=plainText&part=snippet&maxResults=50&videoId=' + VideoID + params).then(function (o) {
                  return _lowbar2.default.get(o, 'data.items', []).map(function (p) {
                    return p.snippet;
                  });
                }));

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getYouTubeVideoComments(_x19) {
        return _ref8.apply(this, arguments);
      }

      return getYouTubeVideoComments;
    }()
  }, {
    key: 'fetchAllYouTube',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(companyName) {
        var _this = this;

        var yt, channelsPlaylists, playlists;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return this.searchYouTubeChannel(companyName);

              case 3:
                yt = _context9.sent;

                if (yt) {
                  _context9.next = 6;
                  break;
                }

                throw "No YouTube Channel Found";

              case 6:
                yt.thumbnails = _lowbar2.default.removeFalsy(yt.thumbnails);

                if (!yt.channelId) {
                  _context9.next = 16;
                  break;
                }

                _context9.next = 10;
                return this.getChannelsPlayLists(yt.channelId);

              case 10:
                channelsPlaylists = _context9.sent;
                _context9.next = 13;
                return Promise.all(channelsPlaylists.map(function () {
                  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(playlist, i) {
                    var videos;
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            _context8.next = 2;
                            return _this.getPlaylistVideos(playlist.playlistId);

                          case 2:
                            videos = _context8.sent;
                            return _context8.abrupt('return', Object.assign({}, channelsPlaylists[i], { videos: videos }));

                          case 4:
                          case 'end':
                            return _context8.stop();
                        }
                      }
                    }, _callee8, _this);
                  }));

                  return function (_x21, _x22) {
                    return _ref10.apply(this, arguments);
                  };
                }()));

              case 13:
                playlists = _context9.sent;

                yt.playlists = playlists;
                return _context9.abrupt('return', yt);

              case 16:
                return _context9.abrupt('return', yt);

              case 19:
                _context9.prev = 19;
                _context9.t0 = _context9['catch'](0);
                return _context9.abrupt('return', Promise.reject(_context9.t0));

              case 22:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 19]]);
      }));

      function fetchAllYouTube(_x20) {
        return _ref9.apply(this, arguments);
      }

      return fetchAllYouTube;
    }()
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