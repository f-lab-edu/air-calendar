class MainCalendar extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }) // shadowRoot를 반환
    this.render()
  }

  connectedCallback() {}

  render() {
    /** Note
     * shadowRoot에는 innerHTML, DOM method 사용 가능
     */
    this.shadowRoot.innerHTML = `
    <style>
      .calendar-wrapper {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 500px;
        background-color: #DDDDDD;
        border: 1px solid #DDDDDD;
        border-radius: 20px;
      }
    </style>
    <main class="calendar-wrapper"></main>
    `
  }
}

customElements.define('main-calendar', MainCalendar)
