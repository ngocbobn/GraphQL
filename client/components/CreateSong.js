import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
const mutation = gql`
mutation AddSong($title: String){
    addSong(title: $title){
      id
      title
    }
}`;

class CreateSong extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ''
        }
    }
    createSong() {
        this.props.mutate({
            variables: {
                title: this.state.title
            }
        })
    }
    render() {
        console.log(this.props)
        return (
            <div>
                <input value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
                <button onClick={this.createSong.bind(this)}>Click me</button>
            </div>
        );
    }
}

export default graphql(mutation)(CreateSong);