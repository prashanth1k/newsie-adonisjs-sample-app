import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, computed, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public title: String

  @column()
  public content: String
  @column()
  public slug: String

  @column.dateTime({ autoCreate: true })
  public publishDate: DateTime

  @hasOne(() => User)
  public author: HasOne<typeof User>

  @computed()
  public get fmtContent() {
    const marked = require('marked')
    return this.content ? marked(this.content) : ''
  }

  @beforeSave()
  public static async slugify(article: Article) {
    const slugify = require('slugify')

    if (!article.$original.slug && !article.$attributes.slug) {
      article.slug = slugify(article.title, { lower: true, strict: true })
    } else if (article.$dirty.slug) {
      article.slug = slugify(article.slug, { lower: true, strict: true })
    }
  }
}
