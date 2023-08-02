- mettre en place des test unitaire (vitest? jest?)

- pourquoi on utilise pas i18n?
car les descriptions des produits doivent etre traduite aussi. Et le client n'a pas le temps pour ca. Donc pour l'instant que du français.

- créer un Jira avec les templates de story et bug (en français pour que Solène puisse les remplir?)
- create templates for merge requests (take those from work and remove they unsued part of it)
- remove BenjaminLesneLica as collaborator on github
- créer une documentation (se renseigner sur les solutions, jira atlass?, elles font comment les librairies genre react?)
- basket page
- delivery page
- use library resend to send emails cf theo video
- make it easy for user to make feedbacks (cf webdevcody way)
- add error message on screen when stuff goes wrong (check try catch code and consoleError in code base) toast?
- add a button reset the basket on the basketpage (the only way to do it now is to remove each item one by one by clicking their top right cross)
- create a 404 template
- optimiser les requetes? (getServerSideProps, getStaticProps)
- add eslint pluging for tech I use (prettier, etc check tweet I retweeted from cory house)
- don't forget to do the administration panel (add products, authenticate etc)
- mettre en place un web hook to automatically update order status on jegwell.fr (see: https://nkrkn.me/writing/t3-stripe)
- mettre le prix dans les options de livraison (gratuit, prix du colissimo..)
- should we store checkout session id or payment intent id?
- bug: add to basket products page remove the first product with productId without checking the optionId. => add to basket product with option, then add to basket without. go to basket. the item with option disappeared
- onConfirmation is not a function in basket page when modifying quantity
- is stripe being loaded in every page?
- create a customer entity to add in Order entity for later

Doing:
- delivery page

Note:
When you awake the ps database you have to restard the frontend server aswell
we can add customer details (address, email) in the Stripe checkout session


