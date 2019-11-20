export enum ChapterStatus {
  UNKNOWN = "unknown", // unknown status, usually when first create
  IGNORED = "ignore", // not implement yet
  COMPLETED = "completed", // when download completed and save to memory
  CLOSED = "closed", // when downloaded and found chapter was closed
  SOLD = "sold" // when downloaded and found chapter was sold
}

export class ChapterStatusUtils {
  public static ToStatus(str: string) {
    switch (str.toLowerCase()) {
      case ChapterStatus.UNKNOWN.toLowerCase():
        return ChapterStatus.UNKNOWN;
      case ChapterStatus.COMPLETED.toLowerCase():
        return ChapterStatus.COMPLETED;
      case ChapterStatus.IGNORED.toLowerCase():
        return ChapterStatus.IGNORED;
      case ChapterStatus.SOLD.toLowerCase():
        return ChapterStatus.SOLD;
      case ChapterStatus.CLOSED.toLowerCase():
        return ChapterStatus.CLOSED;
      default:
        return ChapterStatus.UNKNOWN;
    }
  }
}
