<template>
  <Layout>
    <main class="audioPlayer" id="app">
    	<a class="nav-icon" v-on:click="isPlaylistActive=!isPlaylistActive" :class="{'isActive': isPlaylistActive}" title="Music List">
    		  <span></span>
    		  <span></span>
    		  <span></span>
    		</a>
    	<div class="audioPlayerList" :class="{'isActive': isPlaylistActive}">
    		<div class="item" v-for="(item,index) in musicPlaylist" v-bind:class="{ 'isActive':isCurrentSong(index) }" v-on:click="changeSong(index),isPlaylistActive=!isPlaylistActive">
    			<p class="title">{{ item.title }}</p>
    			<p class="artist">{{ item.artist }}</p>
    		</div>

    			<!-- <p class="debugToggle" v-on:click="toggleDebug()">debug: {{ debug }}</p> -->

    	</div>
    	<div class="audioPlayerUI" :class="{'isDisabled': isPlaylistActive}">
    		<div class="albumImage">
    			<transition name="ballmove" enter-active-class="animated zoomIn" leave-active-class="animated fadeOutDown" mode="out-in">
    				<!--<transition name="slide-fade" mode="out-in">-->
    				<img @load="onImageLoaded()" :src="musicPlaylist[currentSong].image" :key="currentSong" ondragstart="return false;" id="playerAlbumArt">
    			</transition>
    			<div class="loader" :key="currentSong">Loading...</div>
    		</div>
    		<div class="albumDetails">
    			<transition name="slide-fade" mode="out-in">
    				<p class="title" :key="currentSong">{{ musicPlaylist[currentSong].title }}</p>
    			</transition>
    			<transition name="slide-fade" mode="out-in">
    				<p class="artist" :key="currentSong">{{ musicPlaylist[currentSong].artist }}</p>
          </transition>
    		</div>

    		<div class="playerButtons">
    			<a class="buttons" :class="{'isDisabled':(currentSong==0)}" v-on:click="prevSong()" title="Previous Song"><Back width="24px" height="24px" /></a>
          <transition name="slide-fade" mode="out-in">
            <Play v-on:click="playAudio()" width="24px" height="24px" title="Play/Pause Song" v-if="currentlyStopped" />
            <Pause v-on:click="stopAudio()" width="24px" height="24px" title="Play/Pause Song" v-else />
          </transition>
    			<a class="buttons" :class="{'isDisabled':(currentSong==musicPlaylist.length-1)}" v-on:click="nextSong()" title="Next Song"><Forward width="24px" height="24px" /></a>

        </div>

    		<div class="currentTimeContainer" style="text-align:center">
    			<span class="currentTime">{{ currentTime | fancyTimeFormat }}</span>
    			<span class="totalTime"> {{ trackDuration | fancyTimeFormat }}</span>
    			<!--<span style="color:black">({{ currentSong+1 }}/{{ musicPlaylist.length }})</span>-->
    		</div>

    		<div class="currentProgressBar">
    			<div class="currentProgress" :style="{ width: currentProgressBar + '%' }"></div>
    		</div>
    	</div>

    </main>
  </Layout>
</template>

