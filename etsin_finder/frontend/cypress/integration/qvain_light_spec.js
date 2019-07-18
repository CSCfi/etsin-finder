describe('Qvain Light Datasets view', () => {
  it('successfully loads', () => {
    // Edit hosts to associate IP address with testing.
    // Cypress chrome instance doesn't like secure connections with
    // self signed certs to IP addresses. It is fine with URLs.
    cy.visit('https://testing/qvain')
  })
})

describe('Login test', () => {
  it('successfully logs in', () => {
    // can't test due to cross origin issues
  })
})
