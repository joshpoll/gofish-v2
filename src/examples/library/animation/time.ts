import { createEffect, createSignal, onCleanup } from "solid-js";

export const createTime = (startActive = true) => {
  const [time, setTime] = createSignal(0);
  const [active, setActive] = createSignal(startActive);

  createEffect(() => {
    let interval: number | undefined;
    if (active()) {
      interval = setInterval(() => {
        setTime(time() + 0.01);
      }, 1000 / 60);
    }

    onCleanup(() => {
      if (interval) clearInterval(interval);
    });
  });

  const reset = () => setTime(0);

  return {
    time,
    setTime,
    active,
    setActive,
    reset,
  };
};
