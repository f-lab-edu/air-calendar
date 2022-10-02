//Todo: template 분리
const calendar = document.createElement('template')
calendar.innerHTML = `
  <style>
    div {
      display: flex;
      justify-content: center;
      margin: 40px 0px;
    }
    section {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 10px 20px;
      border: 1px solid gray;
      border-radius: 20px;
    }
    p {
      margin: 0;
      font-size: 14px;
    }
    .divider {
      margin: 0;
      width: 1px;
      height: 100%;
      background-color: black;
    }
  </style>
  <div>
    <section>
      <p>어디든지</p>
      <div class="divider"></div>
      <p>언제든 일주일</p>
      <div class="divider"></div>
      <p>게스트 추가</p>
    </section>
  </div>
`

class MainHeader extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(calendar.content.cloneNode(true))
  }

  connectedRender() {
    this.render()
  }

  render() {}
}

customElements.define('main-header', MainHeader)
