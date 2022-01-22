# No Chat

A simple chat application that runs in the browser.

## Topics
- [Stack](#stack)
- [Supported platforms](#supported-platforms)
- [Features](#features)
- [Usage flow](#user-flow)

## Stack
- Language: JavaScript ES6
- Environment
  - Server: Node.js
  - Client: Browser
- Server frameworks: Express, Socket.io

## Supported platforms
Desktop (modern browsers)

Tested in Google Chrome.

## Features

### • Enter a username
Before being able to access a messaging channel, 
the user will need to set their username.
This will make it so everyone in their respective channel
will be able to see who wrote what messages.

### • Enter a messaging channel
After entering a username, the user will need to select a messaging channel.

A user can only be in one channel at a time.

Each channel has their own set of users and messages.

If a user writes a message in one channel, it will only be visible in that respective channel.

### • View messages from users in the channel
Once the user has joined a channel, they will be able to see all messages sent in that channel, 
who sent them, and the time at which they were sent.

If a user joins in the middle of a conversation, they will only see the messages that were sent from the 
moment they joined.

### • View all users in a channel
Once the user has joined a channel, they will be able to see the names of all users
that are currently in that channel, whether they have previously sent messages or not.

### • Write a message
Once the user has joined a channel, they will be able to broadcast a message to everyone else who is in that channel.

### • Leave a channel

A user can decide to leave the channel to either:
- Stop using the application
- Join another channel

However, if the user leaved and decides to join the same channel,
they will not be able to see the messages that were sent before they joined again.

## User flow

**Note:**

1. Enter username* 
2. Join a messaging channel*
3. Confirm selection*
4. View messages and users
5. (Optional) Write and send a message*
6. (Optional) Leave the channel*

*&nbsp;: User interaction is required.