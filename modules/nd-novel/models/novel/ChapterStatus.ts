export enum ChapterStatus {
  UNKNOWN = "unknown",
  DOWNLOADED = "downloaded",
  COMPLETED = "completed",
  CLOSED = "closed",
  SOLD = "sold",
}

export class ChapterStatusUtils {
  public static ToStatus(str: string) {
    switch (str.toLowerCase()) {
      case ChapterStatus.UNKNOWN.toLowerCase():
        return ChapterStatus.UNKNOWN;
      case ChapterStatus.COMPLETED.toLowerCase():
        return ChapterStatus.COMPLETED;
      case ChapterStatus.SOLD.toLowerCase():
        return ChapterStatus.SOLD;
      case ChapterStatus.CLOSED.toLowerCase():
        return ChapterStatus.CLOSED;
      default:
        return ChapterStatus.UNKNOWN;
    }
  }
}
