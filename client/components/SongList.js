import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
const query = gql`
{
	songs{
        id
        title
        like
    }
}`;

const queryById = gql`
query QuerrySong($id: ID){
    song(id: $id){
      id
      title
      like
    }
}
`;

const deleteSongById = gql`
mutation DeleteSong($id: ID){
    deleteSong(id: $id){
      id
    }
}
`;
const onLikeSong = gql`
mutation LikeSong($id: ID){
    likeSong(id: $id){
      id
      title
      like
    }
}
`

class SongList extends Component {
    constructor(props) {
        super(props)
        this.deleteSong = this.deleteSong.bind(this)
        this.onLikeSong = this.onLikeSong.bind(this)
    }
    deleteSong(value) {
        this.props.deleteSongById({
            variables: { id: value },
            refetchQueries: [{ query }]
        }).then(console.log('Successs')).catch(e => console.log(e.message))
    }
    onLikeSong(id, like) {
        this.props.onLikeSong({
            variables: { id: id },
            optimisticResponse: {
                _typeName: 'Mutation',
                likeSong: {
                    id: id,
                    _typeName: 'SongType',
                    like: like + 1
                }
            }
        }).then(console.log('Like success')).catch(e => console.log(e.message))
    }
    render() {
        console.log(this.props)
        if (this.props.data.loading) { return <div>Loading...</div> }
        return (
            <div className="collection">
                {this.props.data.songs.map((item, index) => <li key={index} className="collection-item">{item.title}
                    <div style={{ float: 'right' }}>
                        {item.like}
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOReD_az8nXWny-TlP8j2Hf3NRV9hUi_YnNalgSEWcsBrrGA7x" style={{ width: '20px', cursor: 'pointer' }} onClick={e => this.onLikeSong(item.id, item.like)} />
                        <a style={{ float: 'right', cursor: 'pointer' }} onClick={e => this.deleteSong(item.id)}>Delete</a>
                    </div>
                </li>)}
            </div>
        );
    }
}

// export default graphql(query)(
//     graphql(deleteSongById)(
//         graphql(onLikeSong)(SongList)
//     )
// );

export default compose(
    graphql(query),
    graphql(deleteSongById, { name: "deleteSongById" }),
    graphql(onLikeSong, { name: "onLikeSong" }),
)(SongList);