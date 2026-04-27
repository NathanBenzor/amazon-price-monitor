import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SlackNotifier } from "./slackNotifier";

vi.mock("axios");

describe("SlackNotifier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/test";
  });

  it("returns success when Slack webhook post succeeds", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 200 } as never);

    const notifier = new SlackNotifier();

    const result = await notifier.sendPriceDropAlert({
      productId: "echo-dot",
      productName: "Echo Dot",
      productUrl: "https://amazon.com/dp/test",
      previousPriceCents: 5000,
      currentPriceCents: 4000,
      deltaCents: -1000,
      deltaPercent: 20,
    });

    expect(result.success).toBe(true);
    expect(axios.post).toHaveBeenCalled();
  });

  it("returns failure when Slack webhook post fails", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("Slack failed"));

    const notifier = new SlackNotifier();

    const result = await notifier.sendPriceDropAlert({
      productId: "echo-dot",
      productName: "Echo Dot",
      productUrl: "https://amazon.com/dp/test",
      previousPriceCents: 5000,
      currentPriceCents: 4000,
      deltaCents: -1000,
      deltaPercent: 20,
    });

    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain("Slack failed");
  });
});
