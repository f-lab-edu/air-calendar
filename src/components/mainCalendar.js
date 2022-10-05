const calendar = document.createElement('template')
calendar.innerHTML = `
  <main>
    <section class="main-calendar">
      <article class="calendar-month"></article>
      <article class="calendar-week"></article>
      <article class="calendar-days"></article>
    </section>
    <secrion class="main-calendar">
      <article class="next-calendar-month"></article>
      <article class="calendar-week"></article>
      <article class="next-calendar-days"></article>
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

  getYear(date) {
    return date.getFullYear()
  }

  getMonth(date) {
    return date.getMonth() + 1
  }

  getNumberOfDays(year, month) {
    return new Date(year, month, 0).getDate()
  }

  getDayElements(numberOfDays) {
    return Array.from(Array(numberOfDays).keys()).map((day) => day + 1)
  }

  getDayOfMonthInnerHTML(monthDates) {
    return monthDates.map((date) => `<span class="calendar-day">${date}</span>`).join('')
  }

  getCalendar() {
    const date = new Date()
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1)

    const calendarMonth = this.shadowRoot.querySelector('.calendar-month')
    const calendarNextMonth = this.shadowRoot.querySelector('.next-calendar-month')

    calendarMonth.textContent = `${this.getYear(date)}년 ${this.getMonth(date)}월`
    calendarNextMonth.textContent = `${this.getYear(nextDate)}년 ${this.getMonth(nextDate)}월`

    const calendarDay = this.shadowRoot.querySelector('.calendar-days')
    const calendarNextDay = this.shadowRoot.querySelector('.next-calendar-days')

    const numberOfDays = this.getNumberOfDays(this.getYear(date), this.getMonth(date))
    const nextNumberOfDays = this.getNumberOfDays(this.getYear(nextDate), this.getMonth(nextDate))

    const monthDates = this.getDayElements(numberOfDays)
    const nextMonthDates = this.getDayElements(nextNumberOfDays)

    const dayOfMonthInnerHTML = this.getDayOfMonthInnerHTML(monthDates)
    const nextDayOfMonthInnerHTML = this.getDayOfMonthInnerHTML(nextMonthDates)

    calendarDay.innerHTML = dayOfMonthInnerHTML
    calendarNextDay.innerHTML = nextDayOfMonthInnerHTML
  }

  render() {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../src/components/mainCalendar.module.css')
    this.shadowRoot.append(linkElem)

    this.getCalendar()
  }
}

customElements.define('main-calendar', MainCalendar)
