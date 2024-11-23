let currentsong = new Audio();
let update=document.querySelector(".circle");
let currentfolder;
let songslist;
let ar;
let progbarconatiner=document.getElementById("pgcontainer");
// console.log(currentsong.currentTime)
 //updating seek bar
let pgbar=document.getElementById("pgrs");
// let pg=document.getElementsByClassName(".seek");
//fetching all the songs from the folder and returning in the form of an array
function formatSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

    return formattedTime;
}
async function getsongs(folder) {
    currentfolder=folder
    console.log(currentfolder)
    let songs = await fetch(`${folder}/`);
    let data = await songs.text();
    // console.log(songs)
    // console.log(data)
    // let req=data.getElementById("wrapper");
    // console.log(data)
    let div = document.createElement("div")
    div.innerHTML = data;
    let s = div.getElementsByTagName("a");
    // console.log(s)
     ar = [];
    for (let index = 0; index < s.length; index++) {
        const ele = s[index];
        if (ele.href.endsWith(".mp3")) {
            ar.push(ele.href.split(`${folder}/`)[1].replaceAll("%20", " "));
        }
        // console.log(ele)
    }
    //adding songs to the library
    let adding = document.querySelector("#songlist").getElementsByTagName("ul")[0];
    adding.innerHTML=" "
    for (const song of ar) {
        adding.innerHTML = adding.innerHTML + `<li>
        <img class= "invert" src="music_logo.svg" alt="music_logo">
        <div class="song_info">
            <div class="songname">${song}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img id="libplay" class= "invert" src="play.svg" alt="Play">
        </div>
    </li>`;
    }
     //adding event listener to all the songs in library
     Array.from(document.querySelector("#songlist").getElementsByTagName("li")).forEach(e => {
        // currentsong.src=(e.querySelector(".song_info").firstElementChild.innerHTML)[0];
        e.addEventListener("click", ele => {
            // console.log(e.querySelector(".song_info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".song_info").firstElementChild.innerHTML)
            // console.log(ele)
        })
    })
    return ar;
}
const playmusic = (aud) => {
    currentsong.src = `${currentfolder}/` + aud;
    currentsong.play();
    document.querySelector("#songname").innerHTML = aud;
    playyy.src = "pause.svg";
}
//adding click event to play_button
playyy.addEventListener("click", () => {
    if (currentsong.paused) {
        currentsong.play();
        playyy.src = "pause.svg";
    }
    else {
        currentsong.pause();
        playyy.src = "play.svg";
    }
})
// ccc.addEventListener("click",()=>{
//     if(currentsong.paused)
//     {
//         currentsong.play();
//         libplay.src="pause.svg";
//     }
//     else{
//         currentsong.pause();
//         libplay.src="play.svg";
//     }
// })
//fuction to convert seconds into minutes:seconds format
 async function displayAlbums()
 {
    //this would be the problem i think for not loading albums on server
    let f = await fetch(`public/songs/`);
    console.log(f)
    let response = await f.text();
    // console.log(response)
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a");
    // console.log(anchors)
    let arr=Array.from(anchors);
    let cardcontainer=document.querySelector(".cards")
    // console.log(cardcontainer.innerHTML)
    // console.log(arr)
    for(let i=0;i<anchors.length;i++)
    {
        // console.log(arr[i])
        const e=arr[i];
            if(e.href.includes("public/songs/"))
            {
                // console.log(e)
                let fname=e.href.split("/").slice(-1)[0]
                // console.log(fname)
                // getting metadata of the folder
                let a=await fetch(`public/songs/${fname}/info.json`)
                let jdata=await a.json();
                // console.log(jdata);
                // console.log(cards.innerHTML)
                cardcontainer.innerHTML=cardcontainer.innerHTML +
                `<div data-folder="${fname}" class="card1">
                <div class="playbtn">
                <img src="playbtn.svg" alt="playbtn">
            </div>
            <img src="public/songs/${fname}/cover.jpeg" alt="coverphoto">
            <h3>${jdata.title}</h3>
            <p>${jdata.description}</p>
            </div>`
            }
    }
     //loading songs when ever the cards were clicked
     Array.from(document.getElementsByClassName("card1")).forEach(e=>{
        e.addEventListener("click",async item=>{
            // console.log(item.currentTarget)
            songs = await getsongs(`public/songs/${item.currentTarget.dataset.folder}`); 
            playmusic(songs[0]);
        })
    })
 }

 
