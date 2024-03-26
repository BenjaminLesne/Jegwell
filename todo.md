- pourquoi on utilise pas i18n?
  car les descriptions des produits doivent etre traduite aussi. Et le client n'a pas le temps pour ca. Donc pour l'instant que du français.

- create templates for merge requests (take those from work and remove they unsued part of it)
- créer une documentation (se renseigner sur les solutions, jira atlass?, elles font comment les librairies genre react?)
- make it easy for user to make feedbacks (cf webdevcody way)
- add a button reset the basket on the basketpage (the only way to do it now is to remove each item one by one by clicking their top right cross)
- optimiser les requetes? (getServerSideProps, getStaticProps)
  => make ssr most of the pages
- add eslint pluging for tech I use (prettier, etc check https://twitter.com/housecor/status/1681326374034759682?s=20)
- don't forget to do the administration panel (add products, authenticate etc)
- is stripe being loaded in every page?
- make a unit test for getSubtotalPrice
- get rid of reportUndefinedOrNullVars
- option modal not working on single page product
- make the "ajouté V" only appear when successfully added to localStorage
- check the timestamps of https://www.youtube.com/watch?v=YkOSUVzOAA4 (theo), there are stuff to do: toaster on error with zod, Loading spinner & handling loading states or Using tRPC's createProxySSGHelpers
- make a README.md
- add a circle on the basket icon to show how many items were added
- use library resend to send emails cf theo video
  => stripe can send email to customer automatically (can we add solene to it?)
- "For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended. Run 'yarn add sharp', and Next.js will use it automatically for Image Optimization."
- create a 404 template
- bugstyle: homepage loading spinner in the middle of the page instead of middle of its section
- bug: when adding original and option vert to basket, if I change option vert to original, the items to not merge and an error related to their key appear in the console
- add error message on screen when stuff goes wrong (check try catch code and consoleError in code base) toast?
- Warning: A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering
  at title
  at head
  at Head (webpack-internal:///./node*modules/.pnpm/next@13.4.1*@babel+core@7.21.8_react-dom@18.2.0_react@18.2.0/node*modules/next/dist/pages/\_document.js:297:1)
  at html
  at Html (webpack-internal:///./node_modules/.pnpm/next@13.4.1*@babel+core@7.21.8_react-dom@18.2.0_react@18.2.0/node*modules/next/dist/pages/\_document.js:719:114)
  at Document (webpack-internal:///./node_modules/.pnpm/next@13.4.1*@babel+core@7.21.8_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/\_document.js:735:1)

---

- e2e: email after successful payment
  => bot email to create?
- official jegwell stripe to setup
- setup a production database
- setup the domain name on vercel
- setup production env in vercel, idem preview and develop env
- use jenkins for deploying, generating new version etc?
- add filtering, sorting and more to tables cf https://ui.shadcn.com/docs/components/data-table
- make a system where she can check order that have been handled already
- reset the database between each test/project in e2e tests? https://playwright.dev/docs/test-projects
- add identification with AdminGetAll api endpoint
- can I use this? https://github.com/release-it/release-it
- clean up useEffect wrongly use see this video: https://www.youtube.com/watch?v=TGUSijXKuyA
- make 3D model of products? (threejs)
- make a docker commpose to run a backend/db locally cf webdeccody video
- https://github.com/BenjaminLesne/Jegwell/security/dependabot
- change product3d background https://drei.pmnd.rs/?path=/docs/staging-accumulativeshadows--docs
- mettre en place des migrations avec prisma, actuellement on en fait aucune, on peut rien rollback

IMPORTANT:

- make product.image an array of images ?
- bug: when removing products from basket, subtotal Price is not equal to product price x quantity
  => use library useHooks localStorage
- migrate useBacket to useLocalStorage hook useHooks.com
- add in test e2e of payment a check that the last payment intent succeeded without error
- email: support@jegwell.fr (IS NOT A REAL EMAIL IN THE SUCCESS PAYMENT PAGE)
  => use a env variable (otherwise everytimle we want to change we have to build the app)
- on envoie des emails on buy?
- admin product page:
  => authentication required (clerk)
  => design to make?
- store .env in keepassxc jegwell
- price in orders page do not match the one on see details > single order page
- admin navigation
- make a doc with docusaurus (How to use the MultipleSelect)
- make a doc with docusaurus for solene
- uncomment adminProcedure
  DOING:
- add create button in admin pages and a /creer route
- create a form to create a product in /gestion/produits
  => inspire from category to make aws s3 work

  Note:
  When you awake the ps database you have to restard the frontend server aswell
  we can add customer details (address, email) in the Stripe checkout session

there is two branch dev and production available with current plan, we need a stage branch so we can run our e2e tests
https://app.planetscale.com/benjamin-lesne/jegwelldb/branches
