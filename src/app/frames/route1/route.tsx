/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  // The added context from the middleware will be available on `ctx` here
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const foo = ctx.searchParams.foo;

  return {
    image: (
      <div tw="flex">
        {foo} {ctx.message?.requesterUserData?.displayName}.{" "}
        {ctx.message?.requesterUserData?.username} - {ctx.message?.requesterFid}{" "}
        - {ctx.message?.connectedAddress}
      </div>
    ),
    imageOptions: { aspectRatio: "1:1" },
    buttons: [
      <Button action="post" target="/route2">
        ROUTE 2
      </Button>,
      <Button action="post" target="/">
        HOME
      </Button>,
    ],
  };
});
