import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { inspect } from 'util';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json()); // Needed to parse JSON bodies

const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.post('/api/send-lead', async (req, res) => {
  const formData = req.body;
  try {
    const nodemailerModule = await import('nodemailer'); // ✅ dynamically load nodemailer
    const nodemailer = nodemailerModule.default;

    const transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });

    await transporter.sendMail({
      from: '"Joe Mortgage Pro" <leads@joemortgagepro.com>',
      to: 'jlongobardi@vandykmortgage.com',
      subject: `${formData.loanType} - Lead Received`,
      replyTo: 'no-reply@joemortgagepro.com',
      text: `A new mortgage lead has been submitted.

  Details:
  ${Object.entries(formData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')}

  -- 
  Joe, Mortgage Pro
  https://joemortgagepro.com
  `,
      html: `
      <h2>Submitted by: ${formData.name || 'Unknown'}</h2>
      <table cellpadding="6" style="border-collapse:collapse;">
        ${Object.entries(formData)
          .map(
            ([key, value]) =>
              `<tr>
            <td style="font-weight:bold;text-align:right;">${key}:</td>
            <td>${value}</td>
          </tr>`,
          )
          .join('')}
      </table>
      <hr>
      <p>Joe, Mortgage Pro<br>
      <a href="https://joemortgagepro.com">joemortgagepro.com</a></p>
      `,
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
