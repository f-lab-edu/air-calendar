class MainCalendar extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' }) // shadowRoot를 반환
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadow.innerHTML = `<p></p>` // shadowRoot에는 innerHTML, DOM method 사용 가능
  }
}

customElements.define('main-calendar', MainCalendar)
