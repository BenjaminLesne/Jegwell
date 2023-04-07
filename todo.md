- find a validation form library (zod? yup?)
- make e2e test for homepage
  => mobile oriented test +++
- fetch the categories from backend
  => determine which entity schema I want (Product has a price? or options have it since it can be different? what happens what a Product instance has no options?)
  => use a visual UML stuff?
- create admin pages to add categories?
- optimize imags
  => see liip/imagine-bundle, https://youtu.be/OZBVd4ZTIqk?t=899
- what type of extension I accept for images ? (jpeg? webp? png?)
- create the admin page with the form to add a category. this video might help: https://www.youtube.com/watch?v=6Ryu7-VSV5k&list=PLjwdMgw5TTLX7wmorGgfrqI9TcA8nMb29&index=4
- don't forget phpunit, vitest, and playwright tests
- to style symfony form: https://youtu.be/6Ryu7-VSV5k?t=659
- figure out how to use the translation in symfony to auto translate form labels and prepare possible english version of jegwell
- demander a chatGPT comment fonctione le systeme de traduction afin de l'utiliser pour les formulaire. intl extension not installed?

what I was doing:
i don't know if the options field work in the product form,
it does not display the options on the product edit page
=> figure out how to display options
figure out the widget_rest, because it display the option label evenknow I already called it earlier in the file.
