export const VkPixelTracker = {
  AUTOMATIC_OPERATIONS: ['init'],

  init(): void {
    const vkOpenApiScript = document.createElement('script')
    vkOpenApiScript.type = 'application/javascript'
    vkOpenApiScript.async = true
    vkOpenApiScript.src = 'https://vk.com/js/api/openapi.js?168'
    vkOpenApiScript.onload = () => {
      // @ts-ignore
      window.VK.Retargeting.Init(process.env.REACT_APP_VK_PIXEL_ID)
      // @ts-ignore
      window.VK.Retargeting.Hit()
    }
    document.head.appendChild(vkOpenApiScript)
  },

  reachGoal(name: string): void {
    // @ts-ignore
    window.VK.Goal(name)
  },
}
