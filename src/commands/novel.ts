import { Command, Commandline, ICommandCallback, Option, SubCommand } from "nd-commandline-interpreter";
import { IOptionable } from "nd-commandline-interpreter/models/Optionable";
import { IConfiguration } from "nd-config";
import { DownloadManager } from "nd-downloader";
import { byteToSize } from "nd-downloader/apis/SizeConverter";
import LoggerService, { LOGGER_CLI, LOGGER_DOWNLOADER } from "nd-logger";

export default (cli: Commandline, config: IConfiguration) => {
  const downloadOption = <T extends IOptionable>(opt: T) => {
    opt
      .option(
        Option.build("location", true, ({ value }) => {
          LoggerService.log(LOGGER_CLI, `downloading location is ${value}`);
          config.set("novel.location", value);
        }),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("change", false, ({ apis }) => apis.config.set("novel.change", true)));

    return opt;
  };

  const downloadCallback: ICommandCallback = ({ value, apis }) => {
    const replace = apis.config.get<boolean>("novel.replace", false);
    const change = apis.config.get<boolean>("novel.change", false);
    const location = config.get("novel.location");

    LoggerService.log(LOGGER_CLI, `download ${value} (nid) to ${location} with replace=${replace},change=${change}`);

    // const _novel = new NovelBuilder(value); // value == nid
    // _novel
    //   .build()
    //   .then((novel: Novel) => {
    //     return novel.save(); // generate html and resouse file
    //   })
    //   .then((resource: NovelResource) => {
    //     const formatter = new NovelResourceFormatter();
    //     const result = formatter
    //       .config({ enable: change })
    //       .save(resource)
    //       .build();
    //     LoggerService.console.log(result);
    //   });
  };

  const rawDownloadOption = <T extends IOptionable>(opt: T) => {
    opt
      .option(
        Option.build("location", true, ({ value }) => {
          LoggerService.log(LOGGER_CLI, `downloading location is ${value}`);
          config.set("novel.location", value);
        }),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("change", false, ({ apis }) => apis.config.set("novel.change", true)));

    return opt;
  };

  const rawDownloadCallback: ICommandCallback = ({ value }) => {
    LoggerService.log(LOGGER_CLI, `start download raw novel... ${value}`);
  };

  /**
   * Command setup
   */

  downloadOption(cli).callback(downloadCallback);

  cli.command(
    downloadOption(
      Command.build("novel", true, downloadCallback)
        .sub(downloadOption(SubCommand.build("download", true, downloadCallback)))
        .sub(rawDownloadOption(SubCommand.build("raw", true, rawDownloadCallback))),
    ),
  );

  cli.command(rawDownloadOption(Command.build("raw", true, rawDownloadCallback)));

  // cli.command(
  //   Command.build("novel", true, async ({ value }) => {
  //     LoggerService.log(LOGGER_CLI, `start default novel command with ${value}`);

  //     const manager = new DownloadManager<number>();
  //     manager.event.on("downloading", (prev, curr) => {
  //       // console.log(totalMS);
  //       LoggerService.log(LOGGER_DOWNLOADER, `download size is ${byteToSize(prev + curr, " ")}`);
  //     });

  //     manager.event.on("downloaded", (r, progress, total) => {
  //       // r.result = "FUCK YOU"; // can be update !!
  //       LoggerService.log(LOGGER_DOWNLOADER, `completed ${r.link} ${progress}/${total}`);
  //     });

  //     manager.add("https://writer.dek-d.com/story/writer/view.php?id=123123", "/tmp/dek-d-123123.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1881939", "/tmp/dek-d-1881939.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1322476", "/tmp/dek-d-1322476.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1950088", "/tmp/dek-d-1950088.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1957491", "/tmp/dek-d-1957491.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1854069", "/tmp/dek-d-1854069.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1959477", "/tmp/dek-d-1959477.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1977407", "/tmp/dek-d-1977407.html");

  //     // manager.add("https://google.com", "/tmp/google-1.html");
  //     // manager.add("https://google.com", "/tmp/google-1.html");
  //     // manager.add("https://google.com", "/tmp/google-1.html");

  //     // manager.build(r => {
  //     //   const newResp = r.copy<number>();
  //     //   newResp.result = 12;
  //     //   return newResp;
  //     // });

  //     return manager.run().then(r => {
  //       LoggerService.log(LOGGER_CLI, r[0].result);
  //     });
  //   }),
  // );
};
