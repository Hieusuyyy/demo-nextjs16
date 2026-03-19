<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Dev Event** Next.js App Router application. The following changes were made:

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) packages via npm.
- **Created** `instrumentation-client.ts` at the project root — the recommended Next.js 15.3+ pattern for initializing PostHog on the client side. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **Updated** `next.config.ts` to add PostHog reverse proxy rewrites for `/ingest` and `/ingest/static` paths, and enabled `skipTrailingSlashRedirect` for PostHog API compatibility.
- **Updated** `components/ExploreBtn.tsx` — added `explore_events_clicked` capture when the Explore Events button is clicked.
- **Updated** `components/EventCard.tsx` — converted to a client component and added `event_card_clicked` capture with `event_title`, `event_slug`, `event_location`, and `event_date` properties when a user clicks an event card.
- **Configured** `.env.local` with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the Explore Events button on the home page | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details (with title, slug, location, date properties) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/140766/dashboard/567941
- **Insight — User Engagement: Explore & Event Clicks (Daily)**: https://eu.posthog.com/project/140766/insights/M2bSUTzP
- **Insight — Event Discovery Funnel: Explore to Click**: https://eu.posthog.com/project/140766/insights/o1jGiWZy
- **Insight — Most Popular Events by Click**: https://eu.posthog.com/project/140766/insights/q5ic8nNR
- **Insight — Weekly Active Users Browsing Events**: https://eu.posthog.com/project/140766/insights/fsciw2QJ

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
