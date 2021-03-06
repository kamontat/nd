# ND - Novel Downloader

<a name="unreleased"></a>

## [Unreleased]

<a name="v1.0.0-alpha.5"></a>

## [v1.0.0-alpha.5] - 2019-10-12

### 1. Introduce new features

- **content:** add new models for novel content
- **core:** add new packages is nd-core for core of nd command
- **database:** support no internet connection error
- **helper:** add string utils to helper modules
- **html-gen:** support new content object of novel content

### 2. Command improvement

- **cli-builder:** add version as parameters of commandline
- **content:** expose object to nd-content
- **database:** remove unknown log from firebase
- **debug:** move models to folder and add support disable color in debug log
- **deps:** update changelog config to support BREAK_CHANGE format
- **downloader:** update new typo with level 2 is set.
- **error:** add more helpful method in exception object
- **error:** update log format
- **helper:** add more test in random and optional object
- **logger:** export namespace of logger instance
- **novel:** add support to novel and chapter object
- **novel:** update novel apis method to return new content object
- **security:** update security generate method

### 3. Command bug destoryer

- **ci:** add env var to linter and tester
- **cli:** update commandline object to support new version
- **cli:** change application name in help option
- **config:** parser is working incorrect when enter number
- **core:** version and command description is switch
- **docs:** update command version space
- **helper:** number is not random, it always return 0
- **helper:** test must specify timezone
- **helper:** update random method to resolve testcase
- **helper:** fix some testcase of optional models is fail
- **helper:** update more usecase to random apis
- **lint:** resolve any warning in db and config
- **lint:** remove unused object
- **logger:** console of log service depend on config only
- **novel:** resolve something command get invalid update at date

