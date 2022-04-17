<template>
  <div class="layout">
    <header class="heading">
    	<h1>Those Looks - Cults Near Me (Preview)</h1>
    	<p>Velvet wave from the wilds of New Jersey.</p>
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
