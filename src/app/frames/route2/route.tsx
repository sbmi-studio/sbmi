/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (cntxt) => {
  // The added context from the middleware will be available on `ctx` here
  if (!cntxt.message?.isValid) {
    throw new Error("Invalid message");
  }

  let state = cntxt.state;
  let message = cntxt.message?.inputText ? `${cntxt.message?.inputText}` : "";

  return {
    image: (
      <div tw="flex">
        The count is {state.count}. The word is: {message || "NOTHING"}
      </div>
    ),
    imageOptions: { aspectRatio: "1:1" },
    buttons: [
      <Button action="post" target="/route1">
        ROUTE 1
      </Button>,
      <Button action="post" target="/">
        HOME
      </Button>,
    ],
  };
});
