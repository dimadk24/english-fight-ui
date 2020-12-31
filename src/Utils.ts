export class Utils {
  static isProductionMode = process.env.NODE_ENV === 'production'

  static async waitForTimeout(time: number): Promise<void> {
    await new Promise((res) => setTimeout(res, time))
  }

  static initMetrika(): void {
    /* eslint-disable */
    ;(function(m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function() {
          ;(m[i].a = m[i].a || []).push(arguments)
        }
      // @ts-ignore
      m[i].l = 1 * new Date()
      ;(k = e.createElement(t)),
        (a = e.getElementsByTagName(t)[0]),
        (k.async = 1),
        (k.src = r),
        a.parentNode.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

    // @ts-ignore
    ym(70656700, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    })
    /* eslint-enable */
  }
}