<template>
  <nav class="nav has-shadow">
    <div class="container">
      <router-link to="/category/front-end" exact>
        <img src="http://bstavroulakis.com/pluralsight/courses/vue-spa/logo.png"
          alt="Vue SPA" />
      </router-link>
      <router-link class="nav-item is-tab"
        to="/category/front-end" exact>Front-end</router-link>
      <router-link class="nav-item is-tab"
        to="/category/mobile" exact>Mobile</router-link>
      <router-link class="nav-item is-tab"
        to="/login">Login</router-link>
    </div>
  </nav>
</template>
