import { Commandline, Option } from 'nd-commandline-interpreter';
import { config, IConfiguration } from 'nd-config';
import { DebugMode } from 'nd-debug';
import LoggerService, { LOGGER_CLI } from 'nd-logger';

import { CCommand, CConfig, CNovel } from './commands';
import { Help, Level, Version } from './options';

// set logger level if --level [0|1|2] appear
export const UpdateLogInfo = (args: unknown[]) => {
    const i = args.findIndex(v => /^--level$/.test(v));
    if (i >= 0) {
        const v = args[i + 1];
        const n = parseInt(v);

        if (!isNaN(n)) config.set('output.level', n);

        // update log level
        LoggerService.log(LOGGER_CLI, 'update output.level via command option');
    }
};

// --------------------------- //
// Start commandline interface //
// --------------------------- //

export const BuildCommandline = async (cli: Commandline, config: IConfiguration) => {
    cli.option(
        Option.build('debug-mode', false, () => {
            const mode = new DebugMode();
            mode.open();
        }),
    );

    await Help(cli, config);

    await Version(cli, config);

    await Level(cli, config);

    await CConfig(cli, config);

    // FIXME: crash on production
    // CCompletion(cli, config);

    await CCommand(cli, config);

    await CNovel(cli, config);

    return cli;
};
