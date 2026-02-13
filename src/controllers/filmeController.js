import * as model from "../models/filmeModel.js";

export const getAll = async (req, res) => {
  try {
    const filmes = await model.findAll(req.query);

    if (!filmes || filmes.length === 0) {
      return res.status(200).json({
        message: "Nenhum registro encontrado.",
      });
    }
    res.json(filmes);
  } catch (error) {
    console.error("Erro ao buscar:", error);
    res.status(500).json({ error: "Erro ao buscar filmes" });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados do filme!",
      });
    }

    const { titulo, descricao, duracao, genero, nota } = req.body;

    if (!titulo || typeof titulo !== "string" || titulo.trim().length < 3) {
      return res.status(400).json({
        error:
          "O título (titulo) é obrigatório e deve ter no mínimo 3 caracteres!",
      });
    }

   const tituloExistente = await model.findByTitulo(titulo);
    if (tituloExistente) {
      return res.status(400).json({
        error: "Já existe um filme com esse título.",
      });
    }

    if (!descricao || typeof descricao !== "string" || descricao.trim().length < 10) {
      return res.status(400).json({
        error:
          "A descrição (descricao) é obrigatória e deve ter no mínimo 10 caracteres!",
      });
    }

    const dur = parseInt(duracao);
    if (isNaN(dur) || dur <= 0) {
      return res.status(400).json({
        error: "A duração deve ser um número inteiro positivo.",
      });
    }
    if (dur > 300) {
      return res.status(400).json({
        error:
          "Filmes com duração superior a 300 minutos não podem ser cadastrados.",
      });
    }

    const generos_permitidos = [
      "Ação",
      "Drama",
      "Comédia",
      "Terror",
      "Romance",
      "Animação",
      "Ficção Científica",
      "Suspense",
    ];

    if (!genero || !generos_permitidos.includes(genero)) {
      return res.status(400).json({
        error: `O gênero deve ser um dos valores: ${generos_permitidos.join(", ")}.`,
      });
    }

    const rating = parseFloat(nota);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      return res.status(400).json({
        error: "A nota deve estar entre 0 e 10.",
      });
    }

    const data = await model.create({
      titulo,
      descricao,
      duracao: dur,
      genero,
      nota: rating,
      disponivel: true,
    });

    res.status(201).json({
      message: "Filme cadastrado com sucesso!",
      data,
    });
  } catch (error) {
    console.error("Erro ao criar:", error);
    res.status(500).json({ error: "Erro interno no servidor ao salvar o filme." });
  }
};

export const getById = async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    if (isNaN(idNum)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const data = await model.findById(idNum);
    if (!data) {
      return res.status(404).json({ error: "filme não encontrado." });
    }
    res.json({ data });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    res.status(500).json({ error: "Erro ao buscar filme" });
  }
};

export const update = async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ error: "ID inválido." });

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados do filme!",
      });
    }

    const exists = await model.findById(idNum);
    if (!exists) {
      return res.status(404).json({ error: "Filme não encontrado para atualizar." });
    }

    if (exists.disponivel === false) {
      return res.status(400).json({
        error: "Filmes indisponíveis não podem ser atualizados.",
      });
    }

    const data = await model.update(idNum, req.body);
    res.json({
      message: `O registro "${data.titulo}" foi atualizado com sucesso!`,
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ error: "Erro ao atualizar registro" });
  }
};

export const remove = async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ error: "ID inválido." });

    const exists = await model.findById(idNum);
    if (!exists) {
      return res.status(404).json({ error: "Filme não encontrado para deletar." });
    }

    if (exists.nota >= 9) {
      return res.status(400).json({
        error: "Filmes com nota maior ou igual a 9 não podem ser deletados.",
      });
    }

    await model.remove(idNum);
    res.json({
      message: `O registro "${exists.titulo}" foi deletado com sucesso!`,
      deletado: exists,
    });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: "Erro ao deletar registro" });
  }
};
