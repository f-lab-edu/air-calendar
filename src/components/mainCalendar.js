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

    this.selectedDate = null

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
          return `<span class="calendar-day"><span class="day-hover">${date}</span></span>`
        } else {
          return `<span class="calendar-day-none"><span class="day-hover-none"></span></span>`
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

  resetAllClassName = (prev, next) => {
    this.shadowRoot.querySelectorAll(prev).forEach((e) => {
      e.className = next
    })
  }

  selectDay() {
    const selectedDate = (calendar, event) => {
      if (this.startDate && this.endDate) {
        this.resetAllClassName('.day-hover.start-active', 'day-hover')
        this.resetAllClassName('.day-hover.end-active', 'day-hover')

        event.target.className += ' start-active'

        this.startDate =
          calendar === 'left'
            ? new Date(this.date.getFullYear(), this.date.getMonth(), Number(event.target.textContent))
            : new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(event.target.textContent))
        this.endDate = null

        this.shadowRoot.querySelector('.start-date').textContent = `${
          this.startDate.getMonth() + 1
        }월 ${this.startDate.getDate()}일`
        this.shadowRoot.querySelector('.end-date').textContent = `날짜입력`
      } else if (this.startDate && !this.endDate) {
        const selectedDate =
          calendar === 'left'
            ? new Date(this.date.getFullYear(), this.date.getMonth(), Number(event.target.textContent))
            : new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(event.target.textContent))

        if (selectedDate < this.startDate) {
          this.resetAllClassName('.day-hover.start-active', 'day-hover')
          this.resetAllClassName('.day-hover.end-active', 'day-hover')
          event.target.className += ' start-active'
          this.startDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            Number(event.target.textContent),
          )
          this.shadowRoot.querySelector('.start-date').textContent = `${
            this.startDate.getMonth() + 1
          }월 ${this.startDate.getDate()}일`
        }

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
        this.shadowRoot.querySelectorAll('.next-calendar-days .calendar-day').forEach((event) => {
          const hoverDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(event.textContent))
          if (this.startDate <= hoverDate && hoverDate <= this.endDate) {
            event.className += ' active'
          }
        })
      } else if (!this.startDate) {
        event.target.className += ' start-active'
        this.startDate =
          calendar === 'left'
            ? new Date(this.date.getFullYear(), this.date.getMonth(), Number(event.target.textContent))
            : new Date(this.nextDate.getFullYear(), this.nextDate.getMonth(), Number(event.target.textContent))

        this.shadowRoot.querySelector('.start-date').textContent = `${
          this.startDate.getMonth() + 1
        }월 ${this.startDate.getDate()}일`
      }
    }

    const setActiveClassName = (calendar, event) => {
      event.addEventListener('click', (event) => {
        this.resetAllClassName('.calendar-day.active', 'calendar-day')
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

  prev() {
    this.shadowRoot.querySelector('.prev').addEventListener('click', () => {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1)
      this.nextDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth() - 1)
      this.getCalendar(this.date, this.nextDate)
      this.selectDay()
      this.selectPeriod()
    })
  }

  next() {
    this.shadowRoot.querySelector('.next').addEventListener('click', () => {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1)
      this.nextDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth() + 1)
      this.getCalendar(this.date, this.nextDate)
      this.selectDay()
      this.selectPeriod()
    })
  }

  connectedCallback() {
    this.prev()
    this.next()
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
