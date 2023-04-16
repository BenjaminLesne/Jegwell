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
  => what tool can I use to make documentation?
- how do I manage the image files with the test? they are all saved in the same images folder
- switch from git hooks to github actions? see what grafikart do
  => add a deploy job to build and deploy on production server website
- mettre en place la commande pour build front (et back?)
  => ET deployer (github workflow?)

what I was doing:

- switch from git hooks to github actions? see what grafikart do
  => how does the ci run the test database? Should I ship the database?
  => use the SQL databas offered on ikoula subscription
