<script lang="ts">
  import { ready, cooldown } from "./stores/ready";
  import { clicksLeft } from "./stores/clicksLeft";
  import { wins } from "./stores/wins";
  import JSConfetti from "js-confetti";

  const jsConfetti = new JSConfetti();

  let shake = true;
  export let flash = false;
  let progress = 0;

  let confirmed = true;

  const recievedConfirmation = () => {
    confirmed = true;

    $clicksLeft--;

    ready.set(Date.now() + cooldown);

    updateProgress();
    newClick();
  };

  const easeInOutCubic = (x: number): number => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };

  const sendMessage = (message: string) => {
    console.log("sending", message, socket);

    // reopen websocket if closed
    // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState#value
    if (!socket || socket.readyState !== 1) {
      console.log("reopening");
      openSocket();
      socket.onopen = () => socket.send(message);
    } else {
      console.log("sending");
      socket.send(message);
    }
  };

  const updateProgress = () => {
    if ($clicksLeft > 0) {
      const progressInterval = setInterval(() => {
        progress =
          100 - easeInOutCubic(1 - ($ready - Date.now()) / cooldown) * 100;
        progress = Number(progress.toFixed(4)); //truncate to 4 d.p

        if ($ready - Date.now() < 0) {
          clearInterval(progressInterval);
          progress = Math.min(Math.max(progress, 0), 100); // clamp between 0 and 100
        }
      }, 16); //60fps
    } else {
      progress = 0;
    }
  };

  updateProgress();

  const newClick = () => {
    flash = true;

    setTimeout(() => {
      flash = false;
    }, 100);
  };

  const handleClick = () => {
    // shake button
    if ($clicksLeft === 0) {
      shake = false;
      setTimeout(() => {
        shake = true;
      }, 1);
    }

    if ($clicksLeft > 0 && $ready <= Date.now() && confirmed) {
      // socket.send("add");

      // add message to be sent to list
      sendMessage("add");

      confirmed = false;
    } else {
      console.log("not ready");
    }
  };

  let socket: WebSocket;
  const openSocket = () => {
    socket = new WebSocket("ws://192.168.178.101:8999");

    socket.onclose = () => openSocket();

    socket.onmessage = message => {
      console.log(message.data);

      switch (message.data) {
        case "new":
          newClick();
          break;
        case "win":
          $wins += 1;

          break;
        case "recieved":
          recievedConfirmation();
          break;
        default:
          console.error("ws error?!", message.data);
          break;
      }
    };
  };
  openSocket();

  // socket.onopen = () => console.log("opened");

  let firedFirst = false;
  wins.subscribe(() => {
    if (!firedFirst) firedFirst = true;
    else {
      jsConfetti.addConfetti();
    }
  });
</script>

<button
  class:timeout={$clicksLeft <= 0}
  class:ready={progress === 0 && confirmed === true}
  class:shake
  on:click={handleClick}>
  <span>
    {$clicksLeft.toLocaleString()}
  </span>
  <div
    class="progress"
    data-progress={progress}
    style={`width: ${progress}%`} />
</button>

{#if $clicksLeft === 0}
  <p>no more clicks left for today</p>
{/if}

<style lang="scss">
  $offset: 7px;
  $blur: 14px;

  @mixin tan-button {
    border-radius: 15%;
    background: #e8dfca;
    box-shadow: $offset $offset $blur #ccc4b2,
      calc(-1 * $offset) calc(-1 * $offset) $blur #fffae2,
      inset $offset $offset $blur transparent,
      inset calc(-1 * $offset) calc(-1 * $offset) $blur transparent;

    &.ready:active {
      box-shadow: $offset $offset $blur transparent,
        calc(-1 * $offset) calc(-1 * $offset) $blur transparent,
        inset $offset $offset $blur #ccc4b2,
        inset calc(-1 * $offset) calc(-1 * $offset) $blur #fffae2;
    }
  }

  @mixin red-button {
    background: #da2f2f;
    box-shadow: $offset $offset $blur #ccc4b2,
      calc(-1 * $offset) calc(-1 * $offset) $blur #fffae2,
      inset $offset $offset $blur transparent,
      inset calc(-1 * $offset) calc(-1 * $offset) $blur transparent;
  }

  .timeout.shake {
    @keyframes shake {
      0% {
        transform: translateX(0) rotate(0);
      }

      25% {
        transform: translateX(10px) rotate(1deg);
        @include red-button();
      }

      50% {
        transform: translateX(-10px) rotate(-1deg);
      }

      75% {
        transform: translateX(10px) rotate(1deg);
      }

      100% {
        transform: translateX(0) rotate(0);
      }
    }

    animation: shake 200ms;
  }

  button {
    width: calc(min(400px, 97%) - 0.5rem);
    aspect-ratio: 1;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;

    font-family: "ubuntu";
    color: rgba(0, 0, 0, 0.171);
    font-size: 5em;
    line-height: 1em;
    // text-shadow: 2px 2px 2px #ccc4b2, -2px -2px 2px #fffae2;
    overflow-wrap: break-word;
    overflow: clip;

    @include tan-button();

    transition: color 400ms;
  }

  .progress {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);

    transition: background-color 100ms;

    &[data-progress="0"] {
      background-color: transparent;
    }
  }

  button.ready:not(.timeout) {
    color: black;
  }
</style>
