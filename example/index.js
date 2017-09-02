import  YTube from '../src';


let ytube=new YTube("AIza***");//use your api key




ytube.fetchAllYouTube("MSNBC")
  .then((value) => {
    console.log(" value: ",JSON.stringify(value));
  }).catch((e)=>console.log(e))
