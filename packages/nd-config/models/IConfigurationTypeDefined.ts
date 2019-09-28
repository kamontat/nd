type ModeKey = "mode";
type ModeValue = string; // "development" | "testing" | "production";

type VersionKey = "version";
type VersionValue = "v1";

type AuthTokenKey = "auth.token";
type AuthTokenValue = string;

type AuthNameKey = "auth.name";
type AuthNameValue = string;

type AuthSaltKey = "auth.salt";
type AuthSaltValue = string;

type OutputColorKey = "output.color";
type OutputColorValue = boolean;

type OutputFileKey = "output.file";
type OutputFileValue = boolean;

type OutputLevelKey = "output.level";
type OutputLevelValue = 0 | 1 | 2 | 3;

type NovelLocationKey = "novel.location";
type NovelLocationValue = string;

type CommandVersionDetailLimitKey = "command.version.detail.limit";
type CommandVersionDetailLimitValue = number;

// type NovelExportKey = "novel.export";
// type NovelExportValue = string;

export type ConfigSchema = { [key in ConfigKey]: ConfigValue };

export type ConfigKey =
  | ModeKey
  | VersionKey
  | AuthTokenKey
  | AuthNameKey
  | AuthSaltKey
  | OutputColorKey
  | OutputFileKey
  | OutputLevelKey
  | NovelLocationKey
  | CommandVersionDetailLimitKey;
// | NovelExportKey;

export type ConfigValue =
  | ModeValue
  | VersionValue
  | AuthTokenValue
  | AuthNameValue
  | AuthSaltValue
  | OutputColorValue
  | OutputFileValue
  | OutputLevelValue
  | NovelLocationValue
  | CommandVersionDetailLimitValue;
// | NovelExportValue;

export interface IConfigurationTypeDefined {
  get(key: ModeKey): ModeValue | undefined;
  get(key: VersionKey): VersionValue | undefined;
  get(key: AuthTokenKey): AuthTokenValue | undefined;
  get(key: AuthNameKey): AuthNameValue | undefined;
  get(key: AuthSaltKey): AuthSaltValue | undefined;
  get(key: OutputColorKey): OutputColorValue | undefined;
  get(key: OutputFileKey): OutputFileValue | undefined;
  get(key: OutputLevelKey): OutputLevelValue | undefined;
  get(key: NovelLocationKey): NovelLocationValue | undefined;
  get(key: CommandVersionDetailLimitKey): CommandVersionDetailLimitValue | undefined;
  // get(key: NovelExportKey): NovelExportValue | undefined;

  set(key: ModeKey, value?: ModeValue): void;
  set(key: VersionKey, value?: VersionValue): void;
  set(key: AuthTokenKey, value?: AuthTokenValue): void;
  set(key: AuthNameKey, value?: AuthNameValue): void;
  set(key: AuthSaltKey, value?: AuthSaltValue): void;
  set(key: OutputColorKey, value?: OutputColorValue): void;
  set(key: OutputFileKey, value?: OutputFileValue): void;
  set(key: OutputLevelKey, value?: OutputLevelValue): void;
  set(key: NovelLocationKey, value?: NovelLocationValue): void;
  set(key: CommandVersionDetailLimitKey, value?: CommandVersionDetailLimitValue): void;
  // set(key: NovelExportKey, value?: NovelExportValue): void;
}
