export default class ScriptHelper {
  static addScript(src: string, key?: string) {
    const s = document.createElement('script');
    s.async = true;
    s.type = 'text/javascript';
    s.setAttribute('src', src);
    if (key) s.setAttribute('map-key', `map-key-${key}`);
    const scriptDom = document.querySelector(`script[map-key=map-key-${key}]`);
    if (scriptDom) return;
    document.body.appendChild(s);
  }

  static removeScript(ids: number) {
    const scriptDcom = document.querySelector(
      `script[module-id=module-script-${ids}]`
    );
    scriptDcom &&
      scriptDcom.parentNode &&
      scriptDcom.parentNode.removeChild(scriptDcom);
  }

  static removeAllModuleScript() {
    const scriptDcom = document.querySelectorAll(
      `script[module-id^=module-script]`
    );

    scriptDcom &&
      Array.from(scriptDcom).forEach(element => {
        element &&
          element.parentNode &&
          element.parentNode.removeChild(element);
      });
  }
}
