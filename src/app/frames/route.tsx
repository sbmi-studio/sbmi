/* eslint-disable react/jsx-key */
import { frames } from "./frames";
import { Button } from "frames.js/next";

const frameHandler = frames(async (ctx) => {
  // The added context from the middleware will be available on `ctx` here
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  return {
    image: <div tw="flex">The count is.</div>,
    imageOptions: { aspectRatio: "1:1" },
    buttons: [
      <Button action="post" target="/rps">
        PLAY RPS
      </Button>,
      <Button action="post" target={{ query: { action: "decrement" } }}>
        -
      </Button>,
      <Button action="post" target={{ query: { action: "increment" } }}>
        +
      </Button>,
      <Button action="post" target="/register">
        REGISTER
      </Button>,
    ],
    textInput: "Email Address",
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
