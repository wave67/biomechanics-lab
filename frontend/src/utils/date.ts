import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

export { dayjs };

export function formatDate(date: string | undefined | null): string {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

export function formatDateShort(date: string | undefined | null): string {
  if (!date) return '-';
  return dayjs(date).format('MM-DD');
}
