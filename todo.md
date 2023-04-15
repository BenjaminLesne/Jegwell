- make e2e test for homepage
  => mobile oriented test +++
- optimize imags
  => see liip/imagine-bundle, https://youtu.be/OZBVd4ZTIqk?t=899
  => what type of extension I accept for images ? (jpeg? webp? png?)
- don't forget phpunit, vitest, and playwright tests
- to style symfony form: https://youtu.be/6Ryu7-VSV5k?t=659
- figure out how to use the translation in symfony to auto translate form labels and prepare possible english version of jegwell
  => demander a chatGPT comment fonctione le systeme de traduction afin de l'utiliser pour les formulaire. intl extension not installed?
- make documentation for start server (symfony server:start, pnpm dev) in the readme, how to install, mysql and xampp
- switch from git hooks to github actions? see what grafikart do
- how do I manage the image files with the test? they are all saved in the same images folder

what I was doing:

- test end to end products page
  => how to test filters? fake database?
  => use a specific server for test with a special database. I think we can start server in test mode with symfony and get a specific database with it.

1- create the test database
https://symfony.com/doc/current/testing.html#configuring-a-database-for-tests
2- change playwright setting to run its own server in test mode with the test database