### Pull Requests
- Merge pull request [#3](https://github.com/kamontat/nd/issues/3) from kamontat/dependabot/npm_and_yarn/webpack-cli-3.3.9
- Merge pull request [#4](https://github.com/kamontat/nd/issues/4) from kamontat/dependabot/npm_and_yarn/types/jsonwebtoken-8.3.4
- Merge pull request [#15](https://github.com/kamontat/nd/issues/15) from kamontat/dependabot/npm_and_yarn/mixin-deep-1.3.2

### BREAK_CHANGE

This lead to all security key that generate before this
version release cannot be used.

<a name="v1.0.0-alpha.4"></a>

## [v1.0.0-alpha.4] - 2019-09-28

### 1. Introduce new features

- **cli:** add debug-mode option
- **cli:** add support --check in fetch command
- **cli:** add dry-run option to novel update
- **formatter:** add history formatter
- **helper:** export all constants name from nd-helper
- **lib:** publish new dependencies for open debug mode
- **lib:** initial new submodule; nd-content for html content

### 2. Command improvement

- **cli:** change 'nd command' response color
- **cli:** implement new option in main command
- **docs:** add new badge to readme
- **formatter:** use history formatter in novel summary
- **helper:** log and tmp folder is dynamic name
- **helper:** improve tmp and log name to support apis
- **helper:** add datatype checker; move from cli-builder
- **logger:** change version color to cyan
- **logger:** add new namespace for helper log
- **novel:** improve compare method and format beautiful format
- **novel:** move novel merge method from novel apis
- **novel:** expose history object out

### 3. Command bug destoryer

- **cli:** subcommand help didn't return correct message
- **formatter:** forget to add newline on history summary
- **logger:** change checker from helper to internal method
- **test:** fix test error for new exception apis

### Pull Requests
- Merge pull request [#14](https://github.com/kamontat/nd/issues/14) from kamontat/chore/convert-tslint-to-eslint-prettier
- Merge pull request [#2](https://github.com/kamontat/nd/issues/2) from kamontat/dependabot/npm_and_yarn/lodash-4.17.15

<a name="v1.0.0-alpha.3"></a>

## [v1.0.0-alpha.3] - 2019-09-10

### 1. Introduce new features

- **admin:** add new command firebase for get firebase name
- **admin:** add logger level and print when error occur
- **cli:** add --json to 'nd command' command
- **cli:** add fetch novel from path and show the result
- **cli:** add changelog limit to command version --detail
- **cli:** remove support --open in config path
- **cli:** merge command with command verify
- **cli:** add --fast to fetch
- **cli:** add update command to novel and final it
- **database:** change main database type to firestore
- **database:** add support firebase storage for file downloading
- **database:** add new method initialfirebasestorage
- **database:** tested database modules
- **file:** reimplement file to support update novel [WIP]
- **file:** implement FileSystem.run() to support custom json object
- **file:** add support write and read with multiple thread
- **file:** add default generic file manager and readSync
- **novel:** implement load novel from Resource object
- **novel:** add support load novel via resource
- **resource:** merge builder with resource object
- **resource:** add resource example usage
- **resource:** add new lib: nd-security, encrypt content
- **security:** add server object to support server validation
- **security:** add new string in jwt; fbname for firebase
- **thread:** reimplement for more generic and abstract class

### 2. Command improvement

- **admin:** add standalone for get package info
- **admin:** add logger for admin
- **admin:** use anonymous method instead
- **admin:** fix admin support nd version
- **admin:** update help; add new command firebase
- **admin:** update log level only in production
- **cli:** show first and end when run 'nd command'
- **cli:** change option in novel
- **cli:** implement new option of download raw
- **cli:** fetch will auto mark fast when chapter option not exist
- **cli:** add admin version to command command
- **cli:** add command verify support server auth
- **cli:** add brand new option in novel download
- **cli:** update nd-config to version 1.6.3
- **cli:** add message when file been replace
- **cli:** support command with 'help' to show indv help
- **cli:** add --chapter option to fetch local novel
- **cli:** remove --open from config path command
- **cli:** add caches path to novel summary log
- **cli:** do not throw error in option
- **cli:** add novel resource to help command for update
- **cli:** update error typo when non novel id exist
- **cli:** replace option in novel download is available
- **cli:** BREAK_CHANGE: new chapter and chapters option
- **cli:** add no-replace to update command
- **cli:** actual add help subcommand to command, config
- **cli:** use async-await instead of promise
- **cli-builder:** update debugger for more information in config
- **cli-builder:** add IsPath verify method
- **cli-builder:** add support auth via server
- **cli-builder:** add type of command interface; api changes
- **cli-builder:** reupgrade debug logger on cli-builder
- **cli-builder:** add IsFileExist() verify method
- **cli-builder:** add new has method for cli config
- **color:** change date and datetime color to blue
- **config:** add new config 'command.version.detail.limit'
- **config:** change default level to 0 and don't save higher level number
- **config:** override default output.level before save to file
- **config:** output.level should be number instead string
- **config:** update configuration validation to support string[]
- **database:** make database service able to support storage
- **database:** change firebase init only when not init before
- **database:** remove too long logger
- **database:** enable write db via interface
- **database:** make it clear and fast :)
- **database:** implement firebase with read/write access
- **docs:** add --no-replace to help docs
- **downloader:** handle too many request exception via keep sending
- **downloader:** change deprecated threadManager to release version
- **error:** add file system error
- **error:** new error type for database error
- **file:** api change: after load with {tmp}, return LoadResult.Emp instead
- **file:** add create caches folder/file in load()
- **file:** make file manager to support caches when force
- **file:** update thread manager to version 2
- **file:** add deprecated message to v1 class and models
- **file:** add more enum; file action and unknown error in load result
- **file:** (cont.) add again method when error occurred
- **file:** add move file method
- **file:** add on demend join new path in path from file manager
- **file:** update error message of loading file content
- **file:** implement tmp on load() and fix load with file/folder
- **formatter:** add more output from novel summary
- **formatter:** remove chapter section if empty
- **formatter:** add support caches directory path to novel output
- **formatter:** update novel summary code to cleaner and easier to understand
- **formatter:** add new change option to split hist, chap
- **help:** update novel raw in help option
- **help:** add new help option
- **helper:** add random number and string
- **helper:** throw empty array when cannot make readable
- **helper:** remove cli-builder dependency; it should depend
- **helper:** add new array utils; merge object array to object
- **helper:** add tmp and caches file generator in pathUtils
- **helper:** customable on random string size in caches and tmp
- **helper:** remove chalk as it not print anything
- **history:** add limit when print out
- **html-gen:** reset return this to chain code
- **logger:** add support log boolean with difference color
- **logger:** add new namespace
- **logger:** add admin namespace
- **logger:** change name color to blue
- **logger:** move level decoder to logger service
- **logger:** add logger namespace to support storage
- **logger:** improve new logger code structure
- **logger:** add history namespace
- **logger:** add novel resource namespace
- **novel:** improve print chapter format
- **novel:** add continue when build with fast flag
- **novel:** implement auto classify type base on input
- **novel:** decoder changes: remove ตอนที่ ...
- **novel:** move auto classify history type out
- **novel:** add option to disable history event
- **novel:** make novel, chapter and history jsonable
- **novel:** more custom novel object via setter method
- **novel:** change nothing change to error and force exit the command
- **novel:** add merge to novel together
- **novel:** add download at for long print
- **novel:** implement update() in NovelBuilder object
- **novel:** add thai date converter from chapter information
- **novel:** support fast build with only load first page
- **novel:** implement merge method
- **novel:** support history keeper of chapter
- **novel:** support disable content key; might large
- **novel:** implement auto get 'update at' when index downloaded
- **novel:** support preload chapter title from index page
- **path:** add new generate name APIs
- **resource:** update nd-file to v2.0.0-alpha.3
- **resource:** update non-readable resource file
- **resource:** add filename to resource for 2 purpose
- **resource:** support multiple use in resource builder
- **resource:** custom file system option from write method
- **security:** add support online database in decryption
- **security:** response of hash function will be uppercase
- **security:** change the way to generate firebase name
- **thread:** return option is optional
- **thread:** remove unused files
- **thread:** option and optionOnce are modifiable by method only
- **thread:** async function should be promise instead of callback
- **thread:** remove deprecated models

### 3. Command bug destoryer

- **admin:** update admin to use async-await instead of promise
- **ci:** update engines whitelist
- **cli:** add download as root command too
- **cli:** fix Cannot read property 'length' of undefined
- **cli:** caches is not a path
- **cli:** something log not show because duplicate load low level
- **cli:** error with input wrong option/params
- **cli:** fix duplicate logger loader
- **cli:** due to resource lib changes
- **cli:** due to file manager changes
- **cli:** sometime level is not work as expected
- **cli:** update when thread number from option
- **cli:** output level didn't load on the first time
- **cli-builder:** wrong condition on check is path
- **cli-builder:** config don't load default when number parse
- **cli-builder:** error when parse param option multiple time
- **cli-builder:** optional might execute multiple times
- **config:** wrong logger type
- **config:** add new config to validation schema
- **file:** promise must be return to wait their resolve
- **file:** rename is not work as expected because it remove basename before run
- **file:** export more some required property
- **file:** wrong condition to throw type error
- **file:** rename on async didn't append to final directory
- **formatter:** remove support long in novel summary
- **helper:** misunderstand parseInt never throw
- **html-gen:** update html files path fail
- **html-gen:** update date formatter generate name for mustache
- **html-gen:** variable is replace so make some value missing
- **html-gen:** wrong previous chapter link
- **logger:** fix file loader in some environment
- **novel:** decode chapter name is not work when chapter 10+
- **novel:** due to downloader changes by thread manager result changes
- **thread:** fix compile error
- **thread:** return type of _map is a Dic not a array
- **thread:** async method didn't return value as expected; fix it

<a name="v1.0.0-alpha.2"></a>

## [v1.0.0-alpha.2] - 2019-07-28

### 1. Introduce new features

- **cli:** when save file; the command will seperate thread
- **config:** apply validation and error on set new config
- **file:** custom file exception callback
- **formatter:** add support novel printing with changelog
- **helper:** add new variable checker as a helper
- **thread:** add new package for manage thread

### 2. Command improvement

- **cli:** command will throw error when novel folder exist
- **downloader:** move get with redirect as apis
- **downloader:** implement download with thread management
- **error:** support stack error when load Error object
- **file:** add support multiple thread write to file
- **file:** add new error event; folder not empty
- **helper:** remove time when not exist
- **logger:** add new namespace; thread-manager
- **logger:** add more color for key and value
- **logger:** add more color name and enum
- **novel:** support toString in chapter with color & format
- **novel:** export history novel
- **novel:** collect changes of novel object to history node
- **novel:** update history node to support toString and color
- **thread:** add size of parameters
- **thread:** add logger to thread manager

### 3. Command bug destoryer

- **cli:** no-color, level bug by new config parser
- **cli:** configuration path should require param
- **file:** folder-not-empty didn't throw when load subfolder
- **novel:** change code as a api changes
- **novel:** change category verify object in novel object
- **script:** just notice that tag come before commit

<a name="v1.0.0-alpha.1"></a>

## v1.0.0-alpha.1 - 2019-07-22

### 1. Introduce new features

- **admin:** add admin process and configuration
- **cli:** add new command `config get`
- **cli:** add auto download novel from dek-d
- **cli:** add new command version --detail
- **cli-builder:** add support option in command and subcommand
- **cli-builder:** add support local cache for fast configuration
- **config:** integrate with event
- **content:** change author name to binary
- **decoder:** implement string decoding to convert html encode
- **downloader:** implement download libraries
- **downloader:** multiple thread with event listenable
- **error:** add suffix of error message and change some typo
- **error:** rebuild and structure of error apis
- **file:** support save to file
- **helper:** add path utils
- **helper:** add format array with readable string
- **helper:** add time management to helper
- **htmlgen:** build html string with input configuration
- **logger:** new implement whole logger models
- **novel:** support partial build with specify chap
- **novel:** complete novel api and object
- **script:** add release core script
- **setup:** complete first build and deploy

### 2. Command improvement

- **admin:** update help of admin command
- **algo:** change the way to delete array
- **build:** improve new build in main script
- **cli:** update version detail to list all changelogs
- **cli:** add completed message on the end
- **cli:** remove end completed message
- **cli-builder:** global option can be swap any place
- **cli-builder:** add authentication checker in cli apis
- **cli-builder:** add async-await support
- **cli-builder:** add default callback in root command
- **cli-builder:** add verify to apis object
- **cli-builder:** add validate parameter missing
- **cli-builder:** add more log for debugging
- **cli-builder:** add error when no parameter missing
- **cli-builder:** support default value in config get
- **cli-builder:** add event when opt or cmd executed
- **cli-builder:** add logger before exit process
- **cli-builder:** add new event 'end'
- **cli-builder:** update error message
- **compiler:** update webpack compiler for html and css
- **completion:** integrate completion to script
- **config:** change default log level for testing
- **config:** resolve location if . exist
- **config:** support restore config file, save and built config
- **config:** update and notify event even update the same value
- **config:** add prompt auth when start new config setup
- **config:** upgrade type in config to support individual key
- **config:** detect and remove comment with # char
- **config:** try to resolve absolute path before query
- **config:** default config location is ~/.nd/config.ndc
- **config:** add multiple config in one line
- **config:** event will update instantly with event emit
- **config:** change default config output.level 2 => 1
- **config:** formating error when config not found
- **config:** add get config via regex
- **content:** change file name
- **content:** update help command text and color
- **content:** seperate content
- **content:** remove external lib for full detail version
- **core:** support disable color via config file
- **core:** add config set command
- **core:** remove WIP from some of docs
- **decoder:** update decoder to pass encode directly
- **docs:** update README
- **docs:** add Package object to new lib template
- **docs:** remove --detail of command
- **docs:** update core doc due to command usage changes
- **docs:** update help command due to api changes
- **docs:** add more step todo on add new lib
- **downloader:** add more log and pass index to build method
- **downloader:** add http header as builder object
- **downloader:** remove file path in download
- **error:** update error constants to be class instead
- **error:** update error throwable algorithm
- **error:** now error log format is depend on node env
- **error:** update constants name
- **error:** support new error; decoding error
- **error:** error apis support custom base code
- **error:** add support to logger version 1.0.1
- **file:** export path name to print out
- **formatter:** add formatter for novel
- **formatter:** add json formatter support with colors
- **formatter:** add path as a config to novel summary
- **formatter:** make it configable
- **help:** update help for download novel and raw
- **helper:** add path utils to helper
- **helper:** add optional object
- **helper:** make time format in thai completed
- **helper:** add convert thai month name and year
- **helper:** add transform string to array
- **helper:** parse date now accept undefined
- **helper:** remove logger in optional model
- **helper:** upgrade optional object with non transform
- **logger:** add new namespace; decoder
- **logger:** add debug log, this should remove before deploy
- **logger:** update color on commandline interface
- **logger:** change how downloader namespace preform
- **logger:** make logger extendable
- **logger:** add enable and disable log dynamically
- **logger:** add more color in path and id
- **logger:** add more log namespace for download and update
- **logger:** add more namespace file and html
- **logger:** add new namespace to support local caches
- **logic:** change end and exit in command apis
- **novel:** support new chapter status; ignore and downloaded
- **option:** implement --version
- **option:** integrate level 3 algorithm
- **package:** change changelog key
- **security:** update algorithm for nd security :)
- **security:** change NdSecurity to security
- **security:** update and add more log
- **security:** cachable response in decrypt
- **security:** add new encryption method for string

### 3. Command bug destoryer

- **cli:** fix build error because wrong format
- **cli-builder:** command with parameter will resolve missing param
- **cli-builder:** configuration didn't apply default value
- **cli-builder:** fix parameter of option didn't resolve correctly
- **cli-builder:** --help command does not end the whole command
- **cli-builder:** skip option is not skipping but stopping
- **cli-builder:** add commandline event object
- **config:** cannot load when config file not found
- **config:** fix command not exit when backup not exist
- **core:** update config event listener
- **core:** change console.log didn't matches log setting
- **help:** fix typo in raw downloading
- **helper:** update verify helper
- **logger:** remove invalid empty array
- **logger:** fix log level not work in cli option
- **novel:** fix invalid update time due to parse error
- **option:** --no-color not work with level 2
- **security:** change allowness of 1 month


[v1.0.0-alpha.5]: https://github.com/kamontat/nd/compare/v1.0.0-alpha.4...v1.0.0-alpha.5
[v1.0.0-alpha.4]: https://github.com/kamontat/nd/compare/v1.0.0-alpha.3...v1.0.0-alpha.4
[v1.0.0-alpha.3]: https://github.com/kamontat/nd/compare/v1.0.0-alpha.2...v1.0.0-alpha.3
[v1.0.0-alpha.2]: https://github.com/kamontat/nd/compare/v1.0.0-alpha.1...v1.0.0-alpha.2
