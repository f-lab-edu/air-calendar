const calendar = document.createElement('template')
calendar.innerHTML = `
  <main>
    <section class="selected-date"></section>
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

    this.date = new Date()
    this.nextDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1)

    this.startDate = null
    this.endDate = null

    this.selectedDate = null

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

  getCalendar(date, nextDate) {
    this.shadowRoot.querySelector('.calendar-month').textContent = `${this.getYear(date)}년 ${this.getMonth(date)}월`
    this.shadowRoot.querySelector('.next-calendar-month').textContent = `${this.getYear(nextDate)}년 ${this.getMonth(
      nextDate,
    )}월`

    this.shadowRoot.querySelector('.calendar-week').innerHTML = this.getDayOfWeekInnerHTML()
    this.shadowRoot.querySelector('.next-calendar-week').innerHTML = this.getDayOfWeekInnerHTML()

    const numberOfDays = this.getNumberOfDays(this.getYear(date), this.getMonth(date))
    const nextNumberOfDays = this.getNumberOfDays(this.getYear(nextDate), this.getMonth(nextDate))

    const monthDates = this.getDayOfMonth(numberOfDays, date)
    const nextMonthDates = this.getDayOfMonth(nextNumberOfDays, nextDate)

    this.shadowRoot.querySelector('.calendar-days').innerHTML = this.getDayOfMonthInnerHTML(monthDates)
    this.shadowRoot.querySelector('.next-calendar-days').innerHTML = this.getDayOfMonthInnerHTML(nextMonthDates)
  }

  setCalendar() {}

  selectDay() {
    const resetClassName = () => {
      this.shadowRoot.querySelectorAll('.day-hover.active').forEach((e) => {
        e.className = 'day-hover'
      })
    }
    const selectedDate = (calendar, date) => {
      if (calendar === 'left') {
        this.selectedDate = new Date(this.date.getFullYear(), this.date.getMonth(), Number(date))
        this.shadowRoot.querySelector('.selected-date').textContent = `${
          this.selectedDate.getMonth() + 1
        }월 ${this.selectedDate.getDate()}`
      }
      if (calendar === 'right') {
        this.selectedDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(date))
        this.shadowRoot.querySelector('.selected-date').textContent = `${
          this.selectedDate.getMonth() + 1
        }월 ${this.selectedDate.getDate()}`
      }
    }
    const setActiveClassName = (calendar, event) => {
      event.addEventListener('click', (event) => {
        resetClassName()
        event.target.className += ' active'
        selectedDate(calendar, event.target.textContent)
      })
    }
    this.shadowRoot.querySelectorAll('.calendar-days .day-hover').forEach((event) => {
      setActiveClassName('left', event)
    })

    this.shadowRoot.querySelectorAll('.next-calendar-days .day-hover').forEach((event) => {
      setActiveClassName('right', event)
    })
  }

  connectedCallback() {
    this.selectDay()
  }

  render() {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../src/components/mainCalendar.module.css')
    this.shadowRoot.append(linkElem)

    this.getCalendar(this.date, this.nextDate)
  }
}

customElements.define('main-calendar', MainCalendar)
