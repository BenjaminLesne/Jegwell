- mettre en place des test unitaire (vitest? jest?)

- pourquoi on utilise pas i18n?
car les descriptions des produits doivent etre traduite aussi. Et le client n'a pas le temps pour ca. Donc pour l'instant que du français.

- créer un Jira avec les templates de story et bug (en français pour que Solène puisse les remplir?)
- create templates for merge requests (take those from work and remove they unsued part of it
- remove BenjaminLesneLica as collaborator on github
- créer une documentation (se renseigner sur les solutions, jira atlass?, elles font comment les librairies genre react?)
- basket page
- delivery page
- use library resend to send emails cf theo video
- make it easy for user to make feedbacks (cf webdevcody way)

Doing:
- button option/quantity basket page with dialog
=> créer un composant a partir de l'AlertDialog ligne 62. En props il prendra un component pour la description, un titre et l'id du produit concerné et la nouvelle valeur qu'on doit lui associé dans le panier? (useBasket)
=> utiliser qu'un seul modal pour tous les boutons qui seront généré dans le panier.
=> utiliser la prop "open" sur AlertDialog pour gérer l'ouverture fermeture
=> changing useBasket state to reducer, see helpers I asked chatGPT now i try to adapt its answer to current code
=> le useBasket que j'initialise dans quantityModal se met à jour mais je suis pas sur que le useBasket dans la page de basket se met a jour aussi. Parce que les modiication du localStorage ne trigger pas un rerender en soit si ca viens d'une source exterieur. Il faudrait donc passer le hook en props de la modal.