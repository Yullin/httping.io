import { Suspense } from "react";
import HttpPingTool from "@/components/HttpPingTool";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HttpPingTool />
    </Suspense>
  );
}
