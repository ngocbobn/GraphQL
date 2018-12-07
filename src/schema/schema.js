import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } from 'graphql';
import _ from 'lodash';
import axios from 'axios';

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        address: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(res => res.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then(res => res.data)
            }
        },
        test: {
            type: UserType,
            args: { age: { type: GraphQLInt } },
            resolve(parentValue, args) {
                return _.find(users, { age: args.age })
            }
        },
        getAll: {
            type: UserType,
            args: {},
            resolve(parentValue, args) {
                return users;
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { firstName, age, companyId }) {
                return axios.post('http://localhost:3000/users', { firstName, age, companyId }).then(res => res.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return axios.delete(`http://localhost:3000/users/${args.id}`).then(res => res.data)
            }
        }
    }
})

const graph = new GraphQLSchema({
    query: RootQuery,
    mutation
})

export default graph;
