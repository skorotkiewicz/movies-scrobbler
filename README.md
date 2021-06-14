# **WatchedMovies**

## Getting Started

Run your app in the development mode.

```
blitz dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Ensure the `.env.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/WatchedMovies
APP_ORIGIN=http://localhost:3000
OMDB_API=<from omdbapi.com>
MAILJET_API_1=
MAILJET_API_2=
NODE_ENV=production
SESSION_SECRET_KEY=<RANDOM 32 CHARS>
```

## Commands

Blitz comes with a powerful CLI that is designed to make development easy and fast. You can install it with `yarn i -g blitz`

```
  blitz [COMMAND]

  dev       Start a development server
  build     Create a production build
  start     Start a production server
  export    Export your Blitz app as a static application
  prisma    Run prisma commands
  generate  Generate new files for your Blitz project
  console   Run the Blitz console REPL
  install   Install a recipe
  help      Display help for blitz
  test      Run project tests
```

You can read more about it on the [CLI Overview](https://blitzjs.com/docs/cli-overview) documentation.

## What's included?

Here is the starting structure of your app.

```
app
├── api
├── auth
│   ├── components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── mutations
│   │   ├── changePassword.ts
│   │   ├── forgotPassword.test.ts
│   │   ├── forgotPassword.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   ├── resetPassword.test.ts
│   │   ├── resetPassword.ts
│   │   └── signup.ts
│   ├── pages
│   │   ├── change-password.tsx
│   │   ├── forgot-password.tsx
│   │   ├── login.tsx
│   │   ├── reset-password.tsx
│   │   └── signup.tsx
│   └── validations.ts
├── core
│   ├── components
│   │   ├── Form.tsx
│   │   ├── LabeledTextField.tsx
│   │   └── Loading.tsx
│   ├── hooks
│   │   └── useCurrentUser.ts
│   └── layouts
│       ├── Header.tsx
│       ├── Layout.tsx
│       └── MoviesListComp.tsx
├── movies
│   ├── components
│   │   ├── AddMovie.tsx
│   │   └── MovieForm.tsx
│   ├── mutations
│   │   ├── createMovie.ts
│   │   ├── deleteMovie.ts
│   │   ├── setViewProfile.ts
│   │   ├── voteMovie.ts
│   │   └── watchedMovie.ts
│   └── queries
│       ├── getMovie.ts
│       ├── getMovies.ts
│       └── searchMovie.ts
├── pages
│   ├── 404.tsx
│   ├── @
│   │   └── [userName].tsx
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── dashboard.tsx
│   ├── index.test.tsx
│   ├── index.tsx
│   └── watchlist.tsx
└── users
    └── queries
        ├── getCurrentUser.ts
        └── getUser.ts

```

These files are:

- The `app/` folder is a container for most of your project. This is where you’ll put any pages or API routes.

- `db/` is where your database configuration goes. If you’re writing models or checking migrations, this is where to go.

- `public/` is a folder where you will put any static assets. If you have images, files, or videos which you want to use in your app, this is where to put them.

- `integrations/` is a folder to put all third-party integrations like with Stripe, Sentry, etc.

- `test/` is a folder where you can put test utilities and integration tests.

- `package.json` contains information about your dependencies and devDependencies. If you’re using a tool like `npm` or `yarn`, you won’t have to worry about this much.

- `tsconfig.json` is our recommended setup for TypeScript.

- `.babelrc.js`, `.env`, etc. ("dotfiles") are configuration files for various bits of JavaScript tooling.

- `blitz.config.js` is for advanced custom configuration of Blitz. It extends [`next.config.js`](https://nextjs.org/docs/api-reference/next.config.js/introduction).

- `jest.config.js` contains config for Jest tests. You can [customize it if needed](https://jestjs.io/docs/en/configuration).

You can read more about it in the [File Structure](https://blitzjs.com/docs/file-structure) section of the documentation.
