import { Mongo } from 'meteor/mongo'

var _Todos = new Mongo.Collection('Todos')

export const Todos = _Todos
