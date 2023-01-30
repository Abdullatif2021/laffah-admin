<template>
    <div class="rating">
      <i v-for="n in 5" :key="n" :class="['fa', n <= value ? 'fa-star' : 'fa-star-o']"></i>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
  };
  </script>
  
  <style>
  .rating {
    text-align: center;
  }
  .fa-star {
    color: #ffd700;
  }
  .fa-star-o {
    color: #ddd;
  }
  </style>