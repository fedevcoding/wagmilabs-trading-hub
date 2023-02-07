import React from 'react'

import "./legal.css"

const Legals = () => {
  return (
    <div class="legal-container">
        <a href="/termsofservice.html" target="_blank"><button class="button">Terms Of Service</button></a>
        <a href="/privacypolicy.html" target="_blank"><button class="button">Privacy Policy</button></a>
        <a href="/eula.html" target="_blank"><button class="button">EULA</button></a>
        <a href="/disclaimer.html" target="_blank"><button class="button">Disclaimer</button></a>
        <a href="/cookiepolicy.html" target="_blank"><button class="button">Cookie Policy</button></a>
        <a href="/acceptableuse.html" target="_blank"><button class="button">Acceptable Use  Policy</button></a>
    </div>
  )
}

export default Legals