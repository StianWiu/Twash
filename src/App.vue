<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/videos">Videos</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

@import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap");

* {
  font-family: "Source Code Pro", monospace;
}

body {
  margin: 0;
  padding: 0;
  background: #2e2e2e;
  color: #ffff;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #666666;

  transition: color 0.2s ease-in-out;
}

a:hover {
  color: #42b983;
}

nav a.router-link-exact-active {
  color: #42b983;
}

::-moz-selection {
  /* Code for Firefox */
  color: #2e2e2e;
  background: #42b983;
}

::selection {
  color: #2e2e2e;
  background: #42b983;
}
</style>
