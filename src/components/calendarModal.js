const calendarModal = document.createElement('template')
calendarModal.innerHTML = `
<aside class="calendar-wrapper">
  <main-calendar></main-calendar>
</aside>`

class CalendarModal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(calendarModal.content.cloneNode(true))
    this.render()
  }

  connectedCallback() {}

  render() {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../src/components/calendarModal.module.css')
    this.shadowRoot.append(linkElem)
  }
}

customElements.define('calendar-modal', CalendarModal)
