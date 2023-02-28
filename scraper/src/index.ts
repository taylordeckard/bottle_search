import { scrapers } from "./scrapers";
import { DB } from "./db";
import { Worker, isMainThread, workerData } from "node:worker_threads";
import * as cliProgress from "cli-progress";

async function main() {
  if (isMainThread) {
    const workers = scrapers.map((_, scraperIdx) => {
      return new Worker(__filename, {
        workerData: { scraperIdx },
      });
    });
    const multibar = new cliProgress.MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        format: " {bar} | {filename} | {value}/{total}",
      },
      cliProgress.Presets.shades_grey
    );
    const bars: { [key: string]: cliProgress.Bar } = {};
    const done = workers.map(() => false);
    workers.forEach((worker, idx) => {
      worker.on(
        "message",
        (progress: { scraper: string; current: number; total: number }) => {
          if (!Object.keys(bars).includes(progress.scraper)) {
            bars[progress.scraper] = multibar.create(progress.total, 0, {
              filename: progress.scraper,
            });
          }
          bars[progress.scraper].update(progress.current);
          if (progress.total === progress.current) {
            bars[progress.scraper].stop();
            done[idx] = true;
            if (done.every((d) => d)) {
              multibar.stop();
            }
          }
        }
      );
    });
  } else {
    new scrapers[workerData.scraperIdx]().scrape();
  }
}

main();
