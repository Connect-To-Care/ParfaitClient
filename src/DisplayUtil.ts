export class DisplayUtil {
  public static openFullscreen = (elem: any) => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(e => console.log('Failed opening full screen:', e));
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  public static closeFullscreen = (document: any) => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
      }); // Ignore
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };
}
