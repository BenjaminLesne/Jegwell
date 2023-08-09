- mettre en place des test unitaire (vitest? jest?)

- pourquoi on utilise pas i18n?
car les descriptions des produits doivent etre traduite aussi. Et le client n'a pas le temps pour ca. Donc pour l'instant que du français.

- créer un Jira avec les templates de story et bug (en français pour que Solène puisse les remplir?)
- create templates for merge requests (take those from work and remove they unsued part of it)
- créer une documentation (se renseigner sur les solutions, jira atlass?, elles font comment les librairies genre react?)
- make it easy for user to make feedbacks (cf webdevcody way)
- add error message on screen when stuff goes wrong (check try catch code and consoleError in code base) toast?
- add a button reset the basket on the basketpage (the only way to do it now is to remove each item one by one by clicking their top right cross)
- create a 404 template
- optimiser les requetes? (getServerSideProps, getStaticProps)
=> make ssr most of the pages
- add eslint pluging for tech I use (prettier, etc check tweet I retweeted from cory house)
- don't forget to do the administration panel (add products, authenticate etc)
- is stripe being loaded in every page?
- make a unit test for getSubtotalPrice
- get rid of reportUndefinedOrNullVars
- option modal not working on single page product
- make the "ajouté V" only appear when successfully added to localStorage
- check the timestamps of https://www.youtube.com/watch?v=YkOSUVzOAA4 (theo), there are stuff to do: toaster on error with zod,  Loading spinner & handling loading states or Using tRPC's createProxySSGHelpers
- make a README.md
- add a circle on the basket icon to show how many items were added
- use library resend to send emails cf theo video
=> stripe can send email to customer automatically (can we add solene to it?)
- "For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended. Run 'yarn add sharp', and Next.js will use it automatically for Image Optimization."
- bugstyle: homepage loading spinner in the middle of the page instead of middle of its section
- change favicon for jegwell icone
- bug: when adding original and option vert to basket, if I change option vert to original, the items to not merge and an error related to their key appear in the console
- Warning: A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering
    at title
    at head
    at Head (webpack-internal:///./node_modules/.pnpm/next@13.4.1_@babel+core@7.21.8_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/_document.js:297:1)
    at html
    at Html (webpack-internal:///./node_modules/.pnpm/next@13.4.1_@babel+core@7.21.8_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/_document.js:719:114)
    at Document (webpack-internal:///./node_modules/.pnpm/next@13.4.1_@babel+core@7.21.8_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/_document.js:735:1)
-----

IMPORTANT:
- bug: when removing products from basket, subtotal Price is not equal to product price x quantity
- e2e: stripe payment


Doing:
- e2e: stripe payment

Note:
When you awake the ps database you have to restard the frontend server aswell
we can add customer details (address, email) in the Stripe checkout session


