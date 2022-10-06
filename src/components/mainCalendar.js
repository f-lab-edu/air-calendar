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
      <article class="next-calendar-week"></article>
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

  getDayOfMonth(numberOfDays, date) {
    const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    const emptyDay = new Array(startDay).fill(null)
    const filledDay = new Array(numberOfDays).fill(null).map((_, idx) => idx + 1)

    return [...emptyDay, ...filledDay]
  }

  getDayOfWeekInnerHTML() {
    const week = ['일', '월', '화', '수', '목', '금', '토']
    return week.map((day) => `<span class="calendar-week-day">${day}</span>`).join('')
  }

  getDayOfMonthInnerHTML(monthDates) {
    return monthDates
      .map((date) => {
        if (date) {
          return `<span class="calendar-day"><span class="day-hover">${date}</span></span>`
        } else {
          return `<span class="calendar-day-none"><span class="day-hover-none"></span></span>`
        }
      })
      .join('')
  }

  getCalendar() {
    const date = new Date()
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1)

    const calendarMonth = this.shadowRoot.querySelector('.calendar-month')
    const calendarNextMonth = this.shadowRoot.querySelector('.next-calendar-month')

    calendarMonth.textContent = `${this.getYear(date)}년 ${this.getMonth(date)}월`
    calendarNextMonth.textContent = `${this.getYear(nextDate)}년 ${this.getMonth(nextDate)}월`

    const calendarWeek = this.shadowRoot.querySelector('.calendar-week')
    const nextCalendarWeek = this.shadowRoot.querySelector('.next-calendar-week')

    const dayOfWeeInnerHTML = this.getDayOfWeekInnerHTML()
    const nextDayOfWeeInnerHTML = this.getDayOfWeekInnerHTML()
    calendarWeek.innerHTML = dayOfWeeInnerHTML
    nextCalendarWeek.innerHTML = nextDayOfWeeInnerHTML

    const calendarDay = this.shadowRoot.querySelector('.calendar-days')
    const calendarNextDay = this.shadowRoot.querySelector('.next-calendar-days')

    const numberOfDays = this.getNumberOfDays(this.getYear(date), this.getMonth(date))
    const nextNumberOfDays = this.getNumberOfDays(this.getYear(nextDate), this.getMonth(nextDate))

    const monthDates = this.getDayOfMonth(numberOfDays, date)
    const nextMonthDates = this.getDayOfMonth(nextNumberOfDays, nextDate)

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
