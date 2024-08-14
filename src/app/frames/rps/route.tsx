/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  // The added context from the middleware will be available on `ctx` here
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  let state = ctx.state;
  const choice = ctx.searchParams.choice;
  const cpuChoice = Math.floor(Math.random() * 3);

  switch (choice) {
    case "r":
      if (cpuChoice === 1) state = { ...state, cScore: state.cScore + 1 };
      else if (cpuChoice === 2) state = { ...state, pScore: state.pScore + 1 };
      break;
    case "p":
      if (cpuChoice === 2) state = { ...state, cScore: state.cScore + 1 };
      else if (cpuChoice === 0) state = { ...state, pScore: state.pScore + 1 };
      break;
    case "s":
      if (cpuChoice === 0) state = { ...state, cScore: state.cScore + 1 };
      else if (cpuChoice === 1) state = { ...state, pScore: state.pScore + 1 };
      break;
  }

  return {
    image: (
      <div tw="flex flex-col w-full h-full justify-center items-center">
        {choice && (
          <div tw="flex">
            {choice === "r" ? "🪨" : choice === "p" ? "📄" : "✂️"} vs{" "}
            {cpuChoice === 0 ? "🪨" : cpuChoice === 1 ? "📄" : "✂️"}
          </div>
        )}
        SCORE: {state.pScore} - {state.cScore}
      </div>
    ),
    imageOptions: { aspectRatio: "1:1" },
    buttons: [
      <Button action="post" target="/">
        HOME
      </Button>,
      <Button
        action="post"
        target={{ query: { choice: "r" }, pathname: "/rps" }}>
        🪨
      </Button>,
      <Button
        action="post"
        target={{ query: { choice: "p" }, pathname: "/rps" }}>
        📄
      </Button>,
      <Button
        action="post"
        target={{ query: { choice: "s" }, pathname: "/rps" }}>
        ✂️
      </Button>,
    ],
    state,
  };
});
