
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
export const format=(response,hardFormat=false,flattenThumbs=false) =>{
   let results=response
   if(hardFormat==true)results=_.get(response, 'data', {kind:null})
  //  console.log(" results.kind: ",results.kind);
   if(results.kind==="youtube#channel")flattenThumbs=true
if(flattenThumbs===true){
   results.thumbnail= _.get(results, 'thumbnails.default.url')
   results.thumbnails={
     medium:_.get(results, 'thumbnails.medium.url'),
     high:_.get(results, 'thumbnails.high.url'),
     standard:_.get(results, 'thumbnails.standard.url'),
     medium:_.get(results, 'thumbnails.medium.url'),
     maxres:_.get(results, 'thumbnails.maxres.url'),
   }
}

   if(results.kind==="youtube#searchListResponse"){
     let firstResult= _.get(response, 'data.items', [])[0]
     if(firstResult.id.kind==="youtube#channel"){
       firstResult.kind="youtube#channel"
       return _.get(firstResult, "snippet")
     }else{
       throw "No YouTube Channel"
     }
   }else if(results.kind==="youtube#playlistListResponse"){

     let channelsPlaylists= _.get(results, 'items', [])
     if(!channelsPlaylists.length)return channelsPlaylists
    return channelsPlaylists.map((playlist) => {
       return {
         kind:playlist.kind,
         playlistId:playlist.id,
         publishedAt:_.get(playlist,"snippet.publishedAt",""),
         channelId:_.get(playlist,"snippet.channelId",""),
         title:_.get(playlist,"snippet.title",""),
         description:_.get(playlist,"snippet.description",""),
         itemCount:_.get(playlist,"snippet.contentDetails.itemCount",0),
       }
     })

      //  firstResult.kind="youtube#channel"

   }else if("youtube#channel"){
      results.kind="youtube#channel"
      if(!results.items){
      return results
    }else{
      //videos in channel
      return results.items.map((video) => {
         return {
           kind:video.kind,
           playlistItemId:video.id,
           publishedAt:_.get(video,"snippet.publishedAt",""),
           channelId:_.get(video,"snippet.channelId",""),
           title:_.get(video,"snippet.title",""),
           description:_.get(video,"snippet.description",""),
           channelTitle:_.get(video,"snippet.contentDetails.channelTitle"),
           playlistId:_.get(video,"snippet.contentDetails.playlistId"),
           position:_.get(video,"snippet.contentDetails.position"),
           kind:_.get(video,"snippet.contentDetails.resourceId.kind"),
           videoId:_.get(video,"snippet.contentDetails.resourceId.videoId"),
           thumbnail: _.get(video, 'snippet.thumbnails.default.url'),
           thumbnails:{
             medium:_.get(video, 'snippet.thumbnails.medium.url'),
             high:_.get(video, 'snippet.thumbnails.high.url'),
             standard:_.get(video, 'snippet.thumbnails.standard.url'),
             medium:_.get(video, 'snippet.thumbnails.medium.url'),
             maxres:_.get(video, 'snippet.thumbnails.maxres.url'),
           }
         }
       })
    }

   }else if("youtube#playlist"){
      results.kind="youtube#playlist"
      return results
 }else if("youtube#playlist"){
   results.kind="youtube#playlist"

   let playlist=_.get(results, "snippet")
   delete playlist.localized
 }else {return results}
 }



export default class ytube {
  constructor(YOUTUBE_API_KEY) {
    this.YOUTUBE_API_KEY=YOUTUBE_API_KEY
    this.YouTubeNode=new YouTube();
    this.YouTubeNode.setKey(YOUTUBE_API_KEY)
  }

  get YouTubeAPI(){
    return axios.create({
    baseURL:`https://www.googleapis.com/youtube/v3`,
    responseType: "json",
    timeout: 5000,
    params:{
      key:this.YOUTUBE_API_KEY
    }
  })
}
log(){
  console.log(" this.YOUTUBE_API_KEY: ",this.YOUTUBE_API_KEY);
}










