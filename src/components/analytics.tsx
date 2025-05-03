"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "nextjs-google-adsense";

export default function AnalyticsComponent() {
  // https://search.google.com/search-console
  // https://analytics.google.com/
  // https://www.google.com/adsense/

  return (
    <>
      <GoogleAnalytics
        trackPageViews
        gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string}
      />

      <GoogleAdSense
        publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID as string}
      />
    </>
  );
}
