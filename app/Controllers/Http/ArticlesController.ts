import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Article from 'App/Models/Article'

export default class ArticlesController {
  public async index(ctx: HttpContextContract) {
    const articles = await Article.all()
    return ctx.view.render('articles/index', { articles })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('articles/new', { article: {} })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const data = await this.validateInput(request)

    await Article.create({
      title: data.title,
      content: request.input('content'),
      slug: request.input('slug'),
    })
    // return response.redirect(`/articles/${article.slug}`)
    session.flash('notification', 'Article saved.')
    return response.redirect().back()
  }

  public async show(ctx: HttpContextContract) {
    const article = await Article.findBy('slug', ctx.params.id)
    return ctx.view.render('articles/_id', { article })
  }

  public async edit({ view, params }: HttpContextContract) {
    const article = await Article.findBy('id', params.id)
    return view.render('articles/edit', { article: article })
  }

  public async update({ request, params, response, session }: HttpContextContract) {
    const data = await this.validateInput(request)
    const article = await Article.findByOrFail('id', params.id)
    article.merge({
      title: data.title,
      content: request.input('content'),
      slug: request.input('slug'),
    })
    await article.save()
    session.flash('notification', 'Article saved.')
    return response.redirect().back()
  }

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {
    const valSchema = schema.create({
      title: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'title.required': 'Title is required',
        'title.maxLength': 'Title allows upto 150 characters',
      },
    })
  }
}
