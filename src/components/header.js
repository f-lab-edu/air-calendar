//Todo: template 분리
const calendar = document.createElement('template')
calendar.innerHTML = `
  <header class="header-wrapper">
    <section class="header">
      <button>어디든지</button>
      <div class="divider"></div>
      <button class="calendar-button">언제든 일주일</button>
      <div class="divider"></div>
      <button>게스트 추가</button>
      <button>🔎</button>
    </section>
  </header>
`

class MainHeader extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).append(calendar.content.cloneNode(true))
    this.render()
    this.calendarOpen = false
  }

  handleClick() {
    if (this.calendarOpen) {
      const mainCalendar = document.querySelector('main-calendar')
      mainCalendar.remove()
      this.calendarOpen = false
    } else {
      const mainCalendar = document.createElement('main-calendar')
      document.body.append(mainCalendar)
      this.calendarOpen = true
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.calendar-button').addEventListener('click', this.handleClick.bind(this))
  }

  render() {
    /**
     * Note: link 태그를 통한 외부 스타일 시트의 성능 차이
     * 많은 모던 브라우저들은 공통 노드로부터 복제되었거나 동일한 텍스트를 가지고 있는
     * <style> 태그에 대한 최적화를 구현하여 스타일 태그가 하나의 백업 스타일시트를 공유할 수 있게 합니다.
     * 이 최적화로 인해 외부 스타일과 내부 스타일의 성능은 비슷할 것입니다.
     */
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../src/components/header.module.css')
    this.shadowRoot.append(linkElem)
  }
}

customElements.define('main-header', MainHeader)