 async getYouTubePlayListItems(YouTubePlaylistId){
  return this.YouTubeAPI(`playlistItems?part=snippet&maxResults=50&playlistId=${YouTubePlaylistId}`)
  //.map(p=>_.get(p,'snippet',[]))
  .then((o)=>_.get(o, 'data.items', []).map(p=>p.snippet))
  .then(data=>{
return data.map((i) => {
      i.videoId=i.resourceId.videoId
      i.thumbnail= _.get(i, 'thumbnails.default.url')
      let thumbnails=[]
      _.keys(i.thumbnails).map((o,x) =>thumbnails[x]=i.thumbnails[o].url)
      i.thumbnails=thumbnails
      delete i.resourceId
      return i
    })
}).catch(console.warn)
}

// channels?part=contentDetails&forUsername=OneDirectionVEVO


 async getYouTubeById(id){
 // return this.YouTubeAPI(`search?q=${q}`)
          // .then(console.log)
          return new Promise((resolve, reject) => {
            if (!id) return reject("no id")
              return YouTubeNode.getById(id, function(error, result) {
                console.log("result: raw",result);
                var o={}
                o.videos=_.get(result, 'items', []).map(p=>p.snippet)
                o.statistics =result.statistics
                resolve(o)
          });
        });
}

 async searchYouTubeChannel(q,count=1) {
//  async searchYouTubeForCompany(q,count=1) {
  try {
    let response = await this.YouTubeAPI(`search?q=${q}&maxResults=${count}&part=snippet`);
    let responseFormatted = await format(response,true)
      responseFormatted = await format(responseFormatted,false,true)
      return responseFormatted
   } catch (e) {return Promise.reject(e);}
}

 async getYouTubeChannelVideos(q,count=5) {
//  async searchYouTubeForCompany(q,count=1) {
  try {
    let response = await this.YouTubeAPI(`channels?part=contentDetails&forUsername=${q}&maxResults=${count}`);
    let responseFormatted = await format(response,true)
      responseFormatted = await format(responseFormatted,false,true)
      return responseFormatted
   } catch (e) {return Promise.reject(e);}
}
 async getChannelsLatestVideos(channelId,count=5){
   try {
     let response = await this.YouTubeAPI(`search?order=date&part=snippet&channelId=${channelId}&maxResults=${count}`).then(x=>x.data).then((o)=>{
           let nextPageToken=o.nextPageToken
           let totalResults=o.pageInfo.totalResults
           let resultsPerPage=o.pageInfo.resultsPerPage
           return {nextPageToken,totalResults,resultsPerPage,videos:o.items.map(o=>Object.assign({},o.id,o.snippet)).map(x=>thumbs(x))}
        })


   } catch (e) {return Promise.reject(e);}
 }

 async getPlaylistVideos(playListId,count=5){
          try {
            // return this.YouTubeAPI(`playlistItems?part=snippet&maxResults=50&playlistId=${YouTubePlaylistId}`)

            let response = await this.YouTubeAPI(`playlistItems?part=snippet&playlistId=${playListId}&maxResults=${count}`)
            // console.log(" response: ",response);
            let responseFormatted = await format(response,true)
              responseFormatted = await format(responseFormatted,false,true)
              return responseFormatted
           } catch (e) {return Promise.reject(e);}

}

 async getChannelsPlayLists(channelId,count=5) {
//  async searchYouTubeForCompany(q,count=1) {
  try {
    let response = await this.YouTubeAPI(`playlists?channelId=${channelId}&part=snippet,contentDetails&maxResults=${count}`);
    let responseFormatted = await format(response,true)
      responseFormatted = await format(responseFormatted,false,true)
      return responseFormatted
   } catch (e) {return Promise.reject(e);}
}
 async getYouTubeVideoComments(VideoID){
 return this.YouTubeAPI(`commentThreads?&textFormat=plainText&part=snippet&maxResults=50&videoId=${VideoID}`)
          .then((o)=>_.get(o, 'data.items', []).map(p=>p.snippet))
}





 async fetchAllYouTube(companyName){

  try {
    let yt=await this.searchYouTubeChannel(companyName)
if(!yt)throw "No YouTube Channel Found"
  yt.thumbnails=_.removeFalsy(yt.thumbnails)
  if(yt.channelId){
             let channelsPlaylists = await this.getChannelsPlayLists(yt.channelId);
             const playlists = await Promise.all(channelsPlaylists.map(async (playlist,i) => {
                    //get videos in channel
                   let videos =  await this.getPlaylistVideos(playlist.playlistId)
                   //return videos into playlist item
                   return Object.assign({},channelsPlaylists[i],{videos:videos});
                 }));
                 yt.playlists=playlists
                return yt
}
return yt
} catch (e) {return Promise.reject(e);}
}
}
