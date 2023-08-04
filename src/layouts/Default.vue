<template>
  <div class="layout">
    <header class="heading">
    	<h1>Those Looks - Laundry and Taxes (Preview)</h1>
    	<p><a href="https://weathervanemusic.squarespace.com/open-recording-sessions" target="_blank">Weathervane Music Open Session (OS1)</a></p>
    </header>
    <slot/>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>


</style>
