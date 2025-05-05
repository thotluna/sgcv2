import { authFactory } from '@auth/auth.factory'
import { type Application } from 'express'

export class RouteManaget {
  private static instance: RouteManaget
  private app: Application

  private constructor(app: Application) {
    this.app = app
    this.addAuthRoute()
  }

  public static getInstance(app: Application) {
    if (!this.instance) {
      this.instance = new RouteManaget(app)
    }

    return this.instance
  }

  private addAuthRoute() {
    const authRoute = authFactory({})
    authRoute.initializeRoutes(this.app)
  }
}
