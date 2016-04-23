import { Meteor } from 'meteor/meteor';
import { Todos } from '../lib/collections';

Meteor.publish('todos', function() {
  return Todos.find({});
});