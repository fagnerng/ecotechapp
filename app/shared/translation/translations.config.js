/**
 * Created by fagnerng on 18/10/2015.
 */
(function() {
    'use strict';
angular.module('translations')
    .config(TranslationsConfig);
    var ptBr = {
        appName: 'Ecotech App',
        menu: {
            home: 'Inicio',
            about: 'Sobre',
            gardens: 'Hortas',
            plants: 'Plantas',
            tips: 'Dicas',
        },
        title: {
            home: 'Ecotech',
            about: 'Sobre',
            gardens: 'Hortas',
            plants: 'Plantas',
            tips: 'Dicas',
        },
        alert: {
            noGardens: 'Sem hortas',
            addMoreGardens: 'Adicione novas hortas para continuar',
        },
        tips: {
            title:'COMO ESCOLHER O LOCAL IDEAL',
            hint: 'Apenas 10m&#178; s&#227;o necess&#225;rios para o cultivo de uma HORTA DOM&#201;STICA, seguindo algumas regras:',
            0: 'O local escolhido deve receber a luz direta do sol por no m&#237;nimo 5 horas di&#225;rias.',
            1: 'Os canteiros devem ser feitos na dire&#231;&#227;o norte-sul, ou voltados para o norte para aproveitar melhor o sol.',
            2: 'A face SUL da HORTA deve estar protegida, pois nessa face os ventos frios prejudicam ou at&#233; impedem o desenvolvimento de hortali&#231;as em geral. De maneira geral ventos fortes, de qualquer dire&#231;&#227;o, n&#227;o s&#227;o bem vindos. Caso o local que voc&#234; escolheu tenha a face sul desprotegida voc&#234; deve proteg&#234;-la fazendo um "quebra vento", que pode ser com o plantio de uma cerca viva de arbustos ou mesmo com a constru&#231;&#227;o de uma mureta ou de uma cerca bem fechada.',
            3: 'O local escolhido n&#227;o pode estar sujeito a encharcamentos ou alagamentos, nesse caso voc&#234; dever&#225; elevar os canteiros - veja parte 02 montagem dos canteiros construindo muretas de alvenaria.',
            4: 'D&#234; prefer&#234;ncia a um local que tenha uma fonte de &#225;gua pot&#225;vel pr&#243;xima e aonde possa ser constru&#237;do um abrigo para os equipamentos e materiais.',
            5: 'As dimens&#245;es de um canteiro podem variar. A largura deve possibilitar o trabalho no canteiro de um s&#243; lado- onde alcance o bra&#231;o- at&#233; 1 metro a 1,20 metros. O comprimento n&#227;o deve ultrapassar os 10m para facilitar a circula&#231;&#227;o dentro da horta.',
            6: 'Dica importante: A melhor &#225;gua para a rega da sua HORTA &#233; a &#225;gua de CHUVA. Aproveite a &#225;gua de chuva colhendo-a atrav&#233;s da calha de seu telhado armazenando-a em um tambor ou em uma caixa d\'&#225;gua.',
        },

        button: {
            previous: 'Anterior',
            next: 'Pr&#243;xima',
        },

        plant: {
            alecrim: 'Alecrim',
            cebolinha: 'Cebolinha',
            coentro: 'Coentro',
            hortela: 'Hortel&#227;',
            manjericao: 'Manjeric&#227;o',
            oregano: 'Or&#233;gano',
            salsinha: 'Salsinha',
            salvia: 'Salvia',
            tomilho: 'Tomilho',
        },
        description: {
            alecrim: 'Usado no preparo de carnes, ensopados, aves,peixes, verduras e legumes.',
            cebolinha: 'Pratos salgados em geral, saladas, queijos, pat&#234;s, sopas, molhos e risotos.',
            coentro: 'Harmoniza com saladas, legumes, sopas, frutos do mar, peixes, carnes, arroz e molhos.',
            hortela: 'As folhas v&#227;o bem em pratos doces e em salgados. Muito usada em drinks.',
            manjericao: 'Combina com pratos &#224; base de tomate, sopas, massas, saladas e carne vermelha.',
            oregano: 'Um tempero muito usado na cozinha italiana, vai bem com saladas e molhos de tomate.',
            salsinha: '&#211;tima para temperar carnes vermelhas, aves e peixes. Combina com molhos, legumes e sopas.',
            salvia: 'Aves combinam com o sabor da s&#225;lvia, al&#233;m de cremes, queijos e molhos.',
            tomilho: 'Bom para carne vermelha, su&#237;na, aves e peixes, al&#233;m de pat&#234;s, sopas, pur&#234;s e molhos de tomate.',
        },
        remove: 'Remover',
    };

    function TranslationsConfig($translateProvider) {
        $translateProvider.translations('br',ptBr );
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage('br');
    }
})();