const calendar = document.createElement('template')
calendar.innerHTML = `
  <main>
    <section class="main-calendar">
      <article class="calendar-month">10월</article>
      <article class="calendar-day"></article>
    </section>
    <secrion class="main-calendar">
      <article class="calendar-month">11월</article>
      <article class="calendar-day"></article>
    </secrion>
  </main>
`

class MainCalendar extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(calendar.content.cloneNode(true))
    this.render()
  }

  render() {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../src/components/mainCalendar.module.css')
    this.shadowRoot.append(linkElem)
  }
}

customElements.define('main-calendar', MainCalendar)
