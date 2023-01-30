<template>
    <div class="rating">
      <span v-for="n in 5" :key="n" :class="['star', n <= value ? 'filled' : '']" ></span>
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
    data() {
      return {
      };
    },
    methods: {
      updateValue(value) {
        this.value = value;
      }
    }
  };
  </script>
  
  <style>
  .rating {
    display: inline-block;
  }
  
  .star {
    display: inline-block;
    font-size: 1.5em;
    cursor: pointer;
  }
  
  .star:before {
    content: '★';
  }
  
  .filled {
    color: gold;
  }
  </style>