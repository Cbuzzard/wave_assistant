# Wave Assistant

Personal google assistant application that integrates wave data from magicseaweed.com.

## Description

Used to get upcoming wave data through google assistant. Uses DialogFlow for controlling google assistant integration, firebase functions for hosting webhooks, and magicseaweed api to retrieve wave data. The general point isn't for super in depth information on the waves but to get a quick idea if the waves are going to be good or not.

## Getting Started

### Requiremnets

* DialogFlow project
* Firebase project
* magicseaweed api

### Setup

* npm i
* firebase login
* Feed magicseaweed api key to functions/src/api_fetch
* firebase deploy --only functions

## To-Do

* add responses for specific days
