<script lang="ts">
  import Button from "./Button.svelte";
</script>

<main>
  <Button />
</main>

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    /* max-width: 240px; */
    min-height: 100vh;
    min-height: fill-avaliable;
    min-height: --webkit-fill-avaliable;
    margin: 0 auto;
    background: #e8dfca;
  }

  /* @media (min-width: 640px) {
    main {
      max-width: none;
    }
  } */
</style>
