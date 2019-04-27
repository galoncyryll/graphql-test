const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

//dummy data
let books = [
    {name: 'book1', genre:'genre1', id: '1', authorId: '1'},
    {name: 'book2', genre:'genre3', id: '2', authorId: '2'},
    {name: 'book3', genre:'genre3', id: '3', authorId: '3'},
    {name: 'book4', genre:'genre1', id: '4', authorId: '1'},
    {name: 'book5', genre:'genre1', id: '5', authorId: '1'},
]

let author = [
    {name: 'auth1', age:'22', id: '1'},
    {name: 'auth2', age:'23', id: '2'},
    {name: 'auth3', age:'24', id: '3'},
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(author, {id: parent.authorId});
            }
        }
    }) 
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) { 
                return _.filter(books, { authorId: parent.id})
            }   
        }
    }) 
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: {type:GraphQLID}
            },
            resolve(parent, args) {
                //code to get data from DB
                return _.find(books, {id : args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {type:GraphQLID}
            },
            resolve(parent, args) {
                return _.find(author, {id: args.id})
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return author
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})