# Parfait Client

Parfait is a all-in-one online volunteer platform, developed by Connect To Care.

<p align="center">
  <img src="https://i.imgur.com/oYQv2wY.png" alt="Website" width="738">
</p>

* Parfait includes automated ***text reminders*** and ***emails***.
* Recurring events, just specify the days to recur.
* A fraud-proof check-in system for large-scale events.
* Simple sign-in system

However, Parfait is in its infancy, and has a majority of Connect To Care specific features. 

## Why make this?

To put it simply, there is nothing out there like Parfait. We needed something that we could build-off and make highly customizable. 
Parfait remains one of Connect To Care's flagship projects and development will be continuous.

## Behind the scenes

The Parfait client uses Angular and Material for the front-end. This lets us keep a rapid development pace and make a ***buttery smooth*** app. 

## Using this yourself

Clone the Github repo and install the Angular CLI using `npm i @angular/cli -g`. You can build the app using `npm run build:prod` (production) and host a live development server using `ng serve`.

Keep in mind that you must point the Parfait client to use your custom API instance. Do this by editing the `config.service.prod.ts` file with your own API endpoint URL. It's pretty simple.

## UPDATE: Where is the API code?

We've decided to exclude the API source code from Github. If you'd like to use the Parfait API, <a href="mailto:contact@connect-tocare.org">contact us</a> to access the repo.

