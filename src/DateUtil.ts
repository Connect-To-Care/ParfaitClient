export class DateUtil {
  static formatDate = (strDate: string): string => {
    const date = new Date(strDate);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + DateUtil.getStrTime(date);
  };

  static getStrTime = (date: Date) => {
    let hours = date.getHours();
    let minutes: any = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  };
}
