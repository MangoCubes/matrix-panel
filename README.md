# Matrix Panel

## Project Overview
This project is a web app for your [Matrix chat](https://matrix.org/) Synapse homeserver that allows you to do administrative actions on it.

Actions are focused on things you cannot do on most normal clients such as Element.

Project is built with React combined with MUI. Props to them for creating easy-to-use library.

## Features
 - Rooms
   - View all rooms
   - View members in a room
   - Invite yourself, and grant room admin permission for yourself
   - Delete History
   - Delete/block room
   - See all rooms and spaces in a tree-like format 
 - Users
   - View all users
   - Deactivate or promote user
   - Reset password
   - View all sessions and devices, and delete them if necessary
   - View all rooms a user is in
   - Generate access token for a user to impersonate them

## How To Use
You first need a Matrix server. Then you must register an account on the server, then give it admin permission. To give your account admin permission, check out [this page](https://matrix-org.github.io/synapse/latest/usage/administration/admin_api/).

Once granted, you can log into the page, either by self-hosting it or using the public instance available below.

## Public Instance
Public instance is available [here](http://mangocubes.github.io/matrix-panel).
