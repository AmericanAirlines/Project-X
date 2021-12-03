<h1 align="center">Project X</h1>
<p align="center">
  <img src="docs/icon.svg" width="100px" />
</p>

## Getting Started

### Prerequisites

- Node 14
- [Yarn v1](https://classic.yarnpkg.com/lang/en/)

  > _This project is a monorepo, so Yarn was chosen for better dependency management_

### Setup

1.  Install dependencies

    ```zsh
    yarn
    ```

1.  Copy `packages/api/.env.sample` to `packages/api/.env.local`

    ```zsh
    cp packages/api/.env.sample packages/api/.env.local
    ```

1.  Run the setup script

    ```zsh
    yarn setup
    ```

    > This script will build any required files so that the two packages (api and web) can work together

1.  Start the development server

    ```zsh
    yarn dev
    ```

    When you see this success message, open the url to load the site

    ```zsh
    🚀 Listening at http://localhost:3000
    ```

    > The server starts before Next.js finishes compiling, so the first time may take a little bit to load

1.  Start developing

## Setting up the Github OAuth

- Login to github, then at the top right click on the icon and go to settings.

- Find the developer settings, then click on OAuth Apps, and create a new OAuth app.

- Name the application, homepage 'URL' should be `http://localhost:3000`

- The callback `URL` should be `http://localhost:3000/api/auth/callback/github`

- Next, use the Client Id from the output of the app creation to replace the value of `GITHUB_CLIENT_ID` within your `.env.local`

- Generate a Client Secret ID from GitHub and use it to replace the value of `GITHUB_SECRET` within your `.env.local`

## Setting up Discord OAuth

- Go to the [Discord Develop Portal](https://discord.com/developers/applications) and log in.
- Create a new application and name it, then go to the OAuth2 settings of the application.
- Specify `http://localhost:3000/api/auth/discord/callback` as the redirect URL for local development.
- For production enviornments `localhost:3000` should be replaced with the correct host address and port number.
- Within the OAuth2 URL Generator, select the correct redirect URL. Specify the `identify` scope, and save your changes.
- In `.env.local`:

  1. Copy the Client ID and update the `DISCORD_CLIENT_ID` value.

  2. Reveal and copy the Client Secret and update the `DISCORD_SECRET_ID` value.

## Setting up Discord Server

- Go to the Discord App and create a new server.
- Navigate to "Invite People". This can be found in the dropdown panel next to your server name in the upper-left corner.
- In the pop-up a link is displayed. The link by default will last for 7 days.
- To create a permanent link navigate to the "Invite People" window and click on "Edit invite link" at the bottom of the window.
- Select "Never" for expiration and "No limit" for the number of uses.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Contributing

Interested in contributing to the project? Check out our [Contributing Guidelines](./.github/CONTRIBUTING.md).
