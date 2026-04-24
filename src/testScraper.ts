import { AmazonScraper } from "./infrastructure/scraping/amazonScraper";

async function main() {
  const scraper = new AmazonScraper();

  const result = await scraper.scrapeProduct(
    // "https://www.amazon.com/dp/EXAMPLE",
    "https://www.amazon.com/Apple-Bluetooth-Headphones-Personalized-Effortless/dp/B0DGHMNQ5Z/ref=sr_1_1_sspa?crid=15PN6CQZWKKDN&dib=eyJ2IjoiMSJ9.CI7bjSuQSQBx0GaAVvRN7iOrVxNAGgJ89qK5VbutVdPB2yH92eO8GGCIEoDDpzZiLLLJwl8Y7HtyfDv85AGUvfCjYNghn_qGBtIHTwHRyyBKErHZz-zzzldjxAk8F1f2TwmOWFb970i0wDbMj4w5D0nrJ9FezfY9NT3xPDv9dLn_jUXCNwPAWafgWYNrMGUto5StGn3MhJXTP_Gq37oR1a74KE4z7OnOw_TRw-tlC_k.u9fgApLgNwlswF1XZszL73RC4BDEk5m1wzjUUh0TLbQ&dib_tag=se&keywords=apple%2Bairpods&qid=1777066097&sprefix=apple%2Ba%2Caps%2C188&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