<script>
import Play from '~/icons/Play.svg'
import Pause from '~/icons/Pause.svg'
import Forward from '~/icons/Forward.svg'
import Back from '~/icons/Back.svg'
export default {
  metaInfo: {
    title: 'Those Looks - Laundry and Taxes (Preview the Weathervane Open Session)'
  },
  components: {
      Play,
      Pause,
      Forward,
      Back
    },
  data() {
    return {
  		audio: "",
  		imgLoaded: false,
  		currentlyPlaying: false,
  		currentlyStopped: true,
  		currentTime: 0,
  		checkingCurrentPositionInTrack: "",
  		trackDuration: 0,
  		currentProgressBar: 0,
  		isPlaylistActive: false,
  		currentSong: 0,
  		debug: false,
  		musicPlaylist: [
  			{
  				title: "Laundry and Taxes",
  				artist: "Those Looks (Weathervane Music Open Session)",
  				url: "/mp3s/laundryandtaxes_mastered.mp3",
  				image: "/images/laundryandtaxes.jpg"
  			},
  		],
  		audioFile: ""
    }
	},
	mounted: function() {
		this.changeSong();
		this.audio.loop = false;
	},
	filters: {
		fancyTimeFormat: function(s) {
			return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
		}
	},
	methods: {
		togglePlaylist: function() {
			this.isPlaylistActive = !this.isPlaylistActive;
		},
		nextSong: function() {
			if (this.currentSong < this.musicPlaylist.length - 1)
				this.changeSong(this.currentSong + 1);
		},
		prevSong: function() {
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},
		changeSong: function(index) {
			var wasPlaying = this.currentlyPlaying;
			this.imageLoaded = false;
			if (index !== undefined) {
				this.stopAudio();
				this.currentSong = index;
			}
			this.audioFile = this.musicPlaylist[this.currentSong].url;
			this.audio = new Audio(this.audioFile);
			var localThis = this;
			this.audio.addEventListener("loadedmetadata", function() {
				localThis.trackDuration = Math.round(this.duration);
			});
			this.audio.addEventListener("ended", this.handleEnded);
			if (wasPlaying) {
				this.playAudio();
			}
		},
		isCurrentSong: function(index) {
			if (this.currentSong == index) {
				return true;
			}
			return false;
		},
		getCurrentSong: function(currentSong) {
			return this.musicPlaylist[currentSong].url;
		},
		playAudio: function() {
			if (
				this.currentlyStopped == true &&
				// this.currentSong + 1 == this.musicPlaylist.length
        this.currentSong + 1 > this.musicPlaylist.length
			) {
				this.currentSong = 0;
				this.changeSong();
			}
			if (!this.currentlyPlaying) {
				this.getCurrentTimeEverySecond(true);
				this.currentlyPlaying = true;
				this.audio.play();
			} else {
				this.stopAudio();
			}
			this.currentlyStopped = false;
		},
		stopAudio: function() {
			this.audio.pause();
			this.currentlyPlaying = false;
      this.currentlyStopped = true;
			this.pausedMusic();
		},
		handleEnded: function() {
			if (this.currentSong + 1 == this.musicPlaylist.length) {
				this.stopAudio();
				this.currentlyPlaying = false;
				this.currentlyStopped = true;
			} else {
				this.currentlyPlaying = false;
				this.currentSong++;
				this.changeSong();
				this.playAudio();
			}
		},
		onImageLoaded: function() {
			this.imgLoaded = true;
		},
		getCurrentTimeEverySecond: function(startStop) {
			var localThis = this;
			this.checkingCurrentPositionInTrack = setTimeout(
				function() {
					localThis.currentTime = localThis.audio.currentTime;
					localThis.currentProgressBar =
						localThis.audio.currentTime / localThis.trackDuration * 100;
					localThis.getCurrentTimeEverySecond(true);
				}.bind(this),
				1000
			);
		},
		pausedMusic: function() {
			clearTimeout(this.checkingCurrentPositionInTrack);
		},
		toggleDebug: function(){
			this.debug=!this.debug;
			document.body.classList.toggle('debug');
		}
	},
	watch: {
		currentTime: function() {
			this.currentTime = Math.round(this.currentTime);
		}
	},
	beforeDestroy: function() {
		this.audio.removeEventListener("ended", this.handleEnded);
		this.audio.removeEventListener("loadedmetadata", this.handleEnded);

		clearTimeout(this.checkingCurrentPositionInTrack);
	}
}

</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700");
@import url("https://fonts.googleapis.com/css?family=Raleway:400,400i,700");

