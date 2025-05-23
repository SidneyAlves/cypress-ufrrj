/// <reference types="cypress" />
const baseUrl = 'http://r1.ufrrj.br/sisu/convocacao-sisu/'

context('Testes SISU-UFRRJ', () => {

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        })
      cy.viewport(1920, 1080);
      cy.visit(baseUrl)
    })

    it('Teste de consistência e padronização da Heurística de Nielsen (verifica se todas as divs de cursos possuem a mesma classe)', () => {
        cy.get('#container > .row').each(() => {
            cy.get('div').should('have.class', 'col-lg-2')
        })
    })

    it('Teste de compatibilidade da ISO 25010:2023 (valida se da tela do SISU é possível abrir o sistema de matrícula)', () => {
        cy.contains('http://sigps.ufrrj.br/').invoke('removeAttr', 'target').click()
        cy.url().should('include', 'https://sso.acesso.gov.br/login')
    })

    const quantidadeDeCursosPorCampus = {
        'Seropédica': 39,
        'Nova Iguaçu': 12,
        'Três Rios': 4,
        'Ensino a Distância (EAD)': 5
    }

    it('Teste de adequação funcional da ISO 25010:2023 (valida a quantidade de campus e cursos por campus)', () => {
        cy.get('#container').within(() => {
            cy.get('.row').should('have.length', Object.keys(quantidadeDeCursosPorCampus).length).each(($el, index) => {
                cy.wrap($el).within(() => {
                    cy.wrap($el).get('div').should('have.length', quantidadeDeCursosPorCampus[Object.keys(quantidadeDeCursosPorCampus)[index]])
                })
            })
        })
    })

    const arquivoSistemasDeInformacao = 'Sistema_de_informacao_Seropedica'

    it('Teste de adequação funcional da ISO 25010:2023 (valida se é carregada a lista de aprovados no curso de Sistemas de Informação do campus de Seropédica)', () => {
        cy.get('#container').each(() => {
            cy.get('.row').each(($el, index) => {
                if (index === 0) {
                    cy.wrap($el).each(() => {
                        cy.contains('Sistemas de Informação').click()
                        cy.url().should('include', arquivoSistemasDeInformacao)
                    })
                }
            })
        })
    })

    const urlsSecaoDeDuvidas = [
        '/etnico-racial/ppi/',
        '/faq/gerais/',
        '/faq/pcd/',
        '/faq/renda/',
        '/faq/solicitacao-de-matricula/'
    ]

    it('Teste de Ajuda e Documentação das Heurísticas de Nielsen (validar se todos os links do dropdown de dúvidas e o Mapa do Site estão funcionando corretamente)', () => {
        cy.contains('Mapa do Site').click()
        cy.url().should('eq', 'http://r1.ufrrj.br/sisu/mapa-do-site/')
        cy.go('back')
        cy.get('#mega-menu-item-1968 > ul > li').each(($el, index) => {
            cy.get('#mega-menu-item-1968').click()
            cy.get('#mega-menu-item-1968 > ul > li').eq(index).click()
            cy.url().should('include', urlsSecaoDeDuvidas[index])
            cy.go('back')
        })
    })

    it('Teste de Capacidade de Interação da ISO 25010:2023 (verifica se o botão de alto contraste funciona corretamente)', () => {
        cy.contains('Alto Contraste').click()
        cy.get('body').should('have.css', 'background-color').and('eq', 'rgb(0, 0, 0)')
        cy.get('body').should('have.css', 'color').and('eq', 'rgb(255, 255, 255)')
        cy.contains('Normal').click()
    })

    it('Teste de Capacidade de Interação da ISO 25010:2023 (verifica se o botão que redireciona para a tela com instruções sobre acessibilidade funciona corretamente)', () => {
        cy.contains('Acessibilidade').click()
        cy.url().should('include', '/acessibilidade/')
        cy.get('#container').get('h2:first').should(($h2) => {
            expect($h2).to.contain('Acessibilidade')
        })
        
    })
})