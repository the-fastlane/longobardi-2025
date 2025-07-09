import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const app = express();
const angularApp = new AngularNodeAppEngine();
const browserDistFolder = join(import.meta.dirname, '../browser');

// Middleware to parse JSON body
app.use(express.json());

/** ✅ API endpoint */
app.post('/api/email-lead', (req, res) => {
  const data = req.body;
  console.log('✅ Received lead:', data);

  // You can validate required fields here if needed:
  // if (!data?.name || !data?.email) {
  //   return res.status(400).json({ error: 'Missing name or email' });
  // }

  // Placeholder for sending an email
  res.json({ success: true, received: data });
});

/** ✅ Serve static frontend assets */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/** ✅ Handle all other routes with Angular SSR */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/** ✅ Start the server */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`✅ Node Express server listening on http://localhost:${port}`);
  });
}

/** ✅ Export request handler */
export const reqHandler = createNodeRequestHandler(app);
