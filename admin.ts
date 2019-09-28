import { BuildAdminCommandline, Package } from 'nd-admin';
import { Commandline } from 'nd-commandline-interpreter';
import { config } from 'nd-config';
import ExceptionService from 'nd-error';
import LoggerService, { LOGGER_CLI } from 'nd-logger';

declare let __NODE_ENV__: string;

const cli = new Commandline(Package.name, Package.description);

(async (): Promise<void> => {
    // add config handler
    config.on('output.level', (level: number, old: number) => {
        if (level > old) {
            LoggerService.level(level);
            LoggerService.log(LOGGER_CLI, `now output level is ${level} (old=${old})`);
        }
    });

    if (__NODE_ENV__ === 'production') config.set('output.level', 1);
    else config.set('output.level', 3);

    try {
        const commandline = await BuildAdminCommandline(cli, { stdin: process.stdin, stdout: process.stdout });
        await commandline.run(process.argv);
    } catch (e) {
        ExceptionService.cast(e)
            .print(LOGGER_CLI)
            .exit(1);
    }
})();
