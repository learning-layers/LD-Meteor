import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const SearchItems = new Mongo.Collection('SearchItems')

if (Meteor.isServer) {
  SearchItems._ensureIndex({ text: 'text' }, {'weights': { text: 1 }})
}

