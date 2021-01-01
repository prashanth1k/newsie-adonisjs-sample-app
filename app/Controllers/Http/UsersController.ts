import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async login({ request, response, auth, session }: HttpContextContract) {
    try {
      await auth.attempt(request.input('email'), request.input('password'))
      return response.redirect('/')
    } catch (e) {
      session.flash('notification', 'Login failed. Check email/password & retry.')
      return response.redirect('back')
    }
  }

  public async register({ request, auth, response, session }: HttpContextContract) {
    const valSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'email' }),
        rules.maxLength(255),
        rules.email(),
      ]),
      password: schema.string({ trim: true }, [rules.maxLength(180), rules.required()]),
    })

    const data = await request.validate({
      schema: valSchema,
      messages: {
        'email.unique': 'Email already exists',
        'email.maxLength': 'Email can be upto 255 characters',
        'email.email': 'Invalid email',
      },
    })
    const user = await User.create({
      email: data.email,
      password: data.password,
    })

    await auth.login(user)
    session.flash('notification', 'Registered.')
    return response.redirect('/')
  }

  public async showLogin({ view }: HttpContextContract) {
    return view.render('auth/login', { user: { email: '', password: '' } })
  }

  public async showRegister({ view }: HttpContextContract) {
    return view.render('auth/register', { user: { name: '', email: '', password: '' } })
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/')
  }
}
