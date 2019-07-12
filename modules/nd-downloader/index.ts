import Manager from "./models/Manager";
import Package from "./package.json";

// USAGE

// const downloadManager = new DownloadManager(4); // thread number

// downloadManager.add("https://example.com/download=1", "/tmp/nd-test/example-download-1"); // string or URL, file path must existed
// downloadManager.add("https://example.com/download=2", "/tmp/nd-test/example-download-2");
// downloadManager.add("https://example.com/download=3", "/tmp/nd-test/example-download-3");
// downloadManager.add("https://example.com/download=4", "/tmp/nd-test/example-download-4");

// console.log(downloadManager.links); // Array<Url>

// // current is a current downloaded link
// // progress is a number of total downloaded file
// downloadManager.event.on("downloaded", (current: string, progress: number) => {}); // for processing

// downloadManager.run().then((res: IResponse[]) => {});

export { Manager as DownloadManager, Package };

export * from "./apis/SizeConverter";
