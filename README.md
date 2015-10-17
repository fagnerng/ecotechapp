# Ecotech App

Aplicação mobile, utilizando os frameworks Cordova, Ionic e AngularJS.

# Requisitos/Instalação

1. É necessário instalar [Nodejs 0.12.X](https://nodejs.org/), [Android SDK](https://developer.android.com/sdk/index.html) e [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).

2. Adicionar Android SDK e Java JDK no path. Alguma coisa como:
```
ANDROID_HOME=/Users/matheussampaio/android/android-sdk-macosx
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home
```

3. Instalar [Cordova 5.1.X](https://cordova.apache.org/):
```
$ npm install -g cordova@5.1.X
```

4. Instalar dependencias:
```
$ npm install
```

# Desenvolvimento

#### Requisitos:

Além dos requisitos do projeto, **recomendo** instalar Gulp, Bower e Ionic como dependencias globais, para facilitar a utilização deles em desenvolvimento.

1. Instalar [Gulp 3.9.X](http://gulpjs.com/), [Bower 1.4.X](http://bower.io/), e [Ionic 1.6.X](http://ionicframework.com/) (Isso pode demorar um pouco, então vá buscar um café):
```
$ npm install -g gulp@3.9.x bower@1.4.X ionic@1.6.X
```

#### Guia Rápido:

* **Principal:** Compila todo o projeto e adiciona watchers para quando houver alguma alteração, iniciar uma recompilação.
```
$ gulp debug
```

* **Instalar** aplicação no celular. Execute esse comando após ter dado build no projeto via `gulp debug` ou `gulp build`. 
```
$ ionic run android
```

* **Compilar** todo o projeto.
```
$ gulp build
```

* **Compila** o projeto e depois **Instala** a aplicação no celular.
```
$ gulp install
```

* **Dia-a-dia**: Execute `gulp debug` em um console. Em outro console, execute `ionic run android` para instalar a aplicação.

#### Gulp:

A aplicação utiliza do **Gulp** para automatizar tarefas simples (ou não) que seriam feitas pelo desenvolver e além de melhorar a qualidade do código, facilitar a vida do programador. Por exemplo, nesse projeto o Gulp automatiza tarefas como injetar CSS, Javascript e Bibliotecas no `index.html`, evitando de que o desenvolvedor tenha que manualmente inserir script tags no html, o que além de custar tempo, pode eventualmente levar a bugs (quando alguma tag estiver faltando). O Gulp também é responsável por tarefas mais complexas, como gerar Iconfont dos arquivos SVG, transformar o código de ES6 para ES5, analisar o código com JSHint e JSCS, compilar SASS, minimificar e concatenar o código se for release, etc.

#### Executar o Gulp:

Para executar alguma tarefa do Gulp, na pasta do projeto, execute `gulp <tarefa> [ options ... ]`, onde `<tarefa>` deve ser substituido pelo nome da tarefa e `[ options ... ]` são parâmetros que podem ser passados para a `<tarefa>`.

#### Principais tarefas:


* **build:**

  Executa toda a série de tarefas para compilar o código, sass, html, etc.

  Options:

  * `[ --release ]`: Compila o projeto para release e desativa o DEBUG_MODE.
  * `[ --proxy | -x ]`: Seta PROXY_MODE para verdadeiro.

  Exemplo:
  ```
  $ gulp build --release
  ```

* **debug:**

  Executa a tarefa `build` e em seguida inicia `watchers` para compilar o código quando os arquivos forem alterados. Assim o desenvolvedor pode deixar esse processo executando enquando desenvolve a aplicação.

  Options:

  * `[ --emulate | -e ]`: Executa a aplicação no emulador.
  * `[ --run | -r ]`: Executa a aplicação no celular.
  * `[ --platform=PLATFORM | -p=PLATFORM ]`: Seleciona a plataforma desejada (`ios`, `android`). `android` é a padrão.
  * `[ --live | -l ]`: Adiciona livereload a aplicação, assim, qualquer alteração no código, será refletida na aplicação automaticamente.
  * `[ --serve | -s ]`: Inicia servidor para debugar a aplicação no browser.
  * `[ --lab | -b ]`: Adiciona modo lab em ionic:serve (mostrar ios e android no browser).
  * `[ --release ]`: Compila o projeto para release e desativa o DEBUG_MODE.
  * `[ --proxy | -x ]`: Seta PROXY_MODE para verdadeiro.

  Exemplo:

  ```
  $ gulp debug -lrx
  $ gulp debug --live --run --proxy
  $ gulp debug -r -p ios
  ```

* **install:**

  Executa a tarefa `build` e em seguida instala a aplicação no celular.

  Options:

  * `[ --platform=PLATFORM | -p=PLATFORM ]`: Seleciona a plataforma desejada (`ios`, `android`). `android` é a padrão.
  * `[ --release ]`: Compila o projeto para release e desativa o DEBUG_MODE.
  * `[ --proxy | -x ]`: Seta PROXY_MODE para verdadeiro.

  Exemplo:

  ```
  $ gulp install
  ```

Para mais detalhes sobre as tarefas do Gulp, execute `gulp help` no console (na pasta do projeto) ou olhe diretamente no arquivo `gulpfile.js`.

#### Projeto:

O projeto segue o padrão Angular definido em [johnpapa/angular-styleguide](https://github.com/johnpapa/angular-styleguide/tree/f30f85d5ea2d98b88f557de964534940cfaaa3ae) (23/jun/2015).

O Javascript segue o padrão definido em [airbnb/javascript](https://github.com/airbnb/javascript/tree/bd98ed3b285f837382bea08a53656fe16662a27e) (23/jun/2015).


# Ajuda

Se tiver alguma dúvida quanto aos comandos no console, tente executar um dos três comandos abaixo:
```
$ ionic help
$ cordova help
$ gulp help
```

# Licença

#### @TODO: Verificar qual licença será utilizada.
