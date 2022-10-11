const calendar = document.createElement('template')
calendar.innerHTML = `
  <div>
    <section class="calendar-header">
      <div class="calendar-check">
        <div>체크인</div>
        <div class="start-date">날짜입력</div>
      </div>
      <div class="calendar-check">
        <div>체크아웃</div>
        <div class="end-date">날짜입력</div>
      </div>
    </section>
    <main> 
      <button class="prev"><</button>
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
      <button class="next">></button>
    </main>
  </div>
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

    this.render()
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
          return `<span class="calendar-day"><span class="select-day">${date}</span></span>`
        } else {
          return `<span class="calendar-day-none"><span class="select-day-none"></span></span>`
        }
      })
      .join('')
  }

  getCalendar(date, nextDate) {
    this.date = date
    this.nextDate = nextDate

    this.shadowRoot.querySelector('.calendar-month').textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월`
    this.shadowRoot.querySelector('.next-calendar-month').textContent = `${nextDate.getFullYear()}년 ${
      nextDate.getMonth() + 1
    }월`

    this.shadowRoot.querySelector('.calendar-week').innerHTML = this.getDayOfWeekInnerHTML()
    this.shadowRoot.querySelector('.next-calendar-week').innerHTML = this.getDayOfWeekInnerHTML()

    const numberOfDays = this.getNumberOfDays(date.getFullYear(), date.getMonth())
    const nextNumberOfDays = this.getNumberOfDays(date.getFullYear(), nextDate.getMonth())

    const monthDates = this.getDayOfMonth(numberOfDays, date)
    const nextMonthDates = this.getDayOfMonth(nextNumberOfDays, nextDate)

    this.shadowRoot.querySelector('.calendar-days').innerHTML = this.getDayOfMonthInnerHTML(monthDates)
    this.shadowRoot.querySelector('.next-calendar-days').innerHTML = this.getDayOfMonthInnerHTML(nextMonthDates)
  }

  // 리셋 모음
  resetClassName = (prev, next) => {
    this.shadowRoot.querySelectorAll(prev).forEach((e) => {
      e.className = next
    })
  }
  resetAllClassName = () => {
    this.resetHoverElement()
    this.resetSelectedElement()
  }
  resetHoverElement = () => {
    this.resetClassName('.select-day.start-active', 'select-day')
    this.resetClassName('.select-day.end-active', 'select-day')
  }
  resetSelectedElement = () => {
    this.resetClassName('.calendar-day.active', 'calendar-day')
  }

  // 타입스크립트의 필요성
  handleSelectedDate(position, date) {
    return position === 'left'
      ? new Date(this.date.getFullYear(), this.date.getMonth(), Number(date))
      : new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(date))
  }

  handleCheckInDate() {
    const month = this.startDate.getMonth() + 1
    const date = this.startDate.getDate()
    this.shadowRoot.querySelector('.start-date').textContent = `${month}월 ${date}일`
    this.shadowRoot.querySelector('.end-date').textContent = `날짜입력`
  }

  handleCheckOutDate() {
    const month = this.endDate.getMonth() + 1
    const date = this.endDate.getDate()
    this.shadowRoot.querySelector('.end-date').textContent = `${month}월 ${date}일`
  }

  setEventClassName(event, className) {
    event.target.className += className
  }

  setElementClassName(element, className, reset = false) {
    if (reset) return (element.className = className)
    element.className += className
  }

  setActiveElement() {
    this.shadowRoot.querySelectorAll('.calendar-days .calendar-day').forEach((element) => {
      const selectedDate = this.handleSelectedDate('left', element.textContent)
      if (this.startDate <= selectedDate && selectedDate <= this.endDate) {
        this.setElementClassName(element, ' active')
      }
    })
    this.shadowRoot.querySelectorAll('.next-calendar-days .calendar-day').forEach((element) => {
      const selectedDate = this.handleSelectedDate('right', element.textContent)
      if (this.startDate <= selectedDate && selectedDate <= this.endDate) {
        this.setElementClassName(element, ' active')
      }
    })
  }

  setStateDate(position, event, date, resetEndDate = false) {
    this.resetAllClassName()
    this.setEventClassName(event, ' start-active')
    this.startDate = this.handleSelectedDate(position, date)
    this.handleCheckInDate()

    if (resetEndDate) {
      this.endDate = null
    }
  }

  setEndDate(position, event, date) {
    const selectedDate = this.handleSelectedDate(position, date)

    if (selectedDate < this.startDate) {
      this.setStateDate(position, event, date)
    } else {
      this.setEventClassName(event, ' end-active')
      this.endDate = this.handleSelectedDate(position, date)
      this.handleCheckOutDate()
    }

    this.setActiveElement()
  }

  handleActiveCalendar = (position, event) => {
    const date = Number(event.target.textContent)
    const selectedDate = this.handleSelectedDate(position, date)

    if (!this.startDate) {
      return this.setStateDate(position, event, date)
    }

    if (this.startDate && !this.endDate) {
      return this.setEndDate(position, event, date)
    }

    if (this.startDate && this.endDate) {
      return this.setStateDate(position, event, date, true)
    }
  }

  handleClickCalendar(position, element) {
    element.addEventListener('click', (event) => {
      this.handleActiveCalendar(position, event)
    })
  }

  selectDate() {
    this.shadowRoot.querySelectorAll('.calendar-days .select-day').forEach((element) => {
      this.handleClickCalendar('left', element)
    })
    this.shadowRoot.querySelectorAll('.next-calendar-days .select-day').forEach((element) => {
      this.handleClickCalendar('right', element)
    })
  }

  handleMouseOver = (date, element) => {
    element.addEventListener('mouseover', (event) => {
      const selectedDate = new Date(date.getFullYear(), date.getMonth(), Number(event.target.textContent))
      if (this.startDate !== null && this.startDate < selectedDate) {
        this.onPeriod(selectedDate)
      }
    })
  }

  selectPeriod() {
    this.shadowRoot.querySelectorAll('.calendar-days .select-day').forEach((element) => {
      this.handleMouseOver(this.date, element)
    })
    this.shadowRoot.querySelectorAll('.next-calendar-days .select-day').forEach((element) => {
      this.handleMouseOver(this.nextDate, element)
    })
  }

  handleHoverActive = (date, element, selectedDate) => {
    if (!this.startDate || !this.endDate) {
      if (date <= selectedDate && this.startDate <= date) {
        this.setElementClassName(element, ' active')
      } else {
        this.setElementClassName(element, 'calendar-day', true)
      }
    }
  }

  onPeriod(selectedDate) {
    this.shadowRoot.querySelectorAll('.calendar-days .calendar-day').forEach((element) => {
      const hoverDate = new Date(this.date.getFullYear(), this.date.getMonth(), Number(element.textContent))
      this.handleHoverActive(hoverDate, element, selectedDate)
    })
    this.shadowRoot.querySelectorAll('.next-calendar-days .calendar-day').forEach((element) => {
      const hoverDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(element.textContent))
      this.handleHoverActive(hoverDate, element, selectedDate)
    })
  }

  // 월 간 이동
  prev() {
    this.shadowRoot.querySelector('.prev').addEventListener('click', () => {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1)
      this.nextDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth() - 1)

      this.getCalendar(this.date, this.nextDate)
      this.selectDate()
      this.selectPeriod()

      this.shadowRoot.querySelector('.start-date').textContent = `날짜입력`
      this.shadowRoot.querySelector('.end-date').textContent = `날짜입력`
    })
  }

  next() {
    this.shadowRoot.querySelector('.next').addEventListener('click', () => {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1)
      this.nextDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth() + 1)

      this.getCalendar(this.date, this.nextDate)
      this.selectDate()
      this.selectPeriod()

      this.shadowRoot.querySelector('.start-date').textContent = `날짜입력`
      this.shadowRoot.querySelector('.end-date').textContent = `날짜입력`
    })
  }

  connectedCallback() {
    this.prev()
    this.next()
    this.selectDate()
    this.selectPeriod()
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
