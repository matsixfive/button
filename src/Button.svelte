<script lang="ts">
  let clicksLeft = 10;

  let timeout;

  const handleClick = () => {
    if (clicksLeft > 0) {
      clicksLeft--;

      timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 1000);

      // send click to server...
    }
  };
</script>

<button class:timeout={clicksLeft === 0} on:click={handleClick}>
  <span>
    {clicksLeft.toLocaleString()}
  </span>
</button>

{#if clicksLeft === 0}
  <p>no more clicks left for today</p>
{/if}

<style lang="scss">
  .timeout {
    color: hsl(35, 34%, 45%);
  }

  button {
    width: calc(min(400px, 97%) - 0.5rem);
    margin: 1rem;
    aspect-ratio: 1;
    border: none;
    cursor: pointer;
    padding: 0;

    font-family: "ubuntu";
    font-size: 5em;
    line-height: 1em;
    overflow-wrap: break-word;

    $rad: 7px;
    $blur: 14px;

    border-radius: 15%;
    background: #e8dfca;
    box-shadow: $rad $rad $blur #ccc4b2,
      calc(-1 * $rad) calc(-1 * $rad) $blur #fffae2,
      inset $rad $rad $blur transparent,
      inset calc(-1 * $rad) calc(-1 * $rad) $blur transparent;

    transition: box-shadow 250ms cubic-bezier(0, 0.7, 0, 1);

    &:active {
      border-radius: 61px;
      background: #e8dfca;
      box-shadow: $rad $rad $blur transparent,
        calc(-1 * $rad) calc(-1 * $rad) $blur transparent,
        inset $rad $rad $blur #ccc4b2,
        inset calc(-1 * $rad) calc(-1 * $rad) $blur #fffae2;
    }
  }
</style>
