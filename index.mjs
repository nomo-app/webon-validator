import { validateWebOn } from "./validate_webon.mjs";

const backendURL = "https://webon.info/api/webons/en";

async function fetchWebOns() {
  const res = await fetch(backendURL);
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid response from " + backendURL);
  }
  return data;
}

async function main() {
  const webOns = await fetchWebOns();
  const webOnDomains = webOns.map((webOn) => webOn.domain);
  let numFailures = 0;
  for (const domain of webOnDomains) {
    try {
      await validateWebOn({ domain });
      console.log(`PASS: ${domain}`);
    } catch (error) {
      console.log(`FAIL: ${domain}: ${error.message}`);
      numFailures += 1;
    }
  }
  console.log(`Failures: ${numFailures} out of ${webOnDomains.length}`);
  if (numFailures > 0) {
    process.exit(1);
  }
  if (webOnDomains.length === 0) {
    process.exit(2);
  }
}
main();
