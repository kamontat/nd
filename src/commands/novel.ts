import { Command, Commandline } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import { DownloadManager } from "nd-downloader";
import { byteToSize } from "nd-downloader/apis/SizeConverter";
import LoggerService, { LOGGER_CLI, LOGGER_DOWNLOADER } from "nd-logger";

export default (cli: Commandline, _: IConfiguration) => {
  cli.command(
    Command.build("novel", true, async ({ value }) => {
      LoggerService.log(LOGGER_CLI, `start default novel command with ${value}`);

      const manager = new DownloadManager<number>();
      manager.event.on("downloading", (prev, curr) => {
        // console.log(totalMS);
        LoggerService.log(LOGGER_DOWNLOADER, `download size is ${byteToSize(prev + curr, " ")}`);
      });

      manager.event.on("downloaded", (r, progress, total) => {
        // r.result = "FUCK YOU"; // can be update !!
        LoggerService.log(LOGGER_DOWNLOADER, `completed ${r.link} ${progress}/${total}`);
      });

      manager.add("https://writer.dek-d.com/story/writer/view.php?id=123123", "/tmp/dek-d-123123.html");
      // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1881939", "/tmp/dek-d-1881939.html");
      // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1322476", "/tmp/dek-d-1322476.html");
      // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1950088", "/tmp/dek-d-1950088.html");
      // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1957491", "/tmp/dek-d-1957491.html");
      // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1854069", "/tmp/dek-d-1854069.html");
      // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1959477", "/tmp/dek-d-1959477.html");
      // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1977407", "/tmp/dek-d-1977407.html");

      // manager.add("https://google.com", "/tmp/google-1.html");
      // manager.add("https://google.com", "/tmp/google-1.html");
      // manager.add("https://google.com", "/tmp/google-1.html");

      // manager.build(r => {
      //   const newResp = r.copy<number>();
      //   newResp.result = 12;
      //   return newResp;
      // });

      return manager.run().then(r => {
        LoggerService.log(LOGGER_CLI, r[0].result);
      });
    }),
  );
};
