/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../frames";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = frames(async (ctx) => {
  // The added context from the middleware will be available on `ctx` here
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  if (!ctx.message?.inputText) {
    return {
      image: <div tw="flex">Register now for early access!</div>,
      imageOptions: { aspectRatio: "1:1" },
      buttons: [
        <Button action="post" target="/">
          HOME
        </Button>,
        <Button action="post" target="/register">
          REGISTER
        </Button>,
      ],
      textInput: "Email Address",
    };
  }

  try {
    const email = ctx.message?.inputText;

    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return {
        image: <div tw="flex">Invalid email address. Please try again.</div>,
        imageOptions: { aspectRatio: "1:1" },
        buttons: [
          <Button action="post" target="/">
            HOME
          </Button>,
          <Button action="post" target="/register">
            REGISTER
          </Button>,
        ],
        textInput: "Email Address",
      };
    }

    const { data, error } = await resend.contacts.create({
      email: email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    if (error) {
      return {
        image: <div tw="flex">An error occurred. Please try again.</div>,
        imageOptions: { aspectRatio: "1:1" },
        buttons: [
          <Button action="post" target="/">
            HOME
          </Button>,
          <Button action="post" target="/register">
            REGISTER
          </Button>,
        ],
        textInput: "Email Address",
      };
    }

    return {
      image: <div tw="flex">Thank you for registering!</div>,
      imageOptions: { aspectRatio: "1:1" },
      buttons: [
        <Button action="post" target="/">
          HOME
        </Button>,
        <Button action="post" target="/rps">
          PLAY ROCK, PAPER, SCISSORS
        </Button>,
      ],
    };
  } catch (error) {
    return {
      image: <div tw="flex">An error occurred. Please try again.</div>,
      imageOptions: { aspectRatio: "1:1" },
      buttons: [
        <Button action="post" target="/">
          HOME
        </Button>,
        <Button action="post" target="/register">
          REGISTER
        </Button>,
      ],
      textInput: "Email Address",
    };
  }
});
