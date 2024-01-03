import { GraphQLError } from 'graphql'

export class ExceptionHandler extends GraphQLError {
    public errorCode: number

    constructor(error: { errorCode: number; message: string }) {
        super(error.message)
        this.extensions.errorCode = error.errorCode || 999999
    }
}
