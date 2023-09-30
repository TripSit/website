import * as React from "react";
import dynamic from "next/dynamic";

const WidgetBot = dynamic(() => import("@widgetbot/react-embed"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const parameters =
  process.env.NODE_ENV === "production"
    ? {
        server: "179641883222474752",
        channel: "1021385869262864464",
        shard: "https://emerald.widgetbot.io",
        className: "widgetbot",
      }
    : {
        server: "960606557622657026",
        channel: "1052634176161054782",
        className: "widgetbot",
      };

const Webchat = () => <WidgetBot {...parameters} />;

export default Webchat;
