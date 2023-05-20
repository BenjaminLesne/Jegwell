- mettre en place des test unitaire (vitest? jest?)

- pourquoi on utilise pas i18n?
car les descriptions des produits doivent etre traduite aussi. Et le client n'a pas le temps pour ca. Donc pour l'instant que du français.

- créer un Jira avec les templates de story et bug (en français pour que Solène puisse les remplir?)
- create templates for merge requests (take those from work and remove they unsued part of it


Doing:
- update the getSelect helpers to take an argument so we can have typesafety with Prisma.select<chosenModel>. This would avoid the never type we receive client side with products
- on nuk tout et on fait un enpoint sur mesure plutot que d'essayer de faire un endpoint polyvalent pour au final n'avoir besoin de cette polyvalence que dans mille ans?