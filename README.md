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
  - login to github, then at the top right of your screen click your icon and go to settings.

  - now find the developer settings, then click on OAuth Apps, and create a new OAuth app.

  - you can name the application whatever you want, homepage url should be "http://localhost:3000", the description can be whatever you want, and the callback url should be "http://localhost:3000/api/auth/callback/github"

  - once that is done you can save your client id from the website and place it in the "GITHUB_ID=######" section of the ".env.local" file. Then generate a "client secret id" from the github website and save that in the "GITHUB_SECRET=######" section of the ".env.local" file.
    

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Contributing

Interested in contributing to the project? Check out our [Contributing Guidelines](./.github/CONTRIBUTING.md).
