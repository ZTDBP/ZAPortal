import router from './router'
import { EventBus } from '@/utils/event-bus'
import store from '@/store'

const whiteList = ['login', 'home'] // skip login

router.beforeEach(async(to, from, next) => {
  EventBus.$emit('app.loading', true)
  document.title = to?.meta?.title || 'ZAPortal'

  // goto login if needed
  try {
    if (!whiteList.includes(to.name)) {
      await store.dispatch('getUserInfo')
    }
  } catch (e) {
    if (to.name !== 'login') {
      EventBus.$emit('app.message', 'Need login', 'warning')
      hideLoading()
      next({ name: 'login' })
    }
  }

  next()
})

router.afterEach(_ => {
  hideLoading()
})

function hideLoading() {
  window.setTimeout(() => {
    EventBus.$emit('app.loading', false)
  }, 100)
}