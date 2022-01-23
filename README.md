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
Before being able to access the messaging channel, 
the user will need to set their username.
This will make it so everyone in the channel
will be able to see who wrote what messages.

**Note:** Inappropriate usernames will be partially sanitized by the server.

### • Enter the messaging channel
After entering a username, the user can decide to join the messaging channel.

### • View messages from users in the channel
Once the user has joined the channel, they will be able to see all messages sent in it, 
who sent them, and the time at which they were sent.

If a user joins in the middle of a conversation, they will only see the messages that were sent from the 
moment they joined.

### • View all users in the channel
Once the user has joined the channel, they will be able to see the names of all users
that are currently in it, whether they have previously sent messages or not.

### • Write a message
Once the user has joined the channel, they will be able to broadcast a message to everyone else who is in it.

**Note:** Inappropriate messages will be partially sanitized by the server.

### • Leave a channel

A user can decide to leave the channel to either:
- Stop using the application
- Join it again

However, if the user leaves and decides to join the channel again,
they will not be able to see the messages that were sent before they joined again.

## User flow

**Note:**

1. Enter username* 
2. Join the messaging channel*
3. View messages and users
4. (Optional) Write and send a message*
5. (Optional) Leave the channel*

*&nbsp;: User interaction is required.
