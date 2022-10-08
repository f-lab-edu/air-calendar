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

  resetAllClassName = (prev, next) => {
    this.shadowRoot.querySelectorAll(prev).forEach((e) => {
      e.className = next
    })
  }

  selectDay() {
    const setDate = () => {}
    const selectedDate = (calendar, event) => {
      if (this.startDate && this.endDate) {
        // startDate보다 전이면 호버, 셀렉트 삭제 후 startDate 업데이트
        // endDate보다 뒤이면 endDate와 호버만 업데이트
        return
      }
      if (this.startDate) {
        // startDate보다 뒤 선택하면 startDate 업데이트
        event.target.className += ' end-active'
        this.endDate =
          calendar === 'left'
            ? new Date(this.date.getFullYear(), this.date.getMonth(), Number(event.target.textContent))
            : new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(event.target.textContent))

        this.shadowRoot.querySelector('.end-date').textContent = `${
          this.endDate.getMonth() + 1
        }월 ${this.endDate.getDate()}일`
        this.shadowRoot.querySelectorAll('.calendar-days .calendar-day').forEach((event) => {
          const hoverDate = new Date(this.date.getFullYear(), this.date.getMonth(), Number(event.textContent))
          if (this.startDate <= hoverDate && hoverDate <= this.endDate) {
            event.className += ' active'
          }
        })
        this.shadowRoot.querySelectorAll('.next-calendar-days .calendar-day').forEach((event) => {})

        return
      }
      if (!this.startDate) {
        // startDate만 설정
        event.target.className += ' start-active'
        this.startDate =
          calendar === 'left'
            ? new Date(this.date.getFullYear(), this.date.getMonth(), Number(event.target.textContent))
            : new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(event.target.textContent))

        this.shadowRoot.querySelector('.start-date').textContent = `${
          this.startDate.getMonth() + 1
        }월 ${this.startDate.getDate()}일`

        return
      }
    }
    const setActiveClassName = (calendar, event) => {
      event.addEventListener('click', (event) => {
        this.resetAllClassName('.calendar-day.active', 'calendar-day')
        this.resetAllClassName('.day-hover.active', 'day-hover')
        // event.target.className += ' active'
        selectedDate(calendar, event)
      })
    }
    this.shadowRoot.querySelectorAll('.calendar-days .day-hover').forEach((event) => {
      setActiveClassName('left', event)
    })

    this.shadowRoot.querySelectorAll('.next-calendar-days .day-hover').forEach((event) => {
      setActiveClassName('right', event)
    })
  }

  selectPeriod() {
    const handleMouseOver = (date, event) => {
      event.addEventListener('mouseover', (event) => {
        this.selectedDate = new Date(date.getFullYear(), date.getMonth(), Number(event.target.textContent))
        if (this.startDate !== null && this.startDate < this.selectedDate) {
          this.onPeriod()
        }
      })
    }
    this.shadowRoot.querySelectorAll('.calendar-days .day-hover').forEach((event) => {
      handleMouseOver(this.date, event)
    })
    this.shadowRoot.querySelectorAll('.next-calendar-days .day-hover').forEach((event) => {
      handleMouseOver(this.nextDate, event)
    })
  }

  onPeriod() {
    const handleActive = (date, event) => {
      if (!this.startDate || !this.endDate) {
        if (date <= this.selectedDate && this.startDate <= date) {
          event.className += ' active'
        } else {
          event.className = 'calendar-day'
        }
      }
    }
    this.shadowRoot.querySelectorAll('.calendar-days .calendar-day').forEach((event) => {
      const hoverDate = new Date(this.date.getFullYear(), this.date.getMonth(), Number(event.textContent))
      handleActive(hoverDate, event)
    })
    this.shadowRoot.querySelectorAll('.next-calendar-days .calendar-day').forEach((event) => {
      const hoverDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(event.textContent))
      handleActive(hoverDate, event)
    })
  }

  connectedCallback() {
    this.selectDay()
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
