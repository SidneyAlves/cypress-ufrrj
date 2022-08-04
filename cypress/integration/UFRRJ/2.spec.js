/// <reference types="cypress" />
const baseUrl = 'https://sigaa.ufrrj.br/sigaa/verTelaLogin.do'

context('Testes SIGAA-UFRRJ', () => {

    beforeEach(() => {
      cy.visit(baseUrl)
    })

    it('Teste de recuperação de erros da Heurística de Nielsen (tenta logar no sistema com usuário e senha incorretos)', () => {
      cy.get('input[name="user.login"]').type('teste login')
      cy.get('input[name="user.senha"]').type('teste senha')
      cy.get('input[type="submit"]').click()
      cy.contains('Usuário e/ou senha inválidos').should('be.visible')
    })
    
})