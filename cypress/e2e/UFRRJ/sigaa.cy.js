/// <reference types="cypress" />
const {sigaa_login, sigaa_senha} = Cypress.env()
const baseUrl = 'https://sigaa.ufrrj.br/sigaa/verTelaLogin.do'

context('Testes SIGAA-UFRRJ', () => {

    beforeEach(() => {
      cy.on('uncaught:exception', (err, runnable) => {
        return false;
      })
      cy.viewport(1920, 1080);
      cy.visit(baseUrl)
    })

    it('Teste de recuperação de erros da Heurística de Nielsen (tenta logar no sistema com usuário e senha incorretos)', () => {
      cy.get('input[name="user.login"]').type('teste login')
      cy.get('input[name="user.senha"]').type('teste senha')
      cy.get('input[type="submit"]').click()
      cy.contains('Usuário e/ou senha inválidos').should('be.visible')
    })

    it('Teste de segurança da ISO 25010:2023 (tenta acessar uma parte restrita do sistema e é redirecionado)', () => {
      cy.visit('https://sigaa.ufrrj.br/sigaa/graduacao/discente/dados_discente.jsf')
      cy.url().should("eq", baseUrl);
    })
    
    it('Teste de adequação funcional da ISO 25010:2023 (faz login com usuário e senha corretos no sistema)', () => {
      cy.get('input[name="user.login"]').type(sigaa_login)
      cy.get('input[name="user.senha"]').type(sigaa_senha)
      cy.get('input[type="submit"]').click()
      cy.url().should("not.equal", baseUrl);
    })
})