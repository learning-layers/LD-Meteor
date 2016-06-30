import { Mongo } from 'meteor/mongo'
import { EtherpadSessionSchema } from './schema'

export const EtherpadSessions = new Mongo.Collection('EtherpadSessions')
EtherpadSessions.attachSchema(EtherpadSessionSchema)
