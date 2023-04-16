technologies used:

- symfony/webpack-encore-bundle
- pnpm
- typescript
- playwright

How it works:

symfony server:start
launch the backend

BUT, if you want to use the css and javascript, you need to run in an other termainal:
pnpm run watch

Then, webpack will build the assets into the public/build folder and it should hot reload on changes of those files.

# tests end to end

## How to test?

When you are creating a test, usually you run:

```
pnpm playwright test --headed --project="Google Chrome"
```

Ne pas oublier de lancer la base de donnée SQL avec:

```
sudo xampp start
```
