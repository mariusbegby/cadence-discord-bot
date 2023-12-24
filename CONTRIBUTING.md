# Contributing to Cadence Discord bot

Thank you for your interest in contributing to [Cadence Discord bot](https://github.com/mariusbegby/cadence-discord-bot/)! We appreciate any contributions that can help improve the bot and make it even better. Before you get started, please take a moment to review the guidelines outlined below.

## How to Contribute

1. Fork the repository and clone it to your local machine.
2. Install the necessary dependencies and follow setup instructions in [README.md](./README.md).
3. Make your changes or additions to the codebase locally.
4. Test your changes thoroughly to ensure they don't introduce any issues.
5. Commit your changes with a descriptive commit message.
6. Push your changes to your forked repository.
7. Open a pull request (PR) against the main branch of the [Cadence Discord bot](https://github.com/mariusbegby/cadence-discord-bot/) repository.

### Development instructions

[nodemon](https://www.npmjs.com/package/nodemon) and [concurrently](https://www.npmjs.com/package/concurrently) is installed along with dev dependencies.

> nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

> concurrently allows us to run multiple scripts concurrently, in parallell and get one output.

The script `npm run dev` will run these three processes in parallel through `concurrently` and `nodemon`:

1. `npx tsc -w`

    Runs the TypeScript compiler every time a code change is made.

2. `nodemon -w locales/en -x npm run toc`

    Generates TS definitions for translation keys in `locales/resources.d.ts` every time the English translation is modified.

3. `nodemon -x npm run start`

    Restarts the bot every time code is built in places like `dist` (`src` is automatically ignored).

## Guidelines for Contributions

To ensure a smooth and efficient contribution process, please adhere to the following guidelines:

-   Code Style: Follow the existing code style and formatting conventions used in the project. Consistent code style helps maintain readability and improves collaboration. Run the formatting and linting tools specified in [package.json](./package.json) before committing changes.
-   Documentation: Provide clear and concise documentation for any new features, changes, or additions you make. This includes updating the [README.md](./README.md) file if necessary.
-   Tests: If applicable, include test cases for your changes and ensure all existing tests pass successfully.
-   Bug Reports and Feature Requests: Use the GitHub issue tracker to report any bugs you encounter or suggest new features. Provide detailed information about the issue or feature request to help us understand and address it effectively.
-   License: By contributing to use [Cadence Discord bot](https://github.com/mariusbegby/cadence-discord-bot/), you agree that your contributions will be licensed under the [MIT License](./LICENSE.md).

## Communication

If you have any questions, suggestions, or need any kind of assistance, feel free to join our [Discord server](https://discord.gg/t6Bm8wPpXB) and ask in the appropriate channel. We have a friendly community ready to help you out!

Thank you for taking the time to contribute to [Cadence Discord bot](https://github.com/mariusbegby/cadence-discord-bot/). Your efforts are greatly appreciated!
