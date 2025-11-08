// src/lib/dayjs.ts
import dayjs from "dayjs";
import "dayjs/locale/vi";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
dayjs.locale("vi");

// === TỰ THÊM: Helper isToday ===
declare module "dayjs" {
  interface Dayjs {
    isToday(): boolean;
  }
}

dayjs.extend((_, dayjsClass) => {
  dayjsClass.prototype.isToday = function () {
    return this.isSame(dayjs(), "day");
  };
});

export { dayjs };
