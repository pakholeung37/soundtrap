
export function SecToMin(s: number) {
  let temp, time = [0, 0];
  time[0] = Math.floor(s / 60);
  temp = s - time[1] * 60;
  time[1] = Math.floor(temp);
  return `${('0' +　time[0]).slice(-2)}: ${('0' +　time[1]).slice(-2)}`
}