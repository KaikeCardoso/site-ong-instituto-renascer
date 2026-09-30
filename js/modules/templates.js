// js/modules/templates.js
// Responsabilidade única: montar strings de HTML (templates dinâmicos)
// para cada rota da SPA. Nenhum módulo aqui mexe no DOM diretamente —
// só devolve marcação pronta para o router injetar.

window.Renascer = window.Renascer || {};

Renascer.Templates = (function () {
  function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
  }

  function home() {
    return `
      <h1>Instituto Renascer</h1>

      <section>
        <h2>Quem somos</h2>
        <picture>
          <source
            type="image/webp"
            srcset="../imagens/otimizadas/equipe-voluntarios-400w.webp 400w,
                    ../imagens/otimizadas/equipe-voluntarios-800w.webp 800w,
                    ../imagens/otimizadas/equipe-voluntarios-1200w.webp 1200w"
            sizes="(max-width: 600px) 100vw, 800px"
          >
          <img
            src="../imagens/otimizadas/equipe-voluntarios-800w.jpg"
            srcset="../imagens/otimizadas/equipe-voluntarios-400w.jpg 400w,
                    ../imagens/otimizadas/equipe-voluntarios-800w.jpg 800w,
                    ../imagens/otimizadas/equipe-voluntarios-1200w.jpg 1200w"
            sizes="(max-width: 600px) 100vw, 800px"
            alt="Voluntários do Instituto Renascer reunidos em uma ação comunitária"
            width="800" height="430" decoding="async" fetchpriority="high"
          >
        </picture>
        <p>
          O Instituto Renascer é uma organização do terceiro setor dedicada a
          apoiar famílias em situação de vulnerabilidade social por meio de
          educação, geração de renda e assistência comunitária.
        </p>
        <h3>Nossa missão</h3>
        <p>
          Promover dignidade e oportunidades reais de transformação social,
          conectando doadores, voluntários e comunidades.
        </p>
      </section>

      <section>
        <h2>Nosso impacto</h2>
        <p>Desde 2015, já impactamos diretamente mais de 4.000 pessoas em 12 comunidades.</p>
        <h3>Números de 2025</h3>
        <p>320 famílias atendidas · 180 voluntários ativos · 45 projetos concluídos.</p>
      </section>
    `;
  }

  function projetos() {
    return `
      <h1>Nossos Projetos</h1>

      <section>
        <h2>Iniciativas em andamento</h2>
        <p>Conheça as frentes de trabalho que mantemos ativas com o apoio de voluntários e doadores.</p>

        <div class="projetos-grid grid-12">
          <div class="projeto">
            <span class="badge badge-primary">Educação</span>
            <h3>Educação para Todos</h3>
            <p>Reforço escolar gratuito para crianças de 6 a 14 anos em situação de vulnerabilidade.</p>
          </div>

          <div class="projeto">
            <span class="badge badge-accent">Renda</span>
            <h3>Mãos que Trabalham</h3>
            <p>Cursos profissionalizantes de costura e artesanato para geração de renda familiar.</p>
          </div>

          <div class="projeto">
            <span class="badge badge-success">Assistência</span>
            <h3>Alimento Solidário</h3>
            <p>Distribuição mensal de cestas básicas para famílias cadastradas em nossa rede.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Como você pode ajudar</h2>
        <p>
          Seja através de doações financeiras, doações de materiais ou trabalho voluntário,
          toda contribuição amplia o alcance dos nossos projetos.
        </p>
        <h3>Quer se envolver?</h3>
        <p>Faça seu <a href="#/cadastro" data-rota>cadastro como doador ou voluntário</a> e entraremos em contato.</p>
      </section>
    `;
  }

  function listaCadastros(cadastros) {
    if (!cadastros.length) {
      return `<p class="lista-cadastros-vazia">Nenhum cadastro salvo neste navegador ainda.</p>`;
    }

    const itens = cadastros
      .map(
        (c) => `
        <li>
          <strong>${escapar(c.nome)}</strong> — ${escapar(c.tipo)}
          <br><small>${escapar(c.cidade)} · enviado em ${escapar(c.dataEnvio)}</small>
        </li>`
      )
      .join("");

    return `<ul class="lista-cadastros">${itens}</ul>`;
  }

  function cadastro(cadastrosSalvos) {
    return `
      <h1>Cadastro de Doadores e Voluntários</h1>

      <section>
        <h2>Junte-se a nós</h2>
        <p>Preencha o formulário abaixo para se cadastrar como doador ou voluntário. Todos os campos marcados são obrigatórios.</p>

        <div class="alert alert-info">
          <span class="alert-icon" aria-hidden="true">ℹ️</span>
          <span>Seus dados são usados apenas para contato do Instituto Renascer e nunca são compartilhados com terceiros.</span>
        </div>

        <form id="form-cadastro" novalidate>
          <fieldset>
            <legend>Dados pessoais</legend>

            <label for="nome">Nome completo</label>
            <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo"
                   required minlength="5" pattern="[A-Za-zÀ-ÿ ]+"
                   title="Digite apenas letras e espaços">
            <small>Ex: Maria da Silva</small>

            <label for="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00"
                   required inputmode="numeric"
                   pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"
                   title="Formato esperado: 000.000.000-00" maxlength="14">
            <small>Somente números, a máscara é aplicada automaticamente</small>

            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="seuemail@exemplo.com" required>
            <small>Usaremos para enviar novidades e comprovantes</small>

            <label for="telefone">Telefone</label>
            <input type="tel" id="telefone" name="telefone" placeholder="(00) 00000-0000"
                   required inputmode="numeric"
                   pattern="\\(\\d{2}\\) \\d{4,5}-\\d{4}"
                   title="Formato esperado: (00) 00000-0000" maxlength="15">
            <small>Com DDD, ex: (11) 91234-5678</small>
          </fieldset>

          <fieldset>
            <legend>Endereço</legend>

            <label for="cep">CEP</label>
            <input type="text" id="cep" name="cep" placeholder="00000-000"
                   required inputmode="numeric"
                   pattern="\\d{5}-\\d{3}"
                   title="Formato esperado: 00000-000" maxlength="9">
            <small>Usado apenas para saber sua região</small>

            <label for="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" placeholder="Sua cidade" required>
          </fieldset>

          <fieldset>
            <legend>Como deseja ajudar?</legend>

            <label for="tipo">Tipo de participação</label>
            <select id="tipo" name="tipo" required>
              <option value="">Selecione uma opção</option>
              <option value="doador">Doador</option>
              <option value="voluntario">Voluntário</option>
              <option value="ambos">Ambos</option>
            </select>
          </fieldset>

          <button type="submit">Enviar cadastro</button>
        </form>
      </section>

      <section>
        <h2>Últimos cadastros salvos neste navegador</h2>
        <p><small>Guardados via <code>localStorage</code> — some se você limpar os dados do navegador.</small></p>
        <div id="lista-cadastros">${listaCadastros(cadastrosSalvos)}</div>
      </section>
    `;
  }

  return { home, projetos, cadastro, listaCadastros };
})();
