import React, {Component} from 'react'
import {composeWithTracker} from 'react-komposer'
import {Meteor} from 'meteor/meteor'
import { Todos } from '../../lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('todos')
  if (handle.ready()) {
    let todos = Todos.find({}).fetch()
    onData(null, {todos})
  }
}

class TodoList extends Component {
  render () {
    const {todos} = this.props
    return (
      <div className='ld-todolist'>
        {todos.map(function (todo) {
          return <div key={'todo-' + todo._id}>
            {todo.title}
          </div>
        })}
      </div>
    )
  }
}

TodoList.propTypes = {
  todos: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(TodoList)