.debug main * {
  outline: solid 0.25rem rgba(255, 0, 0, 0.25);
}
* {
  box-sizing: border-box;
}
.animated {
  animation-duration: 0.5s;
}
.audioPlayer {
  position: relative;
  background-color: #eceff1;
  min-height: 25rem;
  width: 20rem;
  overflow: hidden;
  padding: 1.5rem;
  margin: 0 auto;
  border-radius: 0.5rem;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  user-select: none;
}
.audioPlayer .nav-icon {
  width: 15px;
  height: 12px;
  position: absolute;
  top: 1.125rem;
  left: 1.5rem;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
  cursor: pointer;
}
.audioPlayer .nav-icon span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 6px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
}
.audioPlayer .nav-icon span:nth-child(1) {
  top: 0px;
}
.audioPlayer .nav-icon span:nth-child(2) {
  top: 5px;
}
.audioPlayer .nav-icon span:nth-child(3) {
  top: 10px;
}
.audioPlayer .nav-icon.isActive span:nth-child(1) {
  top: 5px;
  transform: rotate(135deg);
}
.audioPlayer .nav-icon.isActive span:nth-child(2) {
  opacity: 0;
  left: -60px;
}
.audioPlayer .nav-icon.isActive span:nth-child(3) {
  top: 5px;
  transform: rotate(-135deg);
}
.audioPlayer .audioPlayerList {
  color: rgba(0, 0, 0, 0.75);
  width: 17rem;
  transition: 0.5s;
  transform: translateX(-200%);
  position: absolute;
  margin-top: 1.5rem;
  overflow: auto;
  z-index: 10;
  will-change: transform;
}
.audioPlayer .audioPlayerList.isActive {
  transform: translateX(0);
}
.audioPlayer .audioPlayerList .item {
  margin-bottom: 1.5rem;
  border-left: 0.1rem solid transparent;
  transition: 0.2s;
}
.audioPlayer .audioPlayerList .item:hover {
  padding-left: 0.5rem;
  cursor: pointer;
}
.audioPlayer .audioPlayerList .item .title {
  color: rgba(0, 0, 0, 1);
  font-size: 1rem;
  margin-bottom: 0.75rem;
}
.audioPlayer .audioPlayerList .item .artist {
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.8rem;
}
.audioPlayer .audioPlayerList .item.isActive {
  border-left-color: black;
  padding-left: 1rem;
}
.audioPlayer .audioPlayerList .debugToggle {
  cursor: pointer;
  color: red;
}
.audioPlayer .audioPlayerUI {
  margin-top: 1.5rem;
  will-change: transform, filter;
  transition: 0.5s;
}
.audioPlayer .audioPlayerUI.isDisabled {
  transform: scale(0.75) translateX(100%);
  filter: blur(5px) grayscale(100%);
}
.audioPlayer .audioPlayerUI .albumDetails {
  text-align: center;
  margin: 2rem 0;
}
.audioPlayer .audioPlayerUI .albumDetails p {
  margin: 0px;
}
.audioPlayer .audioPlayerUI .albumDetails p.title {
  font-size: 1rem;
  color: rgba(0, 0, 0, 1);
}
.audioPlayer .audioPlayerUI .albumDetails p.artist {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: none;
  color: rgba(0, 0, 0, 0.75);
  transition-delay: 100ms;
}
.audioPlayer .audioPlayerUI .albumImage {
  width: 17rem;
  height: 17rem;
  overflow: hidden;
  margin: 0 auto;
}
.audioPlayer .audioPlayerUI .albumImage img {
  width: 100%;
  height: 100%;
  z-index: 10;
  object-fit: cover;
  object-position: 50% 50%;
  border-radius: 0.5rem;
}
.audioPlayer .audioPlayerUI .playerButtons {
  position: relative;
  margin: 0 auto;
  text-align: center;
}
.audioPlayer .audioPlayerUI .playerButtons .button {
  font-size: 2rem;
  display: inline-block;
  vertical-align: middle;
  padding: 0.5rem;
  margin: 0 0.25rem;
  color: rgba(0, 0, 0, 0.75);
  border-radius: 50%;
  outline: 0;
  text-decoration: none;
  cursor: pointer;
  transition: 0.5s;
}
.buttons {
  padding: 0 25px;
}
.audioPlayer .audioPlayerUI .playerButtons .button.play {
  font-size: 4rem;
  margin: 0 1.5rem;
}
.audioPlayer .audioPlayerUI .playerButtons .button:active {
  opacity: 0.75;
  transform: scale(0.75);
}
.audioPlayer .audioPlayerUI .playerButtons .button.isDisabled {
  color: rgba(0, 0, 0, 0.2);
  cursor: initial;
}
.audioPlayer .audioPlayerUI .playerButtons .button.isDisabled:active {
  transform: none;
}
.audioPlayer .audioPlayerUI .currentTimeContainer {
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: space-between;
}
.audioPlayer .audioPlayerUI .currentTimeContainer .currentTime, .audioPlayer .audioPlayerUI .currentTimeContainer .totalTime {
  font-size: 0.5rem;
  font-family: monospace;
  color: rgba(0, 0, 0, 0.75);
}
.audioPlayer .audioPlayerUI .currentProgressBar {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0.75rem 0;
}
.audioPlayer .audioPlayerUI .currentProgressBar .currentProgress {
  background-color: rgba(0, 0, 0, 0.75);
  width: 0px;
  height: 1px;
  transition: 100ms;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
}
/* data change transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
/* pen specific formatting */
body {
  background: #aa8f14;
  color: rgba(255, 255, 255, 0.7);
  font-family: Raleway, sans-serif;
  padding: 3rem;
}
.heading {
  text-align: center;
  margin: 0;
  margin: 2rem 0;
  font-family: Inconsolata, monospace;
}
.heading h1 {
  color: #eceff1;
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1.75rem;
}
.heading p {
  margin: 0;
  font-size: 0.85rem;
}
.heading a {
  color: rgba(255, 255, 255, 0.8);
  transition: 0.3s;
  text-decoration-style: dotted;
}
.heading a:hover {
  color: rgba(255, 255, 255, 1) !important;
}
.heading a:visited {
  color: rgba(255, 255, 255, 0.5);
}

</style>
