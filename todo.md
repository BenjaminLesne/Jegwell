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
- add error message on screen when stuff goes wrong (check try catch code and consoleError in code base)
- add a button reset the basket on the basketpage (the only way to do it now is to remove each item one by one by clicking their top right cross)

Doing:
- button option/quantity basket page with dialog
=> make a test for the basket (it should render properly when giving a basket in localstorage when we load the pageo)
a penser qu'on va fetch les ids qu'on a dans le localStorage plus tard