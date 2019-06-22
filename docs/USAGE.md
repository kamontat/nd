# ND

## Global options

```bash
$ nd --version           # short version message
$ nd --help              # help command
$ nd --mute              # mute every output
$ nd --only-error        # show only error in output
$ nd --warn              # show error and warning in output
$ nd --level [0,1,2]     # 0 mean print only error information, 2 mean print everythings
$ nd --no-color          # no color in output
$ nd --no-file           # no create any unnecessary file (like log or backup)
```

## Configuration

```bash
$ nd [setting|s] init <key> <name>      # initial command with given token key
$ nd [setting|s] init --json <json>     # load from json string
$ nd [setting|s] init --path <path>     # load from file path
$ nd [setting|s] init --replace         # replace new file with backup created
```

### Path

```bash
$ nd [setting|s] path                   # show path in console
$ nd [setting|s] path --open            # open configuration file in default text editor
$ nd [setting|s] path --open <editor>   # open configuration file in 'editor' text editor
```

### Interact

```bash
$ nd [setting|s] update <key>=<value>   # update config with key and value (equal format)
$ nd [setting|s] update auth=<auth>     # update auth with message from admin
```

### Getter

```bash
$ nd [setting|s]                        # print configuration setting in console
$ nd [setting|s] <key.name>             # get valuee on each key name
```

## Information

```bash
$ nd [command|c] [version|'']                  # show long version of command
$ nd [command|c] version --detail              # show detail of command and version

$ nd [command|c] changelog                     # show changelog file
```

### Interact

```bash
$ nd [command|c] upgrade                       # download and install latest version from the internet
$ nd [command|c] downgrade [<version>|prev]    # download specific version from the internet and install
```

### Validate

```bash
$ nd [command|c] validate <type>  # validate input type of the command (e.g. config, library etc.)
```

## Novel

```bash
$ nd [novel|''] [download|''] [<id>|<link>]                                        # download to default location in setting
$ nd [novel|''] [download|''] [<id>|<link>] --location <location>                  # download to input 'location'
$ nd [novel|''] [download|''] [<id>|<link>] --replace                              # replace when folder is exist
$ nd [novel|''] [download|''] [<id>|<link>] --change                               # list chapter that downloaded this time

$ nd [novel|''] [download|''] <id> --chapter <chapter> --location <location> --raw # raw download and transform file to location
$ nd [novel|''] [download|''] <link> --raw                                         # link must include chapter number and novel id
$ nd [novel|''] [download|''] <args...> --raw --replace                            # raw download also able to add replace option
```

### Update

```bash
$ nd [novel|''] update <location>                     # update novel from location, and the location must be novel location
$ nd [novel|''] update [<location>] --change          # update novel from input location or default one and list all changes
$ nd [novel|''] update --recursive [<number>|'']      # check is subfolder is novel location or not, if yes, update too. number is how deep that should check default is 1
```

### Fetch

```bash
$ nd [novel|''] fetch <id|link>                       # show basic information of novel from internet
$ nd [novel|''] fetch <location> --local              # show basic information of novel from novel location path
$ nd [novel|''] fetch <location> --list               # show basic information with list of chapter and status
$ nd [novel|''] fetch <location> --history            # show basic information with history of downloading result
```

### Export

```bash
$ nd [novel|''] export <location> <dest>              # export novel from location to dest
```

### Search

```bash
$ nd [novel|''] search --name <novel-name>       # search by novel name
$ nd [novel|''] search --writer <writer-name>    # search by writer name
$ nd [novel|''] search --category <name|key>     # search by category (category must be from accept text)
$ nd [novel|''] search [--short|--long]          # search only short or long novel (can be only one at the time)
$ nd [novel|''] search --end                     # search only novel that mark as end novel
$ nd [novel|''] search --limit <number>          # limit the result; default is 15
$ nd [novel|''] search --page <number>           # specific page, default is 1

$ nd [novel|''] search top --category <name|key> # search only the top novel in specific category
```

#### Category

```bash
$ nd [novel|''] category                         # list all category include name and id
$ nd [novel|''] category --search <query>        # search input query inside category database
```
