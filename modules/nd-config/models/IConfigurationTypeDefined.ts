type ModeKey = "mode";
type ModeValue = string; // "development" | "test" | "production";

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
type OutputLevelValue = "0" | "1" | "2";

type NovelLocationKey = "novel.location";
type NovelLocationValue = string;

type NovelExportKey = "novel.export";
type NovelExportValue = string;

export type ConfigSchema = {
  [key in ConfigKey]: ConfigValue;
};

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
  | NovelExportKey;

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
  | NovelExportValue;

export interface IConfigurationTypeDefined {
  get(key: ModeKey): ModeValue | undefined;
  set(key: ModeKey, value?: ModeValue): void;

  get(key: VersionKey): VersionValue | undefined;
  set(key: VersionKey, value?: VersionValue): void;

  get(key: AuthTokenKey): AuthTokenValue | undefined;
  set(key: AuthTokenKey, value?: AuthTokenValue): void;

  get(key: AuthNameKey): AuthNameValue | undefined;
  set(key: AuthNameKey, value?: AuthNameValue): void;

  get(key: AuthSaltKey): AuthSaltValue | undefined;
  set(key: AuthSaltKey, value?: AuthSaltValue): void;

  get(key: OutputColorKey): OutputColorValue | undefined;
  set(key: OutputColorKey, value?: OutputColorValue): void;

  get(key: OutputFileKey): OutputFileValue | undefined;
  set(key: OutputFileKey, value?: OutputFileValue): void;

  get(key: OutputLevelKey): OutputLevelValue | undefined;
  set(key: OutputLevelKey, value?: OutputLevelValue): void;

  get(key: NovelLocationKey): NovelLocationValue | undefined;
  set(key: NovelLocationKey, value?: NovelLocationValue): void;

  get(key: NovelExportKey): NovelExportValue | undefined;
  set(key: NovelExportKey, value?: NovelExportValue): void;
}