async function main() {
    //getting all the songs
    // console.log(currentfolder)
     displayAlbums();
    //  songslist=await getsongs()
    //  console.log(currentfolder)
    // console.log(songslist)
    // console.log(currentsong)
    // console.log(ar)
    playyy.src = "play.svg";
    // console.log(songslist)
    // updating current song duration and playtime
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".min").innerHTML = formatSecondsToMinutesAndSeconds(currentsong.duration)
        document.querySelector(".sec").innerHTML = formatSecondsToMinutesAndSeconds(currentsong.currentTime);
    })
    currentsong.addEventListener("timeupdate",e=>{
        update=parseInt((currentsong.currentTime/currentsong.duration)*100);
        document.getElementById("pgrs").value=update;
        // console.log(update)
        // console.log(document.getElementById("pgrs"));

    })
    //adding event for progress bar on click
    // progbarconatiner.addEventListener("click", e => {
    //     // console.log((e.offssetX/e.getBoundingClientRect().width)*100+"%");
    //     // console.log(e.offsetX);
    //     // console.log(e.target.getBoundingClientRect().width);
    //     const rect =progbarconatiner.getBoundingClientRect();
    //     console.log(e.clientX);
    //     const clicposition=e.clientX - rect.left;
    //     console.log(clicposition/rect.width);

    // })
    pgrs.addEventListener("click", e => {
        const rect = progbarconatiner.getBoundingClientRect(); // Getting bounding rectangle of progress bar container
        const clickPosition = e.clientX - rect.left; // Calculating click position relative to the container's left edge
        const clickPercentage = clickPosition / rect.width; // Calculating click percentage
        currentsong.currentTime = clickPercentage * currentsong.duration; // Setting current time of the song
    });
    // pgrs.addEventListener("click", e => {
    //     const rect = progbarcontainer.getBoundingClientRect();
    //     const clickPosition = e.clientX - rect.left;
    //     const clickPercentage = clickPosition / rect.width;
    //     const newTime = clickPercentage * currentsong.duration;

    //     // Small buffer to ensure smooth seeking
    //     if (newTime >= 0 && newTime <= currentsong.duration) {
    //         currentsong.currentTime = newTime;
    //     }
    // });
    // adding click event to hamburger
    document.querySelector(".burger").addEventListener("click",()=>{
        document.querySelector("#left").style.left="0";
    })
    //adding click event to cross button
    document.querySelector(".closebtn").addEventListener("click",()=>{
        document.querySelector("#left").style.left="-100%";
    })
    // adding event listener to previous button
    previous.addEventListener("click",()=>{
        console.log(songslist.indexOf(currentsong.src.split("/").slice(-1)[0].replaceAll("%20"," ")));
        let songIndex=songslist.indexOf(currentsong.src.split("/").slice(-1)[0].replaceAll("%20"," "));
        if((songIndex-1)>=0)
        {
            playmusic(songslist[songIndex-1])
        }
        // console.log(songslist)
        // console.log(currentsong.src.split("/").slice(-1)[0].replaceAll("%20"," "))
    })
    // adding event listener to next button
    next.addEventListener("click",()=>{
        // console.log(songslist.indexOf(currentsong.src.split("/").slice(-1)[0].replaceAll("%20"," ")));
        let songIndex=songslist.indexOf(currentsong.src.split("/").slice(-1)[0].replaceAll("%20"," "));
        if((songIndex+1)<songslist.length)
        {
            playmusic(songslist[songIndex+1])
        }
        // console.log(songslist)
        // console.log(currentsong.src.split("/").slice(-1)[0].replaceAll("%20"," "))
    })
    //adjusting volume 
    vchange.addEventListener("change",(e)=>{
        // console.log(e.target.value)
        // let volume=e.targe.value/100;
        // console.log(e.target.value/100);

        currentsong.volume=e.target.value/100;
    })
    //adding eventlistener for progress bar
    // pgbar.addEventListener("click",()=>{
    //     //conveting into  duration from percentage
    //     // currentsong.currentTime=pgbar.value*currentsong.duration/100+"%";
    //     console.log(pgbar);
    
    // })
    // currentsong.muted=false;
    var mute=false;
    vbtn.addEventListener("click",()=>{
        mute=!mute
        currentsong.muted=mute
        if(mute)
        {
            vbtn.src="mute.svg"
        }
        else
        {
            vbtn.src="volume.svg"
        }
        // mute=!mute
    })
}

main()